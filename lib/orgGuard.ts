import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabaseServer";
import { ensureOwnOrganization, isOrganizationUser } from "@/lib/organizations";
import type { Organization } from "@/lib/types";

export interface OrgPageContext {
  organization: Organization;
  userId: string;
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
 */
export async function requireSeekerForPage(): Promise<void> {
  const auth = await requireUser();
  if (!auth.ok) redirect("/login");
  if (isOrganizationUser(auth.user)) redirect("/org/dashboard");
}