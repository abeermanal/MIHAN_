import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { requireUser } from "@/lib/supabaseServer";
import { ensureOwnOrganization, isOrganizationUser } from "@/lib/organizations";
import type { Organization } from "@/lib/types";

export interface OrgPageContext {
  organization: Organization;
  userId: string;
}

/**
 * هل الحساب حساب جهة عمل؟ يتحقق عبر البيانات الوصفية ثم عبر صف المنظمة
 * (يلتقط الحسابات القديمة بلا user_type).
 */
export async function isOrgAccount(
  supabase: SupabaseClient,
  user: User
): Promise<boolean> {
  if (isOrganizationUser(user)) return true;
  const org = await ensureOwnOrganization(supabase, user);
  return org.ok;
}

/**
 * حارس صفحات الجهات (Server Component):
 * - بلا جلسة → /login
 * - حساب ليس جهة عمل → /
 * - حساب جهة → يعيد بروفايل المنظمة لتستخدمه الصفحة.
 */
export async function requireOrgForPage(): Promise<OrgPageContext> {
  const auth = await requireUser();
  if (!auth.ok) redirect("/login");
  const result = await ensureOwnOrganization(auth.supabase, auth.user);
  if (!result.ok) redirect("/");
  return { organization: result.organization, userId: auth.userId };
}

/**
 * حارس صفحات الباحثات عن عمل (Server Component):
 * يمنع حسابات الجهات من دخول صفحات خاصة بالباحثات ويحوّلها إلى لوحة المنظمة.
 * يتحقق عبر البيانات الوصفية وأيضاً عبر صف المنظمة (لحسابات قديمة بلا user_type).
 */
export async function requireSeekerForPage(): Promise<void> {
  const auth = await requireUser();
  if (!auth.ok) redirect("/login");

  // صنف صريح "organization" أو وجود صف منظمة (حسابات قديمة) → لوحة المنظمة
  if (await isOrgAccount(auth.supabase, auth.user)) redirect("/org/dashboard");
}