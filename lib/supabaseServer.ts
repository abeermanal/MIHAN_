import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  createClient as createRawClient,
  type SupabaseClient,
  type SupabaseClient as AdminSupabaseClient,
  type User,
} from "@supabase/supabase-js";

let adminCached: AdminSupabaseClient | null = null;

/**
 * عميل Supabase بمفتاح الخدمة (يتجاوز RLS).
 * يُستخدم فقط في مهام صيانة محدودة على الخادم: تهيئة البيانات المرجعية
 * (/api/seed) وإنشاء المهارات المخصصة الجديدة في الكتالوج المشترك.
 */
export function getSupabaseAdmin(): AdminSupabaseClient {
  if (adminCached) return adminCached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }
  adminCached = createRawClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminCached;
}

/**
 * عميل Supabase مرتبط بجلسة المستخدم عبر الكوكيز (@supabase/ssr).
 * يستخدم مفتاح anon لذا تخضع كل الاستعلامات لسياسات RLS (auth.uid()).
 */
export function getSupabaseAuthed(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookies().getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookies().set(name, value, options);
          }
        } catch {
          // يُرمى هذا الخطأ عند الاستدعاء من Server Component — يمكن تجاهله
          // لأن Middleware هو من يجدد الكوكيز فعلياً.
        }
      },
    },
  });
}

export type AuthContext =
  | {
      ok: true;
      supabase: SupabaseClient;
      userId: string;
      email: string | null;
      user: User;
    }
  | { ok: false; response: NextResponse };

/** استخراج المستخدم الحالي من الجلسة، أو رد 401 جاهز إن لم توجد جلسة. */
export async function requireUser(): Promise<AuthContext> {
  let supabase: SupabaseClient;
  try {
    supabase = getSupabaseAuthed();
  } catch (err) {
    return {
      ok: false,
      response: handleConfigError(err),
    };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "يجب تسجيل الدخول للمتابعة" },
        { status: 401 }
      ),
    };
  }

  return { ok: true, supabase, userId: user.id, email: user.email ?? null, user };
}

function handleConfigError(err: unknown): NextResponse {
  if (err instanceof Error && err.message === "SUPABASE_NOT_CONFIGURED") {
    return NextResponse.json(
      {
        error:
          "Supabase غير مُعد. انسخي .env.local.example إلى .env.local واملأي المفاتيح.",
      },
      { status: 503 }
    );
  }
  console.error("[api]", err);
  return NextResponse.json({ error: "حدث خطأ غير متوقع في الخادم" }, { status: 500 });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}
