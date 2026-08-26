import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MIHAN | منصة التوجيه المهني للنساء",
    template: "%s | MIHAN",
  },
  description:
    "منصة عربية تساعد النساء على اكتشاف مهاراتهن، قياس توافقهن مع الفرص الوظيفية، وبناء مسار تعلم مجاني — مصممة خصيصاً لدعم العائدات للعمل بعد انقطاع.",
  keywords: [
    "توجيه مهني",
    "وظائف للنساء",
    "مسار تعلم",
    "مهارات",
    "العودة للعمل",
    "فرص عمل",
  ],
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: "MIHAN",
    title: "MIHAN | منصة التوجيه المهني للنساء",
    description:
      "اكتشفي مهاراتك، قيسي توافقك مع الفرص، وابدئي مسار تعلمك المجاني اليوم.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 lg:px-6">
          {children}
        </main>

        <footer
          className="border-t"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
            <div className="grid gap-10 md:grid-cols-3">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <path
                      d="M14 2L26 14L14 26L2 14L14 2Z"
                      fill="url(#footer-gold-grad)"
                      stroke="rgba(201,168,76,0.4)"
                      strokeWidth="1"
                    />
                    <path
                      d="M14 6L22 14L14 22L6 14L14 6Z"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="0.75"
                    />
                    <defs>
                      <linearGradient
                        id="footer-gold-grad"
                        x1="2"
                        y1="2"
                        x2="26"
                        y2="26"
                      >
                        <stop offset="0%" stopColor="#D4B36A" />
                        <stop offset="50%" stopColor="#C9A84C" />
                        <stop offset="100%" stopColor="#B8963E" />
                      </linearGradient>
                    </defs>
                  </svg>
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
                </div>
                <p
                  className="max-w-xs text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  اكتشفي مهاراتك. اصنعي مسارك. ابدئي مستقبلك.
                </p>
              </div>

              <div>
                <h4
                  className="mb-4 text-sm font-bold"
                  style={{ color: "var(--text)" }}
                >
                  روابط سريعة
                </h4>
                <ul
                  className="space-y-2.5 text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <li>
                    <a href="/" className="transition hover:text-[var(--accent)]">
                      الرئيسية
                    </a>
                  </li>
                  <li>
                    <a
                      href="/assessment"
                      className="transition hover:text-[var(--accent)]"
                    >
                      اكتشفي مهاراتك
                    </a>
                  </li>
                  <li>
                    <a
                      href="/opportunities"
                      className="transition hover:text-[var(--accent)]"
                    >
                      الفرص
                    </a>
                  </li>
                  <li>
                    <a
                      href="/skill-passport"
                      className="transition hover:text-[var(--accent)]"
                    >
                      جواز المهارات
                    </a>
                  </li>
                  <li>
                    <a
                      href="/learning-path"
                      className="transition hover:text-[var(--accent)]"
                    >
                      خطة التعلم
                    </a>
                  </li>
                  <li>
                    <a
                      href="/coach"
                      className="transition hover:text-[var(--accent)]"
                    >
                      المدربة الذكية
                    </a>
                  </li>
                  <li>
                    <a
                      href="/return-path"
                      className="transition hover:text-[var(--accent)]"
                    >
                      طريق العودة
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      className="transition hover:text-[var(--accent)]"
                    >
                      عن مِهَن
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4
                  className="mb-4 text-sm font-bold"
                  style={{ color: "var(--text)" }}
                >
                  تابعينا
                </h4>
                <div className="flex gap-3">
                  <a
                    href="#"
                    aria-label="تويتر"
                    className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)] transition-all duration-200 hover:bg-gold-gradient hover:text-teal-900 hover:shadow-soft"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-label="انستغرام"
                    className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)] transition-all duration-200 hover:bg-gold-gradient hover:text-teal-900 hover:shadow-soft"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="5" />
                      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-label="لينكد إن"
                    className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)] transition-all duration-200 hover:bg-gold-gradient hover:text-teal-900 hover:shadow-soft"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div
              className="mt-10 border-t pt-6 text-center text-xs"
              style={{
                borderColor: "var(--border)",
                color: "var(--muted)",
              }}
            >
              © {new Date().getFullYear()} مِهَن — جميع الحقوق محفوظة
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
