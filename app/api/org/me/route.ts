import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabaseServer";
import { handleApiError } from "@/lib/apiHelpers";
import { requireOrgContext } from "@/lib/orgApi";

export const dynamic = "force-dynamic";

/**
 * GET /api/org/me — بروفايل المنظمة للحساب الحالي.
 * يُنشئ الصف تلقائياً لجهة العمل المسجلة إن لم يكن موجوداً.
 */
export async function GET() {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, user } = auth;

    const org = await requireOrgContext(supabase, user);
    if (!org.ok) return org.response;

    return NextResponse.json({ organization: org.organization });
  } catch (err) {
    return handleApiError(err);
  }
}
