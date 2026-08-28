"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { ensureOwnOrganization, isOrganizationUser } from "@/lib/organizations";
import Logo from "@/components/Logo";
import SocialLogin from "@/components/SocialLogin";

const errorMessages: Record<string, string> = {
  auth_code: "رابط التحقق غير صالح أو منتهي الصلاحية — حاولي تسجيل الدخول من جديد.",
  config: "المصادقة غير مُعدة على الخادم حالياً.",
};

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err && errorMessages[err]) setError(errorMessages[err]);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) throw new Error("Supabase غير مُعد. راجعي متغيرات البيئة.");

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;

      if (data.user && isOrganizationUser(data.user)) {
        await ensureOwnOrganization(supabase, data.user);
        router.push("/org/dashboard");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message === "Invalid login credentials"
            ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
            : err.message
          : "تعذر تسجيل الدخول"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh]">
      <div
        className="relative hidden w-1/2 overflow-hidden lg:flex lg:items-center lg:justify-center"
        style={{
          background: "linear-gradient(135deg, #0d3b35 0%, #115e54 40%, #0f4a41 70%, #0a2f2a 100%)",
        }}
      >
        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(212,175,55,0.08)" }} />
        <div className="pointer-events-none absolute -bottom-40 -right-20 h-[400px] w-[400px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(212,175,55,0.06)" }} />
        <div className="pointer-events-none absolute left-1/3 top-1/3 h-[250px] w-[250px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(255,255,255,0.04)" }} />
        <div className="relative z-10 px-12 text-center">
          <div className="mb-6 flex justify-center">
            <Logo size={56} variant="inverse" />
          </div>
          <p className="mt-3 text-lg font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
            منصة التوجيه المهني للنساء
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div
            className="rounded-3xl p-8 shadow-card"
            style={{
              backgroundColor: "var(--surface-raised)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="mb-8 text-center lg:hidden">
              <div className="flex justify-center">
                <Logo size={40} />
              </div>
            </div>

            <h1 className="text-2xl font-extrabold" style={{ color: "var(--heading)" }}>تسجيل الدخول</h1>
            <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
              أهلاً بعودتك! سجلي الدخول لمتابعة مهاراتك ومسارك.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="mb-1 block font-bold" style={{ color: "var(--text)" }}>
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    dir="ltr"
                    required
                    autoComplete="email"
                    className="input ps-10"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block font-bold" style={{ color: "var(--text)" }}>
                  كلمة المرور
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    minLength={6}
                    className="input ps-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div
                  className="flex items-start gap-2 rounded-2xl p-3 text-sm font-bold"
                  style={{ backgroundColor: "rgba(212,175,55,0.1)", color: "var(--accent)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" style={{ color: "var(--accent)" }}>
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? "جارٍ الدخول…" : "دخول"}
              </button>
            </form>

            <div className="mt-2">
              <SocialLogin />
            </div>

            <div className="mt-5 text-center">
              <Link href="/signup" className="btn-outline w-full">
                ليس لديك حساب؟ أنشئي حساباً جديداً
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs" style={{ color: "var(--muted)" }}>
            مِهَن — منصة التوجيه المهني للنساء
          </p>
        </div>
      </div>
    </div>
  );
}
