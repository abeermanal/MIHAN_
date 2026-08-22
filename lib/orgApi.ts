import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { ensureOwnOrganization } from "./organizations";
import type { Organization } from "./types";

/**
 * سياق الجهة بعد التحقق — يتبع نفس نمط AuthContext في supabaseServer.
 */
export type OrgContext =
  | { ok: true; organization: Organization }
  | { ok: false; response: NextResponse };

/**
 * حارس مسارات الجهات: يتحقق أن الحساب من نوع "organization"
 * ويضمن وجود صف المنظمة (ينشئه إن غاب). عند الفشل يعيد رد HTTP جاهزاً.
 */
export async function requireOrgContext(
  supabase: SupabaseClient,
  user: User
): Promise<OrgContext> {
  const result = await ensureOwnOrganization(supabase, user);
  if (!result.ok) {
    if (result.reason === "not_organization") {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "هذا الحساب ليس حساب جهة عمل", code: "NOT_ORGANIZATION" },
          { status: 403 }
        ),
      };
    }
    return {
      ok: false,
      response: NextResponse.json(
        { error: result.error ?? "تعذر التحقق من المنظمة" },
        { status: 500 }
      ),
    };
  }
  return { ok: true, organization: result.organization };
}
