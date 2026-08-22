import type {
  MatchResult,
  Opportunity,
  SkillGapItem,
  UserSkill,
} from "./types";

export const MISSING_REQUIRED_PENALTY = 20;

/**
 * حساب نسبة التوافق بين مهارات المستخدم ومتطلبات الفرصة.
 * - كل متطلب مطلوب (is_required) غير موجود لدى المستخدم يُخصم 20 نقطة.
 * - المتطلبات الإلزامية وزنها ضعف الاختيارية في المتوسط.
 */
export function calculateMatch(
  userSkills: UserSkill[],
  opportunity: Opportunity
): MatchResult {
  const gaps: SkillGapItem[] = [];
  const strengths: SkillGapItem[] = [];
  let weightedSum = 0;
  let maxWeighted = 0;
  let penalty = 0;

  for (const req of opportunity.required_skills) {
    const userSkill = userSkills.find((s) => s.skill_id === req.skill_id);
    const userLevel = userSkill ? userSkill.level : null;
    const met = userLevel !== null && userLevel >= req.level;

    const item: SkillGapItem = {
      skillId: req.skill_id,
      skillNameAr: "",
      skillNameEn: "",
      requiredLevel: req.level,
      userLevel,
      isRequired: req.is_required,
      met,
    };
    if (met) strengths.push(item);
    else gaps.push(item);

    const weight = req.is_required ? 2 : 1;
    maxWeighted += weight;
    if (userLevel !== null && req.level > 0) {
      weightedSum += weight * Math.min(userLevel / req.level, 1);
    }
    if (req.is_required && userLevel === null) {
      penalty += MISSING_REQUIRED_PENALTY;
    }
  }

  if (maxWeighted === 0) {
    return { score: 100, gaps, strengths };
  }

  const raw = (weightedSum / maxWeighted) * 100 - penalty;
  const score = Math.max(0, Math.min(100, Math.round(raw)));
  return { score, gaps, strengths };
}

/** تعبئة أسماء المهارات داخل نتائج الفجوات */
export function withSkillNames(
  match: MatchResult,
  skillsById: Map<string, { name_ar: string; name_en: string }>
): MatchResult {
  const fill = (item: SkillGapItem): SkillGapItem => {
    const s = skillsById.get(item.skillId);
    return {
      ...item,
      skillNameAr: s?.name_ar ?? "مهارة",
      skillNameEn: s?.name_en ?? "",
    };
  };
  return {
    score: match.score,
    strengths: match.strengths.map(fill),
    gaps: match.gaps.map(fill),
  };
}
