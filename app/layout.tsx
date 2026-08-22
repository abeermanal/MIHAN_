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
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-plum-100 bg-white py-6 text-center text-sm text-plum-500">
          MIHAN — منصة التوجيه المهني للنساء  💜
        </footer>
      </body>
    </html>
  );
}
