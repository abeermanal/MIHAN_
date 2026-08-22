export interface Skill {
  id: string;
  name_ar: string;
  name_en: string;
  category: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  level: number;
}

export type RequiredSkillJson = {
  skill_id: string;
  level: number;
  is_required: boolean;
};

export type UserType = "seeker" | "organization";

export interface Organization {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  contact_email: string | null;
  created_at?: string;
}

/** معلومات الجهة المضمنة مع الفرصة (نتيجة embed من Supabase) */
export interface OpportunityOrgInfo {
  id: string;
  name: string;
  logo_url: string | null;
}

export type OpportunityStatus = "active" | "closed";

export interface Opportunity {
  id: string;
  title_ar: string;
  company: string | null;
  description: string | null;
  location: string | null;
  employment_type: string | null;
  required_skills: RequiredSkillJson[];
  url?: string | null;
  status?: OpportunityStatus | string | null;
  organization_id?: string | null;
  posted_by?: string | null;
  created_at?: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  skills_used: string[];
  link: string | null;
}

export interface LearningPathItem {
  id: string;
  user_id: string;
  skill_id: string | null;
  opportunity_id: string | null;
  title: string;
  resource_url: string | null;
  resource_type: "article" | "video" | "course" | "practice";
  is_completed: boolean;
}

export interface SkillGapItem {
  skillId: string;
  skillNameAr: string;
  skillNameEn: string;
  requiredLevel: number;
  userLevel: number | null;
  isRequired: boolean;
  met: boolean;
}

export interface MatchResult {
  score: number;
  gaps: SkillGapItem[];
  strengths: SkillGapItem[];
}

export interface OpportunityWithMatch extends Opportunity {
  match: MatchResult;
  organization?: OpportunityOrgInfo | null;
}
