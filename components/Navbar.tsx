"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import ThemeToggle from "@/components/ThemeToggle";

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

function GoldDiamondIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        d="M14 2L26 14L14 26L2 14L14 2Z"
        fill="url(#gold-grad)"
        stroke="rgba(201,168,76,0.4)"
        strokeWidth="1"
      />
      <path
        d="M14 6L22 14L14 22L6 14L14 6Z"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.75"
      />
      <path
        d="M14 2L14 26"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.5"
      />
      <path
        d="M2 14L26 14"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.5"
      />
      <defs>
        <linearGradient id="gold-grad" x1="2" y1="2" x2="26" y2="26">
          <stop offset="0%" stopColor="#D4B36A" />
          <stop offset="50%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#B8963E" />
        </linearGradient>
      </defs>
    </svg>
  );
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

  const userInitials = displayName
    ? displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "؟";

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{
        background: "color-mix(in srgb, var(--surface) 85%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <GoldDiamondIcon />
          <div className="flex flex-col leading-none">
            <span
              className="text-lg font-extrabold"
              style={{ color: "var(--text)" }}
            >
              مِهَن
            </span>
            <span
              className="text-[10px] font-bold tracking-[0.2em]"
              style={{ color: "var(--accent)" }}
            >
              MIHAN
            </span>
          </div>
        </Link>

        <ul className="hidden items-center gap-0.5 overflow-x-auto lg:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(pathname, l.href) ? "page" : undefined}
                className="whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold transition-all duration-200"
                style={{
                  color: isActive(pathname, l.href)
                    ? "var(--accent)"
                    : "var(--muted)",
                  backgroundColor: isActive(pathname, l.href)
                    ? "var(--accent-subtle)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(pathname, l.href)) {
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(pathname, l.href)) {
                    e.currentTarget.style.color = "var(--muted)";
                  }
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <ThemeToggle />
          {user ? (
            <>
              <div
                className="flex items-center gap-2.5 rounded-full px-3 py-1.5"
                style={{
                  border: "1.5px solid var(--accent)",
                }}
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-extrabold"
                  style={{
                    background:
                      "linear-gradient(135deg, #D4B36A, #C9A84C, #B8963E)",
                    color: "#0A1F1F",
                  }}
                >
                  {userInitials}
                </span>
                <span
                  className="max-w-[120px] truncate text-xs font-bold"
                  style={{ color: "var(--text)" }}
                  title={user.email ?? ""}
                  dir="ltr"
                >
                  {displayName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 disabled:opacity-50"
                style={{
                  border: "1.5px solid var(--border-strong)",
                  color: "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-strong)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                {loggingOut ? "…" : "خروج"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="btn-outline px-4 py-1.5 text-xs"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/signup"
                className="btn-primary px-4 py-1.5 text-xs"
              >
                ابدئي رحلتك
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl lg:hidden"
          style={{ color: "var(--text)" }}
          onClick={() => setOpen(!open)}
          aria-label="القائمة"
          aria-expanded={open}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--accent-subtle)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out lg:hidden"
        style={{
          maxHeight: open ? "800px" : "0px",
          borderTop: open ? "1px solid var(--border)" : "none",
        }}
      >
        <div className="px-4 pb-6 pt-3">
          <ul className="space-y-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(pathname, l.href) ? "page" : undefined}
                  className="block rounded-2xl px-4 py-3.5 text-base font-bold transition-all duration-200"
                  style={{
                    color: isActive(pathname, l.href)
                      ? "var(--accent)"
                      : "var(--text)",
                    backgroundColor: isActive(pathname, l.href)
                      ? "var(--accent-subtle)"
                      : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(pathname, l.href)) {
                      e.currentTarget.style.backgroundColor =
                        "var(--accent-subtle)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(pathname, l.href)) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
            <p
              className="px-4 pb-2 text-xs font-bold"
              style={{ color: "var(--muted)" }}
            >
              روابط سريعة
            </p>
            <ul className="space-y-1">
              {anchorLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-base font-bold"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="mt-3 space-y-3 pt-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-center">
              <ThemeToggle />
            </div>
            {user ? (
              <>
                <div
                  className="flex items-center gap-3 rounded-2xl px-4 py-3"
                  style={{ backgroundColor: "var(--accent-subtle)" }}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold"
                    style={{
                      background:
                        "linear-gradient(135deg, #D4B36A, #C9A84C, #B8963E)",
                      color: "#0A1F1F",
                    }}
                  >
                    {userInitials}
                  </span>
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-bold"
                      style={{ color: "var(--text)" }}
                      dir="ltr"
                    >
                      {displayName}
                    </p>
                    <p
                      className="text-[11px]"
                      style={{ color: "var(--muted)" }}
                      dir="ltr"
                    >
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  disabled={loggingOut}
                  className="w-full rounded-full px-4 py-3.5 text-sm font-bold disabled:opacity-50"
                  style={{
                    border: "1.5px solid var(--border-strong)",
                    color: "var(--text-secondary)",
                  }}
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-full px-4 py-3.5 text-center text-sm font-bold"
                  style={{
                    border: "1.5px solid var(--accent)",
                    color: "var(--accent)",
                  }}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="btn-primary block px-4 py-3.5 text-center text-sm font-bold"
                >
                  ابدئي رحلتك
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
