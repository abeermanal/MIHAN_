import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAuthed } from "@/lib/supabaseServer";
import { isOrgAccount } from "@/lib/orgGuard";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");
  // نكرم next صراحةً فقط؛ وإلا نحوّل حسب نوع الحساب.
  const next = nextParam ? (nextParam.startsWith("/") ? nextParam : null) : null;

  if (code) {
    try {
      const supabase = getSupabaseAuthed();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        let target = next;
        if (!target) {
          // نحوّل بعد التسجيل حسب نوع الحساب (يشمل الحسابات القديمة بلا user_type)
          const isOrg =
            data.user && (await isOrgAccount(supabase, data.user));
          target = isOrg ? "/org/dashboard" : "/";
        }
        return NextResponse.redirect(`${origin}${target}`);
      }
    } catch (err) {
      if (err instanceof Error && err.message === "SUPABASE_NOT_CONFIGURED") {
        return NextResponse.redirect(`${origin}/login?error=config`);
      }
      throw err;
    }
  }

  // رمز غير صالح أو منتهي الصلاحية
  return NextResponse.redirect(`${origin}/login?error=auth_code`);
}
