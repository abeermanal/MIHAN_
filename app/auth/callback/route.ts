import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAuthed } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/";
  const next = nextParam.startsWith("/") ? nextParam : "/";

  if (code) {
    try {
      const supabase = getSupabaseAuthed();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
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
