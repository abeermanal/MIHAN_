import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/supabaseServer";
import { handleApiError } from "@/lib/apiHelpers";

export const dynamic = "force-dynamic";

/**
 * POST /api/assessment — حفظ نتائج التقييم وتحديث user_skills للمستخدم الحالي.
 * الجسم: { answers: [{ skill_id, level }] }
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId } = auth;

    const body = await req.json();
    const answers = Array.isArray(body.answers) ? body.answers : [];
    if (answers.length === 0) {
      return NextResponse.json({ error: "لا توجد إجابات للحفظ" }, { status: 400 });
    }

    const rows = answers
      .filter((a: { skill_id?: string }) => Boolean(a.skill_id))
      .map((a: { skill_id: string; level: number }) => ({
        user_id: userId,
        skill_id: String(a.skill_id),
        level: Math.max(0, Math.min(5, Number(a.level ?? 0))),
      }));

    if (rows.length === 0) {
      return NextResponse.json({ error: "إجابات غير صالحة" }, { status: 400 });
    }

    const { error: upsertError } = await supabase
      .from("user_skills")
      .upsert(rows, { onConflict: "user_id,skill_id" });
    if (upsertError) throw upsertError;

    const { data: assessment, error: insertError } = await supabase
      .from("assessments")
      .insert({ user_id: userId, results: { answers: rows } })
      .select()
      .single();
    if (insertError) throw insertError;

    return NextResponse.json({ ok: true, assessment }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
