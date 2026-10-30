import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export const metadata: Metadata = {
  title: "تواصلي معنا",
  description:
    "تواصلي مع فريق منصة مِهَن للاستفسارات والدعم الفني والشراكات، وشاركي ملاحظاتك لتحسين المنصة.",
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: "تواصلي معنا | مِهَن",
    description: "فريق مِهَن في خدمتك للإجابة على استفساراتك.",
    url: `${siteUrl}/contact`,
    locale: "ar_AR",
    type: "website",
  },
};

const topics = [
  {
    title: "دعم فني",
    text: "مشكلة في التسجيل أو التقييم أو عرض النتائج.",
  },
  {
    title: "استفسار عام",
    text: "سؤال حول طريقة عمل المنصة أو خصائصها.",
  },
  {
    title: "شراكات",
    text: "جهة منظمة أو مؤسسة تدريب تبحث عن تعاون.",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12">
      <header className="space-y-4 text-center">
        <span
          className="inline-block rounded-full px-4 py-1.5 text-xs font-bold"
          style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
        >
          نسعد بسماعك
        </span>
        <h1 className="section-title">تواصلي معنا</h1>
        <p
          className="mx-auto max-w-2xl leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          أي سؤال أو ملاحظة أو اقتراح للتحسين، اكتبي لنا. نقرأ كل رسالة، ونجيب
          خلال أقرب وقت ممكن.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <ContactForm />

        <div className="space-y-5">
          {topics.map((topic) => (
            <div
              key={topic.title}
              className="card space-y-1.5"
            >
              <h2 className="font-extrabold" style={{ color: "var(--heading)" }}>
                {topic.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {topic.text}
              </p>
            </div>
          ))}

          <div className="card space-y-2">
            <h2 className="font-extrabold" style={{ color: "var(--heading)" }}>
              البريد الإلكتروني
            </h2>
            {contactEmail ? (
              <a
                href={`mailto:${contactEmail}`}
                dir="ltr"
                className="text-sm font-bold"
                style={{ color: "var(--link)" }}
              >
                {contactEmail}
              </a>
            ) : (
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                البريد الرسمي غير مضاف بعد. استخدمي النموذج أعلاه وسنرد عليك عبر
                البريد الذي تتركينه.
              </p>
            )}
          </div>

          <div className="card space-y-2">
            <h2 className="font-extrabold" style={{ color: "var(--heading)" }}>
              قبل أن ترسلي
            </h2>
            <ul className="space-y-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li>اكتبي بريداً صالحاً لنتمكن من الرد.</li>
              <li>اذكري اسم الصفحة أو الوظيفة إن كان الاستفسار متعلقاً بها.</li>
              <li>لا ترسلي كلمات مرور أو بيانات حساسة.</li>
            </ul>
          </div>
        </div>
      </div>

      <section
        className="rounded-2xl p-6 text-center"
        style={{ background: "var(--surface-raised)", border: "1px solid var(--border)" }}
      >
        <p className="mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          قبل التواصل، قد تجد إجابتك في{" "}
          <Link href="/blog" className="font-bold" style={{ color: "var(--link)" }}>
            مدونة مِهَن
          </Link>
          .
        </p>
        <Link href="/privacy" className="text-xs font-bold" style={{ color: "var(--muted)" }}>
          اقرئي سياسة الخصوصية
        </Link>
      </section>
    </div>
  );
}