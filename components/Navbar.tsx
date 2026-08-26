"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/assessment", label: "اكتشفي مهاراتك" },
  { href: "/opportunities", label: "الفرص" },
  { href: "/skill-passport", label: "جواز المهارات" },
  { href: "/learning-path", label: "خطة التعلم" },
  { href: "/coach", label: "المدربة الذكية" },
  { href: "/return-path", label: "طريق العودة" },
  { href: "/about", label: "عن مِهَن" },
];

const anchorLinks = [
  { href: "/#how-it-works", label: "كيف تعمل المنصة؟" },
  { href: "/#career-paths", label: "المسارات المهنية" },
];

function isActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase?.auth.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    user?.email?.split("@")[0];

  return (
    <header className="sticky top-0 z-40 border-b border-lavender-100/40 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-royal-600 via-royal-400 to-coral-400 text-lg font-extrabold text-white shadow-soft">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-extrabold text-navy-900">مِهَن</span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-royal-400">MIHAN</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-0.5 overflow-x-auto lg:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(pathname, l.href) ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold transition-all duration-200 ${
                  isActive(pathname, l.href)
                    ? "bg-royal-50 text-royal-600"
                    : "text-navy-500 hover:bg-cream-100 hover:text-navy-700"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {user ? (
            <>
              <span
                className="max-w-[140px] truncate rounded-full bg-lavender-50 px-4 py-1.5 text-xs font-bold text-navy-700"
                title={user.email ?? ""}
                dir="ltr"
              >
                {displayName}
              </span>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-full border-2 border-cream-200 px-4 py-1.5 text-xs font-bold text-navy-600 transition-all duration-200 hover:border-coral-300 hover:text-coral-500 disabled:opacity-50"
              >
                {loggingOut ? "…" : "خروج"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-outline px-4 py-1.5 text-xs">
                تسجيل الدخول
              </Link>
              <Link href="/signup" className="btn-primary px-4 py-1.5 text-xs">
                ابدئي رحلتك
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-navy-700 hover:bg-cream-100 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="القائمة"
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-lavender-100/40 bg-white/95 px-4 pb-6 pt-3 backdrop-blur-xl lg:hidden">
          <ul className="space-y-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(pathname, l.href) ? "page" : undefined}
                  className={`block rounded-2xl px-4 py-3.5 text-base font-bold transition-all duration-200 ${
                    isActive(pathname, l.href)
                      ? "bg-royal-50 text-royal-600"
                      : "text-navy-700 hover:bg-cream-100"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-2 border-t border-lavender-100/40 pt-2">
            <p className="px-4 pb-2 text-xs font-bold text-navy-400">روابط سريعة</p>
            <ul className="space-y-1">
              {anchorLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-base font-bold text-navy-600 hover:bg-cream-100"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3 space-y-3 border-t border-lavender-100/40 pt-4">
            {user ? (
              <>
                <div className="rounded-2xl bg-lavender-50 px-4 py-3">
                  <p className="truncate text-sm font-bold text-navy-700" dir="ltr">
                    {displayName}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  disabled={loggingOut}
                  className="w-full rounded-full border-2 border-cream-200 px-4 py-3.5 text-sm font-bold text-navy-600 disabled:opacity-50"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-full border-2 border-royal-200 px-4 py-3.5 text-center text-sm font-bold text-royal-600"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="block rounded-full gradient-primary px-4 py-3.5 text-center text-sm font-bold text-white shadow-soft"
                >
                  ابدئي رحلتك
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
