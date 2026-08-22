import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Organization } from "./types";

export type EnsureOrgResult =
  | { ok: true; organization: Organization; created: boolean }
  | { ok: false; reason: "not_organization" | "db_error"; error?: string };

interface OrgMetadataProfile {
  name?: string;
  description?: string | null;
  website?: string | null;
  contact_email?: string | null;
}

function readUserType(user: User): "seeker" | "organization" {
  const t = user.user_metadata?.user_type;
  return t === "organization" ? "organization" : "seeker";
}

function profileFromMetadata(user: User, email: string | null): OrgMetadataProfile {
  const raw = (user.user_metadata?.org_profile ?? {}) as OrgMetadataProfile;
  const fallbackName =
    raw.name?.trim() ||
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "") ||
    user.email?.split("@")[0] ||
    "جهة عمل";
  return {
    name: fallbackName,
    description: raw.description || null,
    website: raw.website || null,
    contact_email: raw.contact_email || email,
  };
}

/**
 * تضمن وجود صف المنظمة للمستخدم الحالي إذا كان نوع حسابه "organization".
 * - الجهة المسجلة: يُعاد صفها مباشرة.
 * - جهة بلا صف بعد (مثلاً بسبب تأكيد البريد قبل إنشاء الصف):
 *   يُنشأ الصف من البيانات المحفوظة في user_metadata.
 * - الباحثة عن عمل: لا يُنشأ أي صف ويعاد not_organization.
 */
export async function ensureOwnOrganization(
  supabase: SupabaseClient,
  user: User
): Promise<EnsureOrgResult> {
  const userType = readUserType(user);
  if (userType !== "organization") {
    return { ok: false, reason: "not_organization" };
  }

  const { data: existing, error: selectError } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) {
    return { ok: false, reason: "db_error", error: selectError.message };
  }
  if (existing) {
    return { ok: true, organization: existing as Organization, created: false };
  }

  const profile = profileFromMetadata(user, user.email ?? null);
  const { data: inserted, error: insertError } = await supabase
    .from("organizations")
    .insert({ id: user.id, ...profile })
    .select("*")
    .single();

  // سباق محتمل مع طلب آخر أنشأ الصف — نقرأه من جديد
  if (insertError) {
    const { data: reread } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    if (reread) {
      return { ok: true, organization: reread as Organization, created: false };
    }
    return { ok: false, reason: "db_error", error: insertError.message };
  }

  return { ok: true, organization: inserted as Organization, created: true };
}

export function isOrganizationUser(user: User | null): boolean {
  return user?.user_metadata?.user_type === "organization";
}
