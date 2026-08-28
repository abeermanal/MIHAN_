"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a11.98 11.98 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.67.41.35.77 1.05.77 2.13 0 1.54-.01 2.77-.01 3.15 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export default function SocialLogin() {
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);

  async function handleOAuth(provider: "google" | "github") {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      alert("المصادقة غير مُعدة. راجعي متغيرات البيئة.");
      return;
    }
    setLoadingProvider(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: provider === "github" ? { prompt: "consent" } : {},
        },
      });
      if (error) throw error;
    } catch (err) {
      setLoadingProvider(null);
      alert(
        err instanceof Error
          ? err.message
          : "تعذر البدء بتسجيل الدخول — حاولي مجدداً."
      );
    }
  }

  const buttonBase =
    "flex w-full items-center justify-center gap-2 rounded-full border-2 px-7 py-3 font-bold transition-all duration-300 hover:-translate-y-[1px] hover:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-3">
      <div className="my-2 flex items-center gap-3">
        <span className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
        <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
          أو سجّلي بواسطة
        </span>
        <span className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
      </div>

      <button
        type="button"
        onClick={() => handleOAuth("google")}
        disabled={!!loadingProvider}
        className={buttonBase}
        style={{
          borderColor: "var(--border-strong)",
          color: "var(--text)",
          backgroundColor: "transparent",
        }}
      >
        <GoogleIcon className="h-5 w-5 shrink-0" />
        {loadingProvider === "google" ? "جارٍ التحويل…" : "متابعة باستخدام Google"}
      </button>

      <button
        type="button"
        onClick={() => handleOAuth("github")}
        disabled={!!loadingProvider}
        className={buttonBase}
        style={{
          borderColor: "var(--border-strong)",
          color: "var(--text)",
          backgroundColor: "transparent",
        }}
      >
        <GitHubIcon className="h-5 w-5 shrink-0" />
        {loadingProvider === "github" ? "جارٍ التحويل…" : "متابعة باستخدام GitHub"}
      </button>
    </div>
  );
}
