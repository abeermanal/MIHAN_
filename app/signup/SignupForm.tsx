"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { ensureOwnOrganization } from "@/lib/organizations";

type AccountType = "seeker" | "organization";

const accountTypeOptions: { value: AccountType; label: string; hint: string; icon: string }[] = [
  { value: "seeker", label: "باحثة عن عمل", hint: "أكتشف مهاراتي وأجد فرصاً تناسبني", icon: "🌸" },
  { value: "organization", label: "جهة عمل / منظمة", hint: "أنشر الفرص الوظيفية والتدريبية", icon: "🏢" },
];

export default function SignupForm() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("seeker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // بيانات المنظمة
  const [orgName, setOrgName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");
  const [orgContactEmail, setOrgContactEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [signedUpType, setSignedUpType] = useState<AccountType>("seeker");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }
    if (accountType === "organization" && !orgName.trim()) {
      setError("يرجى إدخال اسم المنظمة.");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) throw new Error("Supabase غير مُعد. راجعي متغيرات البيئة.");

      const orgProfile =
        accountType === "organization"
          ? {
              name: orgName.trim(),
              description: orgDescription.trim() || undefined,
              website: orgWebsite.trim() || undefined,
              contact_email:
                orgContactEmail.trim() || email.trim() || undefined,
            }
          : undefined;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...(name.trim() ? { full_name: name.trim() } : {}),
            user_type: accountType,
            ...(orgProfile ? { org_profile: orgProfile } : {}),
          },
        },
      });
      if (signUpError) throw signUpError;
      setSignedUpType(accountType);

      if (!data.session || !data.user) {
        // تفعيل تأكيد البريد مفعّل في Supabase —
        // سيُنشأ صف المنظمة تلقائياً عند أول دخول عبر /api/org/*
        setNeedsConfirmation(true);
        return;
      }

      // إنشاء صف المنظمة فوراً بعد التسجيل الناجح
      if (accountType === "organization") {
        await ensureOwnOrganization(supabase, data.user);
        router.push("/org/dashboard");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err) {
      let message =
        err instanceof Error ? err.message : "تعذر إنشاء الحساب، حاولي مجدداً.";
      if (message.includes("already registered")) {
        message = "هذا البريد مسجل مسبقاً — جرّبي تسجيل الدخول.";
      } else if (message.includes("valid email")) {
        message = "صيغة البريد الإلكتروني غير صحيحة.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (needsConfirmation) {
    return (
      <div className="card mx-auto max-w-md text-center">
        <span className="text-4xl">📬</span>
        <h1 className="mt-3 text-2xl font-extrabold text-plum-800">
          تحققي من بريدك الإلكتروني
        </h1>
        <p className="mt-2 leading-relaxed text-plum-600">
          أرسلنا رابط تأكيد إلى{" "}
          <span dir="ltr" className="font-bold text-plum-700">
            {email}
          </span>
          . افتحي الرابط ثم سجلي الدخول.
        </p>
        {signedUpType === "organization" && (
          <p className="mt-3 rounded-xl bg-gold-50 p-3 text-sm font-bold text-gold-800">
            سيتم تجهيز لوحة منظمتك تلقائياً بعد أول تسجيل دخول 🏢
          </p>
        )}
        <Link href="/login" className="btn-primary mt-5 inline-flex">
          الانتقال لتسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-2xl font-extrabold text-plum-800">حساب جديد</h1>
        <p className="mt-2 text-plum-600">دقيقة واحدة وتكونين جاهزة للبدء ✨</p>

        {/* نوع الحساب */}
        <fieldset className="mt-5">
          <legend className="mb-2 block font-bold text-plum-700">نوع الحساب</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {accountTypeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAccountType(opt.value)}
                aria-pressed={accountType === opt.value}
                className={`rounded-xl border-2 p-3 text-right transition ${
                  accountType === opt.value
                    ? "border-plum-500 bg-plum-50 shadow-card"
                    : "border-plum-100 bg-white hover:border-plum-200"
                }`}
              >
                <span className="block font-extrabold text-plum-800">
                  <span className="me-1">{opt.icon}</span>
                  {opt.label}
                </span>
                <span className="mt-0.5 block text-xs text-plum-500">{opt.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block font-bold text-plum-700">
              {accountType === "organization"
                ? "اسم المسؤولة عن الحساب (اختياري)"
                : "الاسم (اختياري)"}
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              className="input"
              placeholder={accountType === "organization" ? "مثال: نورة المديرة" : "مثال: سارة"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          {/* حقول المنظمة */}
          {accountType === "organization" && (
            <>
              <div>
                <label htmlFor="orgName" className="mb-1 block font-bold text-plum-700">
                  اسم المنظمة <span className="text-rose-500">*</span>
                </label>
                <input
                  id="orgName"
                  type="text"
                  required
                  className="input"
                  placeholder="مثال: جمعية نماء للتدريب"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="orgDescription" className="mb-1 block font-bold text-plum-700">
                  نبذة عن المنظمة (اختياري)
                </label>
                <textarea
                  id="orgDescription"
                  rows={3}
                  className="input resize-y"
                  placeholder="مجال عملكم، الرسالة، القطاع…"
                  value={orgDescription}
                  onChange={(e) => setOrgDescription(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="orgWebsite" className="mb-1 block font-bold text-plum-700">
                  الموقع الإلكتروني (اختياري)
                </label>
                <input
                  id="orgWebsite"
                  type="url"
                  dir="ltr"
                  className="input"
                  placeholder="https://example.com"
                  value={orgWebsite}
                  onChange={(e) => setOrgWebsite(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="orgContactEmail" className="mb-1 block font-bold text-plum-700">
                  بريد التواصل العام (اختياري)
                </label>
                <input
                  id="orgContactEmail"
                  type="email"
                  dir="ltr"
                  className="input"
                  placeholder="jobs@example.com"
                  value={orgContactEmail}
                  onChange={(e) => setOrgContactEmail(e.target.value)}
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="password" className="mb-1 block font-bold text-plum-700">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="input"
              placeholder="6 أحرف على الأقل"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="confirm" className="mb-1 block font-bold text-plum-700">
              تأكيد كلمة المرور
            </label>
            <input
              id="confirm"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "جارٍ الإنشاء…" : "إنشاء الحساب"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-plum-600">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="font-bold text-plum-700 underline underline-offset-4">
            سجلي الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
