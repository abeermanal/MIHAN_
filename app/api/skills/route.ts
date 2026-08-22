import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin, requireUser } from "@/lib/supabaseServer";
import { handleApiError } from "@/lib/apiHelpers";

export const dynamic = "force-dynamic";

/** GET /api/skills — كل المهارات + مستوى المستخدم الحالي لكل مهارة */
export async function GET() {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId } = auth;

    const [{ data: skills, error: e1 }, { data: userSkills, error: e2 }] =
      await Promise.all([
        supabase.from("skills").select("*").order("name_en"),
        supabase.from("user_skills").select("*").eq("user_id", userId),
      ]);
    if (e1) throw e1;
    if (e2) throw e2;

    const levelBySkill = new Map(
      (userSkills ?? []).map((us: { skill_id: string; level: number }) => [
        us.skill_id,
        us.level,
      ])
    );

    return NextResponse.json({
      skills: (skills ?? []).map((s) => ({ ...s, level: levelBySkill.get(s.id) ?? null })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST /api/skills — إضافة/تحديث مهارات المستخدم الحالي.
 * الجسم: { items: [{ skill_id?, name_ar?, name_en?, level }] }
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId } = auth;

    const body = await req.json();
    const items = Array.isArray(body.items) ? body.items : [body];
    if (items.length === 0) {
      return NextResponse.json({ error: "لا توجد مهارات للإضافة" }, { status: 400 });
    }

    // إنشاء مهارة جديدة في الكتالوج المشترك يتجاوز RLS عبر مفتاح الخدمة —
    // مسار موثوق على الخادم فقط، أما user_skills فتُكتب بجلسة المستخدم.
    const admin = getSupabaseAdmin();
    const rows: { user_id: string; skill_id: string; level: number }[] = [];

    for (const item of items) {
      let skillId: string | null =
        typeof item.skill_id === "string" && item.skill_id ? item.skill_id : null;
      const level = Math.max(0, Math.min(5, Number(item.level ?? 3)));

      if (!skillId && (item.name_en || item.name_ar)) {
        // إنشاء المهارة إن لم تكن موجودة
        const nameEn = String(item.name_en ?? item.name_ar);
        const nameAr = String(item.name_ar ?? item.name_en);
        const { data: existing } = await admin
          .from("skills")
          .select("id")
          .eq("name_en", nameEn)
          .maybeSingle();
        if (existing) {
          skillId = existing.id;
        } else {
          const { data: created, error } = await admin
            .from("skills")
            .insert({ name_ar: nameAr, name_en: nameEn, category: item.category ?? "general" })
            .select("id")
            .single();
          if (error) throw error;
          skillId = created.id;
        }
      }

      if (!skillId) continue;
      rows.push({ user_id: userId, skill_id: skillId, level });
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: "لم يتم التعرف على أي مهارة" }, { status: 400 });
    }

    const { error } = await supabase
      .from("user_skills")
      .upsert(rows, { onConflict: "user_id,skill_id" });
    if (error) throw error;

    return NextResponse.json({ ok: true, added: rows.length }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
