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

  // رسائل خطأ قادمة من /auth/callback عبر ?error=...
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
        // تجهيز صف المنظمة إن لم يُنشأ بعد (مثلاً بسبب تأخير تأكيد البريد)
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
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-2xl font-extrabold text-plum-800">تسجيل الدخول</h1>
        <p className="mt-2 text-plum-600">
          أهلاً بعودتك 💜 سجلي الدخول لمتابعة مهاراتك ومسارك.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block font-bold text-plum-700">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              dir="ltr"
              required
              autoComplete="email"
              className="input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block font-bold text-plum-700">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              minLength={6}
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "جارٍ الدخول…" : "دخول"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-plum-600">
          ليس لديك حساب؟{" "}
          <Link href="/signup" className="font-bold text-plum-700 underline underline-offset-4">
            أنشئي حساباً جديداً
          </Link>
        </p>
      </div>
    </div>
  );
}
