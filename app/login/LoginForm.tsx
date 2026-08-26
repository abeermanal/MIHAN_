"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { ensureOwnOrganization, isOrganizationUser } from "@/lib/organizations";

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
    <div className="flex min-h-screen">
      {/* Decorative left panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-navy-800 lg:flex lg:items-center lg:justify-center">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-royal-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-coral-400/25 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-1/3 h-[250px] w-[250px] rounded-full bg-lavender-400/20 blur-3xl" />
        <div className="relative z-10 px-12 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-royal-500 to-coral-400 shadow-glow">
            <span className="text-5xl font-black text-white">م</span>
          </div>
          <h2 className="text-4xl font-black text-white">مِهَن</h2>
          <p className="mt-3 text-lg font-medium text-lavender-200">
            منصة التوجيه المهني للنساء
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="card p-8">
            {/* Mobile logo */}
            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-royal-500 to-coral-400 shadow-glow">
                <span className="text-3xl font-black text-white">م</span>
              </div>
              <span className="text-xl font-black text-navy-800">مِهَن / MIHAN</span>
            </div>

            {/* Greeting */}
            <h1 className="text-2xl font-extrabold text-navy-800">تسجيل الدخول</h1>
            <p className="mt-2 text-royal-600">
              أهلاً بعودتك 💜 سجلي الدخول لمتابعة مهاراتك ومسارك.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1 block font-bold text-royal-700">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-navy-400">
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

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1 block font-bold text-royal-700">
                  كلمة المرور
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-navy-400">
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

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 rounded-xl bg-coral-50 p-3 text-sm font-bold text-coral-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 shrink-0 text-coral-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? "جارٍ الدخول…" : "دخول"}
              </button>
            </form>

            {/* Signup link */}
            <div className="mt-5 text-center">
              <Link href="/signup" className="btn-outline w-full">
                ليس لديك حساب؟ أنشئي حساباً جديداً
              </Link>
            </div>
          </div>

          {/* Bottom decorative text */}
          <p className="mt-6 text-center text-xs text-navy-400">
            مِهَن — منصة التوجيه المهني للنساء
          </p>
        </div>
      </div>
    </div>
  );
}
