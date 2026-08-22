import type { OpportunityWithMatch } from "./types";

export interface CoachProfile {
  skills: { name_ar: string; name_en: string; level: number; category: string }[];
  topOpportunities: OpportunityWithMatch[];
}

const CATEGORY_ROLES: Record<string, string> = {
  technical: "الأدوار التقنية مثل تحليل البيانات والتطوير",
  design: "أدوار التصميم وتجربة المستخدم",
  marketing: "أدوار التسويق الرقمي وصناعة المحتوى",
  soft: "العمل الجماعي وإدارة المشاريع",
};

function strengthsText(profile: CoachProfile): string {
  const strong = profile.skills.filter((s) => s.level >= 4);
  if (strong.length === 0) {
    const mid = profile.skills.filter((s) => s.level >= 2);
    if (mid.length === 0) return "لم أجد مهارات مسجلة بعد — أنصحك ببدء تقييم المهارات.";
    return `تمتلكين مستوى جيد في: ${mid.map((s) => s.name_ar).join("، ")}.`;
  }
  return `نقاط قوتك الأساسية هي: ${strong.map((s) => `${s.name_ar} (مستوى ${s.level})`).join("، ")}.`;
}

function topMatchesText(profile: CoachProfile): string {
  const top = profile.topOpportunities.slice(0, 3);
  if (top.length === 0) return "";
  return `\n\nأقرب الفرص لك حالياً:\n${top
    .map((o) => `• ${o.title_ar} — نسبة توافق ${o.match.score}%`)
    .join("\n")}`;
}

/**
 * المدرب الذكي (نسخة القواعد الجاهزة) — يحلل ملف المستخدم ويجيب حسب الكلمات المفتاحية.
 */
