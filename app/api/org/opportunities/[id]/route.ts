import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/supabaseServer";
import { handleApiError } from "@/lib/apiHelpers";
import { requireOrgContext } from "@/lib/orgApi";
import type { RequiredSkillJson } from "@/lib/types";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = new Set(["active", "closed"]);

interface OpportunityPatchInput {
  title_ar?: string;
  description?: string;
  company?: string;
  location?: string;
  employment_type?: string;
  url?: string | null;
  status?: string;
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

/**
 * PATCH /api/org/opportunities/[id] — تعديل فرصة تملكها المنظمة الحالية.
 * الحقول المسموحة فقط؛ أي حقل آخر يُتجاهل.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId, user } = auth;

    const org = await requireOrgContext(supabase, user);
    if (!org.ok) return org.response;

    const body = (await req.json()) as OpportunityPatchInput;

    const updates: Record<string, unknown> = {};
    if (body.title_ar !== undefined) {
      const t = body.title_ar.trim();
      if (!t) {
        return NextResponse.json({ error: "عنوان الفرصة مطلوب" }, { status: 400 });
      }
      updates.title_ar = t;
    }
    if (body.description !== undefined) {
      const d = body.description.trim();
      if (!d) {
        return NextResponse.json({ error: "وصف الفرصة مطلوب" }, { status: 400 });
      }
      updates.description = d;
    }
    if (body.company !== undefined) updates.company = body.company.trim() || null;
    if (body.location !== undefined) updates.location = body.location.trim() || null;
    if (body.employment_type !== undefined)
      updates.employment_type = body.employment_type.trim() || null;
    if (body.url !== undefined) updates.url = body.url?.trim() || null;
    if (body.status !== undefined) {
      if (!ALLOWED_STATUSES.has(body.status)) {
        return NextResponse.json({ error: "حالة غير صالحة" }, { status: 400 });
      }
      updates.status = body.status;
    }
    if (Array.isArray(body.required_skills)) {
      let skills = body.required_skills
        .map(sanitizeRequiredSkills)
        .filter((s): s is RequiredSkillJson => s !== null);

      // إزالة التكرار
      skills = [...new Map(skills.map((s) => [s.skill_id, s])).values()];

      if (skills.length > 0) {
        const { data: known, error: skillsError } = await supabase
          .from("skills")
          .select("id")
          .in(
            "id",
            skills.map((s) => s.skill_id)
          );
        if (skillsError) throw skillsError;
        const knownIds = new Set((known ?? []).map((s: { id: string }) => s.id));
        skills = skills.filter((s) => knownIds.has(s.skill_id));
      }
      updates.required_skills = skills;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "لا توجد حقول للتحديث" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("opportunities")
      .update(updates)
      .eq("id", params.id)
      .eq("posted_by", userId)
      .select("*, organization:organizations(id,name,logo_url)")
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "الفرصة غير موجودة" }, { status: 404 });
    }

    return NextResponse.json({ opportunity: data });
  } catch (err) {
    return handleApiError(err);
  }
}

/** DELETE /api/org/opportunities/[id] — حذف فرصة تملكها المنظمة الحالية. */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId, user } = auth;

    const org = await requireOrgContext(supabase, user);
    if (!org.ok) return org.response;

    const { data, error } = await supabase
      .from("opportunities")
      .delete()
      .eq("id", params.id)
      .eq("posted_by", userId)
      .select("id");

    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json({ error: "الفرصة غير موجودة" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
