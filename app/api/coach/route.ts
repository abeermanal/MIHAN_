import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/supabaseServer";
import type { SupabaseClient } from "@supabase/supabase-js";
import { type OpportunityWithMatch } from "@/lib/types";
import { ruleBasedReply, type CoachProfile } from "@/lib/coachRules";
import { handleApiError } from "@/lib/apiHelpers";

export const dynamic = "force-dynamic";

async function buildProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<CoachProfile> {
  const [{ data: skills }, { data: userSkills }, { data: opportunities }] =
    await Promise.all([
      supabase.from("skills").select("*"),
      supabase.from("user_skills").select("*").eq("user_id", userId),
      supabase.from("opportunities").select("*"),
    ]);

  const skillsById = new Map(
    (skills ?? []).map((s: { id: string; name_ar: string; name_en: string; category: string }) => [s.id, s])
  );

  const profileSkills = (userSkills ?? [])
    .map((us: { skill_id: string; level: number }) => {
      const s = skillsById.get(us.skill_id);
      return s
        ? { name_ar: s.name_ar, name_en: s.name_en, level: us.level, category: s.category }
        : null;
    })
    .filter(Boolean) as CoachProfile["skills"];

  // حساب توافق مبسط للفرص
  const topOpportunities: OpportunityWithMatch[] = (opportunities ?? [])
    .map((o) => {
      const reqs = (o.required_skills ?? []) as {
        skill_id: string;
        level: number;
        is_required: boolean;
      }[];
      let weighted = 0;
      let maxW = 0;
      let penalty = 0;
      for (const r of reqs) {
        const us = (userSkills ?? []).find(
          (u: { skill_id: string }) => u.skill_id === r.skill_id
        );
        const lvl = us ? us.level : null;
        const w = r.is_required ? 2 : 1;
        maxW += w;
        if (lvl !== null) weighted += w * Math.min(lvl / r.level, 1);
        if (r.is_required && lvl === null) penalty += 20;
      }
      const score =
        maxW === 0
          ? 100
          : Math.max(0, Math.min(100, Math.round((weighted / maxW) * 100 - penalty)));
      return { ...o, match: { score, gaps: [], strengths: [] } };
    })
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, 3);

  return { skills: profileSkills, topOpportunities };
}

async function openAiReply(message: string, profile: CoachProfile): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const profileSummary = `مهارات المستخدمة: ${
    profile.skills.map((s) => `${s.name_ar} (${s.level}/5)`).join("، ") || "لا توجد مهارات مسجلة"
  }. أفضل الفرص المتوافقة: ${
    profile.topOpportunities.map((o) => `${o.title_ar} (${o.match.score}%)`).join("، ") || "لا توجد"
  }.`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "أنت مدربة مهنية ذكية لمنصة MIHAN التي تدعم النساء في مسارهن المهني. جاوبين بالعربية بأسلوب ودود ومحفز وباختصار. اعتمدي على ملف المستخدمة التالي:\n" +
              profileSummary,
          },
          { role: "user", content: message },
        ],
        max_tokens: 400,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content;
    return typeof reply === "string" ? reply : null;
  } catch {
    return null;
  }
}

/** POST /api/coach — الجسم: { message }. يتطلب جلسة مستخدم صالحة. */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId } = auth;

    const body = await req.json();
    const message = String(body.message ?? "").trim();
    if (!message) {
      return NextResponse.json({ error: "الرسالة مطلوبة" }, { status: 400 });
    }

    const profile = await buildProfile(supabase, userId);
    const aiReply = await openAiReply(message, profile);
    const reply = aiReply ?? ruleBasedReply(message, profile);

    return NextResponse.json({ reply, source: aiReply ? "openai" : "rules" });
  } catch (err) {
    return handleApiError(err);
  }
}
