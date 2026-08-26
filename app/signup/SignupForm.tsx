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
        setNeedsConfirmation(true);
        return;
      }

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

        {/* Confirmation panel */}
        <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
          <div className="w-full max-w-md">
            <div className="card p-8 text-center">
              {/* Mobile logo */}
              <div className="mb-6 lg:hidden">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-royal-500 to-coral-400 shadow-glow">
                  <span className="text-3xl font-black text-white">م</span>
                </div>
              </div>

              {/* Mail icon */}
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-royal-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-royal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>

              <h1 className="text-2xl font-extrabold text-navy-800">
                تحققي من بريدك الإلكتروني
              </h1>
              <p className="mt-3 leading-relaxed text-royal-600">
                أرسلنا رابط تأكيد إلى{" "}
                <span dir="ltr" className="font-bold text-royal-700">
                  {email}
                </span>
                . افتحي الرابط ثم سجلي الدخول.
              </p>

              {signedUpType === "organization" && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-coral-50 p-3 text-sm font-bold text-coral-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 shrink-0 text-coral-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>سيتم تجهيز لوحة منظمتك تلقائياً بعد أول تسجيل دخول 🏢</span>
                </div>
              )}

              <Link href="/login" className="btn-primary mt-6 w-full">
                الانتقال لتسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
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

            <h1 className="text-2xl font-extrabold text-navy-800">حساب جديد</h1>
            <p className="mt-2 text-royal-600">دقيقة واحدة وتكونين جاهزة للبدء ✨</p>

            {/* Account type toggle */}
            <fieldset className="mt-6">
              <legend className="mb-2 block font-bold text-royal-700">نوع الحساب</legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {accountTypeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAccountType(opt.value)}
                    aria-pressed={accountType === opt.value}
                    className={`rounded-xl border-2 p-4 text-right transition-all duration-200 ${
                      accountType === opt.value
                        ? "border-royal-500 bg-royal-50 shadow-card"
                        : "border-cream-200 bg-white hover:border-royal-200 hover:shadow-sm"
                    }`}
                  >
                    <span className="block text-3xl">{opt.icon}</span>
                    <span className="mt-2 block font-extrabold text-navy-800">
                      {opt.label}
                    </span>
                    <span className="mt-1 block text-xs text-royal-500">{opt.hint}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="mb-1 block font-bold text-royal-700">
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

              {/* Org fields */}
              {accountType === "organization" && (
                <>
                  <div>
                    <label htmlFor="orgName" className="mb-1 block font-bold text-royal-700">
                      اسم المنظمة <span className="text-coral-500">*</span>
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
                    <label htmlFor="orgDescription" className="mb-1 block font-bold text-royal-700">
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
                    <label htmlFor="orgWebsite" className="mb-1 block font-bold text-royal-700">
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
                    <label htmlFor="orgContactEmail" className="mb-1 block font-bold text-royal-700">
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
                    minLength={6}
                    autoComplete="new-password"
                    className="input ps-10"
                    placeholder="6 أحرف على الأقل"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="confirm" className="mb-1 block font-bold text-royal-700">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-navy-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <input
                    id="confirm"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="input ps-10"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "جارٍ الإنشاء…" : "إنشاء الحساب"}
              </button>
            </form>

            {/* Login link */}
            <div className="mt-5 text-center">
              <Link href="/login" className="btn-outline w-full">
                لديك حساب بالفعل؟ سجلي الدخول
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
