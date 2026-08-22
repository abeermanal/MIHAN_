"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

const seekerLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/assessment", label: "التقييم" },
  { href: "/opportunities", label: "الفرص" },
  { href: "/skill-passport", label: "جواز المهارات" },
  { href: "/learning-path", label: "خطة التعلم" },
  { href: "/coach", label: "المدربة الذكية" },
  { href: "/return-path", label: "طريق العودة" },
];

const orgLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/opportunities", label: "الفرص" },
  { href: "/org/dashboard", label: "لوحة المنظمة" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isOrg, setIsOrg] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsOrg(data.user?.user_metadata?.user_type === "organization");
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsOrg(session?.user?.user_metadata?.user_type === "organization");
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

  // عرض مختصر للبريد: الجزء قبل @
  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    (isOrg ? user?.user_metadata?.org_profile?.name : null) ||
    user?.email?.split("@")[0];

  const links = isOrg ? orgLinks : seekerLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-plum-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-plum-700">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-plum-600 text-lg text-gold-300">M</span>
          MIHAN
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(pathname, l.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-2 font-bold transition ${
                  isActive(pathname, l.href)
                    ? "bg-plum-100 text-plum-800"
                    : "text-plum-500 hover:bg-plum-50 hover:text-plum-700"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <span
                className="max-w-[160px] truncate rounded-lg bg-plum-50 px-3 py-1.5 text-sm font-bold text-plum-700"
                title={user.email ?? ""}
                dir="ltr"
              >
                {displayName}
              </span>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-lg border-2 border-plum-200 px-3 py-1.5 text-sm font-bold text-plum-600 transition hover:border-plum-400 hover:text-plum-800 disabled:opacity-50"
              >
                {loggingOut ? "…" : "خروج"}
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-primary px-4 py-2 text-sm">
              تسجيل الدخول
            </Link>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-plum-700 hover:bg-plum-50 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="القائمة"
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <ul className="border-t border-plum-100 bg-white px-4 pb-3 lg:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(pathname, l.href) ? "page" : undefined}
                className={`block rounded-lg px-3 py-2.5 font-bold ${
                  isActive(pathname, l.href)
                    ? "bg-plum-100 text-plum-800"
                    : "text-plum-600"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}

          <li className="mt-2 border-t border-plum-100 pt-3">
            {user ? (
              <div className="flex items-center justify-between gap-2">
                <span
                  className="max-w-[180px] truncate rounded-lg bg-plum-50 px-3 py-1.5 text-sm font-bold text-plum-700"
                  title={user.email ?? ""}
                  dir="ltr"
                >
                  {displayName}
                </span>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  disabled={loggingOut}
                  className="rounded-lg border-2 border-plum-200 px-3 py-1.5 text-sm font-bold text-plum-600 disabled:opacity-50"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-plum-600 px-3 py-2.5 text-center font-bold text-white"
              >
                تسجيل الدخول
              </Link>
            )}
          </li>
        </ul>
      )}
    </header>
  );
}
