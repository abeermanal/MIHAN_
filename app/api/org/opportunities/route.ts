import { NextResponse, type NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireUser } from "@/lib/supabaseServer";
import { handleApiError } from "@/lib/apiHelpers";
import { requireOrgContext } from "@/lib/orgApi";
import type { RequiredSkillJson } from "@/lib/types";

export const dynamic = "force-dynamic";

const EMPLOYMENT_TYPES = ["دوام كامل", "دوام جزئي", "عمل عن بُعد", "تدريب", "مشروع مؤقت"];

interface OpportunityInput {
  title_ar?: string;
  description?: string;
  company?: string;
  location?: string;
  employment_type?: string;
  url?: string;
  required_skills?: unknown;
}

function sanitizeRequiredSkills(raw: unknown): RequiredSkillJson | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.skill_id !== "string" || !r.skill_id) return null;
  const level = Math.max(0, Math.min(5, Math.round(Number(r.level ?? 1))));
  return {
    skill_id: r.skill_id,
    level,
    is_required: Boolean(r.is_required),
  };
}

/** التحقق من المهارات وإزالة التكرار قبل الحفظ في jsonb */
async function cleanSkills(
  supabase: SupabaseClient,
  raw: unknown
): Promise<RequiredSkillJson[]> {
  if (!Array.isArray(raw)) return [];
  let skills = raw
    .map(sanitizeRequiredSkills)
    .filter((s): s is RequiredSkillJson => s !== null);
  skills = [...new Map(skills.map((s) => [s.skill_id, s])).values()];
  if (skills.length === 0) return [];

  const { data: known, error } = await supabase
    .from("skills")
    .select("id")
    .in(
      "id",
      skills.map((s) => s.skill_id)
    );
  if (error) throw error;
  const knownIds = new Set((known ?? []).map((s: { id: string }) => s.id));
  return skills.filter((s) => knownIds.has(s.skill_id));
}

/**
 * GET /api/org/opportunities — فرص المنظمة الحالية فقط.
 * ?id=... لإرجاع فرصة واحدة من فرص المنظمة (لصفحة التعديل).
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId, user } = auth;

    const org = await requireOrgContext(supabase, user);
    if (!org.ok) return org.response;

    let query = supabase
      .from("opportunities")
      .select("*, organization:organizations(id,name,logo_url)")
      .eq("posted_by", userId)
      .order("created_at", { ascending: false });

    const id = req.nextUrl.searchParams.get("id");
    if (id) query = query.eq("id", id);

    const { data, error } = await query;
    if (error) throw error;

    if (id) {
      if (!data || data.length === 0) {
        return NextResponse.json({ error: "الفرصة غير موجودة" }, { status: 404 });
      }
      return NextResponse.json({ opportunity: data[0] });
    }
    return NextResponse.json({ opportunities: data ?? [] });
  } catch (err) {
    return handleApiError(err);
  }
}

/** POST /api/org/opportunities — إنشاء فرصة جديدة باسم المنظمة الحالية. */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId, user } = auth;

    const org = await requireOrgContext(supabase, user);
    if (!org.ok) return org.response;

    const body = (await req.json()) as OpportunityInput;

    const title = body.title_ar?.trim();
    const description = body.description?.trim();
    if (!title) {
      return NextResponse.json({ error: "عنوان الفرصة مطلوب" }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: "وصف الفرصة مطلوب" }, { status: 400 });
    }

    const requiredSkills = await cleanSkills(supabase, body.required_skills);

    const employmentType =
      typeof body.employment_type === "string" &&
      EMPLOYMENT_TYPES.includes(body.employment_type)
        ? body.employment_type
        : null;

    const { data: created, error: insertError } = await supabase
      .from("opportunities")
      .insert({
        title_ar: title,
        description,
        company: org.organization.name,
        location: body.location?.trim() || null,
        employment_type: employmentType,
        url: body.url?.trim() || null,
        status: "active",
        required_skills: requiredSkills,
        organization_id: org.organization.id,
        posted_by: userId,
      })
      .select("*, organization:organizations(id,name,logo_url)")
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ opportunity: created }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
