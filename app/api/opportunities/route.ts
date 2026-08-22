import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/supabaseServer";
import {
  type Opportunity,
  type OpportunityOrgInfo,
  type OpportunityWithMatch,
  type RequiredSkillJson,
} from "@/lib/types";
import { calculateMatch, withSkillNames } from "@/lib/matchScore";
import { handleApiError } from "@/lib/apiHelpers";

export const dynamic = "force-dynamic";

type OpportunityRow = Opportunity & { organization: OpportunityOrgInfo | null };

/**
 * GET /api/opportunities — الفرص مرتبة حسب نسبة توافق المستخدم الحالي تنازلياً.
 * تتضمن معلومات الجهة الناشرة (الاسم والشعار) إن وُجدت.
 * ?id=... لإرجاع فرصة واحدة. القائمة تعرض الفرص النشطة فقط.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId } = auth;

    const id = req.nextUrl.searchParams.get("id");

    let query = supabase
      .from("opportunities")
      .select("*, organization:organizations(id,name,logo_url)");

    // قائمة الباحثات عن العمل تعرض الفرص النشطة فقط، أما صفحة فرصة محددة فتبقى متاحة
    if (!id) query = query.eq("status", "active");

    const [{ data: skills }, { data: userSkills }, { data: opportunities, error }] =
      await Promise.all([
        supabase.from("skills").select("*"),
        supabase.from("user_skills").select("*").eq("user_id", userId),
        query.order("created_at"),
      ]);
    if (error) throw error;

    const skillsById = new Map(
      (skills ?? []).map((s: { id: string; name_ar: string; name_en: string }) => [
        s.id,
        { name_ar: s.name_ar, name_en: s.name_en },
      ])
    );

    let list = (opportunities ?? []) as OpportunityRow[];
    if (id) {
      list = list.filter((o) => o.id === id);
      if (list.length === 0) {
        return NextResponse.json({ error: "الفرصة غير موجودة" }, { status: 404 });
      }
    }

    const enriched: OpportunityWithMatch[] = list.map((o) => {
      const requiredSkills: RequiredSkillJson[] = (o.required_skills ?? []).filter(
        (r) => skillsById.has(r.skill_id)
      );
      const opp = { ...o, required_skills: requiredSkills };
      const match = withSkillNames(calculateMatch(userSkills ?? [], opp), skillsById);
      return { ...opp, match };
    });

    enriched.sort((a, b) => b.match.score - a.match.score);

    if (id) {
      return NextResponse.json({ opportunity: enriched[0] });
    }
    return NextResponse.json({ opportunities: enriched });
  } catch (err) {
    return handleApiError(err);
  }
}
