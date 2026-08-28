import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAuthed } from "@/lib/supabaseServer";
import { isOrgAccount } from "@/lib/orgGuard";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  try {
    const supabase = getSupabaseAuthed();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("OAuth exchange error:", error.message);
      return NextResponse.redirect(`${origin}/login?error=auth_code`);
    }

    const user = data.user;
    if (!user) {
      return NextResponse.redirect(`${origin}/login?error=no_user`);
    }

    const isOrg = await isOrgAccount(supabase, user);
    const target = next && next.startsWith("/") ? next : isOrg ? "/org/dashboard" : "/";

    return NextResponse.redirect(`${origin}${target}`);
  } catch (err) {
    console.error("OAuth callback exception:", err);
    return NextResponse.redirect(`${origin}/login?error=callback`);
  }
}