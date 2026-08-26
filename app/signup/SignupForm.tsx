"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { ensureOwnOrganization } from "@/lib/organizations";

type AccountType = "seeker" | "organization";

const accountTypeOptions: { value: AccountType; label: string; hint: string }[] = [
  { value: "seeker", label: "باحثة عن عمل", hint: "أكتشف مهاراتي وأجد فرصاً تناسبني" },
  { value: "organization", label: "جهة عمل / منظمة", hint: "أنشر الفرص الوظيفية والتدريبية" },
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

  const rightPanel = (
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
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl shadow-glow" style={{ backgroundColor: "rgba(212,175,55,0.15)", backdropFilter: "blur(8px)" }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M24 4L44 24L24 44L4 24L24 4Z" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
            <path d="M24 10L38 24L24 38L10 24L24 10Z" stroke="#D4AF37" strokeWidth="1.5" fill="none" opacity="0.6" />
            <circle cx="24" cy="24" r="4" fill="#D4AF37" />
          </svg>
        </div>
        <h2 className="text-4xl font-black" style={{ color: "#D4AF37" }}>مِهَن</h2>
        <p className="mt-3 text-lg font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
          منصة التوجيه المهني للنساء
        </p>
      </div>
    </div>
  );

  if (needsConfirmation) {
    return (
      <div className="flex min-h-[80vh]">
        {rightPanel}
        <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
          <div className="w-full max-w-md">
            <div
              className="rounded-3xl p-8 shadow-card text-center"
              style={{
                backgroundColor: "var(--surface-raised)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="mb-6 lg:hidden">
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl shadow-soft"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                    <path d="M24 4L44 24L24 44L4 24L24 4Z" stroke="white" strokeWidth="2.5" fill="none" />
                    <path d="M24 10L38 24L24 38L10 24L24 10Z" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6" />
                    <circle cx="24" cy="24" r="4" fill="white" />
                  </svg>
                </div>
              </div>

              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: "rgba(212,175,55,0.1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor" style={{ color: "var(--accent)" }}>
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>

              <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>
                تحققي من بريدك الإلكتروني
              </h1>
              <p className="mt-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                أرسلنا رابط تأكيد إلى{" "}
                <span dir="ltr" className="font-bold" style={{ color: "var(--accent)" }}>
                  {email}
                </span>
                . افتحي الرابط ثم سجلي الدخول.
              </p>

              {signedUpType === "organization" && (
                <div
                  className="mt-4 flex items-start gap-2 rounded-2xl p-3 text-sm font-bold"
                  style={{ backgroundColor: "rgba(212,175,55,0.1)", color: "var(--accent)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" style={{ color: "var(--accent)" }}>
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>سيتم تجهيز لوحة منظمتك تلقائياً بعد أول تسجيل دخول.</span>
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
    <div className="flex min-h-[80vh]">
      {rightPanel}

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
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl shadow-soft"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <path d="M24 4L44 24L24 44L4 24L24 4Z" stroke="white" strokeWidth="2.5" fill="none" />
                  <path d="M24 10L38 24L24 38L10 24L24 10Z" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6" />
                  <circle cx="24" cy="24" r="4" fill="white" />
                </svg>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-black" style={{ color: "var(--text)" }}>مِهَن</span>
              </div>
            </div>

            <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>حساب جديد</h1>
            <p className="mt-2" style={{ color: "var(--text-secondary)" }}>دقيقة واحدة وتكونين جاهزة للبدء.</p>

            <fieldset className="mt-6">
              <legend className="mb-2 block font-bold" style={{ color: "var(--text)" }}>نوع الحساب</legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {accountTypeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAccountType(opt.value)}
                    aria-pressed={accountType === opt.value}
                    className="rounded-2xl border-2 p-4 text-right transition-all duration-200"
                    style={{
                      borderColor: accountType === opt.value ? "var(--accent)" : "var(--border)",
                      backgroundColor: accountType === opt.value ? "rgba(212,175,55,0.06)" : "transparent",
                    }}
                  >
                    {opt.value === "seeker" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="mb-1 h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: accountType === opt.value ? "var(--accent)" : "var(--muted)" }}>
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="mb-1 h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: accountType === opt.value ? "var(--accent)" : "var(--muted)" }}>
                        <path d="M3 21h18" />
                        <path d="M9 8h1" />
                        <path d="M9 12h1" />
                        <path d="M9 16h1" />
                        <path d="M14 8h1" />
                        <path d="M14 12h1" />
                        <path d="M14 16h1" />
                        <path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
                      </svg>
                    )}
                    <span className="mt-1 block font-extrabold" style={{ color: "var(--text)" }}>
                      {opt.label}
                    </span>
                    <span className="mt-1 block text-xs" style={{ color: "var(--text-secondary)" }}>{opt.hint}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block font-bold" style={{ color: "var(--text)" }}>
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

              {accountType === "organization" && (
                <>
                  <div>
                    <label htmlFor="orgName" className="mb-1 block font-bold" style={{ color: "var(--text)" }}>
                      اسم المنظمة <span style={{ color: "var(--accent)" }}>*</span>
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
                    <label htmlFor="orgDescription" className="mb-1 block font-bold" style={{ color: "var(--text)" }}>
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
                    <label htmlFor="orgWebsite" className="mb-1 block font-bold" style={{ color: "var(--text)" }}>
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
                    <label htmlFor="orgContactEmail" className="mb-1 block font-bold" style={{ color: "var(--text)" }}>
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
                    minLength={6}
                    autoComplete="new-password"
                    className="input ps-10"
                    placeholder="6 أحرف على الأقل"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm" className="mb-1 block font-bold" style={{ color: "var(--text)" }}>
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }}>
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
                {loading ? "جارٍ الإنشاء…" : "إنشاء الحساب"}
              </button>
            </form>

            <div className="mt-5 text-center">
              <Link href="/login" className="btn-outline w-full">
                لديك حساب بالفعل؟ سجلي الدخول
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
