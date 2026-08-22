import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/supabaseServer";
import { type Opportunity, type UserSkill } from "@/lib/types";
import { getResourcesForSkill } from "@/lib/resources";
import { handleApiError } from "@/lib/apiHelpers";

export const dynamic = "force-dynamic";

/** GET /api/learning-path — عناصر مسار التعلم مع أسماء المهارات */
export async function GET() {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId } = auth;

    const { data, error } = await supabase
      .from("learning_path_items")
      .select("*, skills(name_ar, name_en)")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ items: data ?? [] });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST /api/learning-path — إنشاء خطة تعلم للمستخدم الحالي.
 * الجسم: { opportunity_id } لسد فجوات فرصة محددة، أو { skill_ids: [] } لمهارات مباشرة.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId } = auth;

    const body = await req.json();

    let skillIds: string[] = Array.isArray(body.skill_ids)
      ? body.skill_ids.map(String)
      : [];
    let opportunityId: string | null =
      typeof body.opportunity_id === "string" ? body.opportunity_id : null;

    // من فرصة: خذ فقط المهارات الناقصة
    if (opportunityId && skillIds.length === 0) {
      const [{ data: opp }, { data: userSkills }] = await Promise.all([
        supabase.from("opportunities").select("*").eq("id", opportunityId).single(),
        supabase.from("user_skills").select("*").eq("user_id", userId),
      ]);
      if (!opp) {
        return NextResponse.json({ error: "الفرصة غير موجودة" }, { status: 404 });
      }
      const o = opp as Opportunity;
      const us = (userSkills ?? []) as UserSkill[];
      skillIds = (o.required_skills ?? [])
        .filter((r) => {
          const lvl = us.find((u) => u.skill_id === r.skill_id)?.level ?? null;
          return lvl === null || lvl < r.level;
        })
        .map((r) => r.skill_id);
    }

    if (skillIds.length === 0) {
      return NextResponse.json(
        { error: "لا توجد مهارات ناقصة — ملفك متوافق بالفعل 🎉" },
        { status: 400 }
      );
    }

    const { data: skills, error: skillsError } = await supabase
      .from("skills")
      .select("*")
      .in("id", skillIds);
    if (skillsError) throw skillsError;

    // تجنب التكرار: احذف العناصر غير المكتملة القديمة لنفس الفرصة/المهارات
    let query = supabase
      .from("learning_path_items")
      .delete()
      .eq("user_id", userId)
      .eq("is_completed", false);
    query = opportunityId
      ? query.eq("opportunity_id", opportunityId)
      : query.is("opportunity_id", null);
    const { error: delError } = await query;
    if (delError) throw delError;

    const rows = (skills ?? []).flatMap((s: { id: string; name_ar: string; name_en: string }) =>
      getResourcesForSkill(s.name_en)
        .slice(0, 2)
        .map((r) => ({
          user_id: userId,
          skill_id: s.id,
          opportunity_id: opportunityId,
          title: `${s.name_ar}: ${r.title}`,
          resource_url: r.url,
          resource_type: r.type,
          is_completed: false,
        }))
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "لا توجد مصادر تعلم لهذه المهارات" },
        { status: 400 }
      );
    }

    const { data: items, error: insertError } = await supabase
      .from("learning_path_items")
      .insert(rows)
      .select();
    if (insertError) throw insertError;

    return NextResponse.json({ ok: true, items }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
