import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isOrgAccount } from "@/lib/orgGuard";

/**
 * نقطة ارتداد OAuth (Google/GitHub):
 * يستقبل رمز PKCE من مزوّد المصادقة، يستبدله بجلسة، يكتب كوكيز الجلسة على
 * ردّ التوجيه نفسه، ثم يوجّه حسب نوع الحساب.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  // نُكرم "next" فقط إذا كان مساراً داخلياً يبدأ بـ "/" (منع الارتطام المفتوح).
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//") ? next : null;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  // يُنشأ الردّ مسبقاً بحيث تُكتب عليه كوكيز الجلسة عبر setAll أثناء
  // تبادل الرمز، ثم نعدّل location لاحقاً حسب نوع الحساب.
  const response = NextResponse.redirect(`${origin}/`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("OAuth exchange error:", error.message);
      return NextResponse.redirect(`${origin}/login?error=auth_code`);
    }

    if (!data?.user) {
      return NextResponse.redirect(`${origin}/login?error=callback`);
    }

    // توجيه حسب نوع الحساب عند غياب "next" صراحةً.
    const isOrg = await isOrgAccount(supabase, data.user);
    const target = safeNext ?? (isOrg ? "/org/dashboard" : "/");
    response.headers.set("location", `${origin}${target}`);
    return response;
  } catch (err) {
    console.error("OAuth callback exception:", err);
    return NextResponse.redirect(`${origin}/login?error=callback`);
  }
}
