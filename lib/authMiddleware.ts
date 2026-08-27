import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * يجدد كوكيز جلسة Supabase في كل طلب ويعيد المستخدم الحالي.
 * يجب استدعاؤها من Middleware فقط.
 */
export async function updateSession(
  request: NextRequest
): Promise<{ user: User | null; supabaseResponse: NextResponse }> {
  let supabaseResponse = NextResponse.next({ request });

  // إذا لم تُضبط المفاتيح نمرر الطلب دون مصادقة (سيتولى مسارات API إرجاع 503).
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { user: null, supabaseResponse };
  }

  const supabase: SupabaseClient = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // مهم: لا تضيفي كوداً بين createServerClient وgetUser —
  // الاستدعاء هنا يكفي لتجديد الجلسة المنتهية.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, supabaseResponse };
}
