import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/authMiddleware";

/** المسارات المتاحة بدون تسجيل دخول */
const PUBLIC_PATHS = ["/login", "/signup", "/auth"];

export async function middleware(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // لا توجد جلسة + مسار محمي → تحويل إلى /login
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  // جلسة قائمة + زيارة صفحات الدخول → تحويل إلى الرئيسية
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * كل المسارات ما عدا:
     * - _next/static و _next/image (أصول Next.js)
     * - favicon.ico وأصول الصور
     * - ملفات .env / manifest إن وجدت
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest\\.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