export function ruleBasedReply(message: string, profile: CoachProfile): string {
  const text = message.toLowerCase();
  const has = (...words: string[]) => words.some((w) => text.includes(w));

  const strengths = strengthsText(profile);

  if (has("تحليل", "بيانات", "data", "sql", "python")) {
    const sql = profile.skills.find((s) => s.name_en === "SQL")?.level ?? 0;
    const da = profile.skills.find((s) => s.name_en === "Data Analysis")?.level ?? 0;
    let advice = `بناءً على ملفك: ${strengths}`;
    advice += `\n\nمهاراتك في SQL بمستوى ${sql} وتحليل البيانات بمستوى ${da}.`;
    if (sql >= 3 && da >= 3) {
      advice += "\nمستواك مناسب للتقدم لدور «محللة بيانات مبتدئة» — ابدئي بإعداد مشروع تحليل بيانات صغير لعرضه في سيرتك.";
    } else {
      advice += "\nأنصحك بتقوية SQL وتحليل البيانات عبر مسار التعلم، فهما أساس معظم أدوار البيانات.";
    }
    return advice + topMatchesText(profile);
  }

  if (has("تصميم", "واجهات", "ui", "ux", "design")) {
    const uiux = profile.skills.find((s) => s.name_en === "UI/UX Design")?.level ?? 0;
    let advice = `${strengths}\n\nمستواك في تصميم UI/UX هو ${uiux}.`;
    if (uiux >= 3) {
      advice += "\nلديك أساس ممتاز! جهزي ملف أعمال (Portfolio) فيه 2-3 تصاميم على Figma وتقدمي لأدوار متدربة تصميم.";
    } else {
      advice += "\nابدئي بتعلم أساسيات Figma ومبادئ تجربة المستخدم من مسار التعلم، ثم طبقي على تصميم تطبيق بسيط.";
    }
    return advice + topMatchesText(profile);
  }

  if (has("تسويق", "marketing", "محتوى")) {
    const dm = profile.skills.find((s) => s.name_en === "Digital Marketing")?.level ?? 0;
    let advice = `${strengths}\n\nمستواك في التسويق الرقمي ${dm}.`;
    advice +=
      dm >= 2
        ? "\nجيد! احصلي على شهادة Google الرقمية المجانية لتعزيز سيرتك ثم تقدمي لأدوار مساعدة تسويق."
        : "\nأنصحك بالبدء بشهادة «أساسيات التسويق الرقمي» المجانية من Google Digital Garage — تستغرق أقل من أسبوعين.";
    return advice + topMatchesText(profile);
  }

  if (has("أمن", "سيبران", "security", "cyber")) {
    const cyber = profile.skills.find((s) => s.name_en === "Cybersecurity Basics")?.level ?? 0;
    let advice = `${strengths}\n\nمستواك في الأمن السيبراني ${cyber}.`;
    advice +=
      cyber >= 3
        ? "\nممتاز! جرّبي التحديات العملية على TryHackMe وقدمي لمواقع التدريب السيبراني."
        : "\nابدئي بمسار Pre Security المجاني على TryHackMe ثم دورة Cisco المجانية لبناء الأساس.";
    return advice + topMatchesText(profile);
  }

  if (has("تعلم", "أتعلم", "أبدأ", "بداية", "learn", "start")) {
    const biggestGap = profile.topOpportunities[0]?.match.gaps.filter((g) => g.isRequired)[0];
    let advice = `${strengths}`;
    if (biggestGap) {
      advice += `\n\nأهم فجوة لديك الآن: «${biggestGap.skillNameAr}» مطلوبة بمستوى ${biggestGap.requiredLevel}. افتحي صفحة «مسار التعلم» وسنضع لك خطة مجانية خطوة بخطوة.`;
    } else {
      advice += "\n\nملفك متوافق مع فرصك الحالية! اخترينا لك أفضل الفرص في صفحة «الفرص» — ابدئي بالتقديم عليها.";
    }
    return advice + topMatchesText(profile);
  }

  if (has("سيرة", "cv", "resume")) {
    return `نصائح سيرتك الذاتية:\n1. ابدئي بملخص قصير يبرز: ${strengths.replace("نقاط قوتك الأساسية هي: ", "")}\n2. اربطي كل خبرة بالمهارة التي اكتسبتها.\n3. أضيفي مشاريعك من صفحة «مشاريعي» كأدلة عملية.\n4. استخدمي أفعال قوية: «طورت»، «حللت»، «نظمت».${topMatchesText(profile)}`;
  }

  if (has("مقابلة", "interview")) {
    return `للاستعداد للمقابلات:\n1. راجعي وصف الوظيفة وحضري مثالاً لكل مهارة مطلوبة.\n2. استخدمي طريقة STAR: الموقف، المهمة، الإجراء، النتيجة.\n3. ${strengths}\n4. اذكري بحماس ما تعلمته خلال فترة الانقطاع إن وجدت — إنها مهارة إدارة وقت حقيقية.${topMatchesText(profile)}`;
  }

  if (has("مرحبا", "السلام", "اهلا", "أهلا", "hello", "hi")) {
    return `أهلاً بك! أنا مدربتك الذكية في MIHAN 💜\n${strengths}${topMatchesText(profile)}\n\nاسأليني عن: تحليل البيانات، التصميم، التسويق، الأمن السيبراني، أو كيفية بناء سيرتك الذاتية.`;
  }

  // رد افتراضي
  const categories = Array.from(
    new Set(profile.skills.filter((s) => s.level >= 3).map((s) => s.category))
  );
  const rolesHint = categories.map((c) => CATEGORY_ROLES[c] ?? c).join("، ");
  return `${strengths}\n\nبناءً على ذلك، تناسبك ${rolesHint || "عدة أدوار متنوعة"}.${topMatchesText(profile)}\n\nيمكنك سؤالي عن: مجال معين (بيانات/تصميم/تسويق/أمن سيبراني)، كيف تبدأ التعلم، أو نصائح السيرة الذاتية والمقابلات.`;
}
