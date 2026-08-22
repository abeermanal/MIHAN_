import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin, requireUser } from "@/lib/supabaseServer";
import { handleApiError } from "@/lib/apiHelpers";
import seedData from "../../../seed-data.json";

export const dynamic = "force-dynamic";

interface SeedSkill {
  name_ar: string;
  name_en: string;
  category: string;
}

interface SeedOpportunity {
  title_ar: string;
  company: string;
  description: string;
  location: string;
  employment_type: string;
  required_skills: { skill: string; level: number; is_required: boolean }[];
}

/**
 * POST /api/seed — إدخال البيانات المرجعية من seed-data.json.
 * متاح فقط للمستخدمين المسجلين؛ الكتابة على الجداول المرجعية تتم
 * بمفتاح الخدمة لأن سياسات RLS تجعلها للقراءة فقط أمام المستخدمين.
 * ?force=true لإعادة الإدخال حتى لو كانت البيانات موجودة.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;

    const supabase = getSupabaseAdmin();
    const force = req.nextUrl.searchParams.get("force") === "true";

    const skills = seedData.skills as SeedSkill[];
    const opportunities = seedData.opportunities as SeedOpportunity[];

    // 1) إدخال المهارات (تجاهل المكررات حسب name_en)
    const { error: skillsError } = await supabase
      .from("skills")
      .upsert(skills, { onConflict: "name_en", ignoreDuplicates: false });
    if (skillsError) throw skillsError;

    const { data: allSkills, error: fetchError } = await supabase
      .from("skills")
      .select("id, name_en");
    if (fetchError) throw fetchError;

    const skillIdByName = new Map(
      (allSkills ?? []).map((s: { id: string; name_en: string }) => [s.name_en, s.id])
    );

    // 2) منع التكرار ما لم force
    const { count, error: countError } = await supabase
      .from("opportunities")
      .select("id", { count: "exact", head: true });
    if (countError) throw countError;

    if ((count ?? 0) > 0 && !force) {
      return NextResponse.json({
        ok: true,
        message: "البيانات موجودة مسبقاً — استخدمي ?force=true لإعادة الإدخال.",
        skills: allSkills?.length ?? 0,
        opportunities: count ?? 0,
      });
    }

    // 3) إدخال الفرص مع تحويل أسماء المهارات إلى معرفات
    const rows = opportunities.map((o) => ({
      title_ar: o.title_ar,
      company: o.company,
      description: o.description,
      location: o.location,
      employment_type: o.employment_type,
      required_skills: o.required_skills
        .filter((r) => skillIdByName.has(r.skill))
        .map((r) => ({
          skill_id: skillIdByName.get(r.skill)!,
          level: r.level,
          is_required: r.is_required,
        })),
    }));

    const { data: inserted, error: insertError } = await supabase
      .from("opportunities")
      .upsert(rows, { onConflict: "title_ar" })
      .select("id");
    if (insertError) throw insertError;

    return NextResponse.json(
      {
        ok: true,
        message: "تم إدخال البيانات الأولية بنجاح ✅",
        skills: allSkills?.length ?? 0,
        opportunities: inserted?.length ?? 0,
      },
      { status: 201 }
    );
  } catch (err) {
    return handleApiError(err);
  }
}
