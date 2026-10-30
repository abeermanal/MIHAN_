import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description:
    "سياسة خصوصية منصة مِهَن: البيانات التي نجمعها، استخدام ملفات الارتباط، إعلانات Google AdSense، وحقوقك في التحكم ببياناتك.",
  alternates: { canonical: `${siteUrl}/privacy` },
  openGraph: {
    title: "سياسة الخصوصية | مِهَن",
    description: "كيف نتعامل مع بياناتك وملفات الارتباط والإعلانات على منصة مِهَن.",
    url: `${siteUrl}/privacy`,
    locale: "ar_AR",
    type: "article",
  },
};

const lastUpdated = "2026-05-04";

const sections = [
  {
    heading: "مقدمة",
    paragraphs: [
      "تشرح هذه السياسة كيف تتعامل منصة مِهَن مع بياناتك عند استخدامك الموقع أو تسجيلك حساباً فيه. باستخدامك الموقع فإنك توافقين على الممارسات الموضحة هنا.",
    ],
  },
  {
    heading: "البيانات التي نجمعها",
    paragraphs: [
      "نجمع البيانات التي تختارين إدخالها عند التسجيل والتقييم، مثل الاسم والبريد الإلكتروني وكلمة المرور ومهاراتك ونتائج اختباراتك ومسارك المهني.",
      "كما نجمع بيانات استخدام عامة بالصفحة، مثل الصفحات التي زرتها والمدة التي بقيتِ فيها والجهاز ونظام التشغيل، ونستخدمها لتحسين تجربة الموقع.",
    ],
  },
  {
    heading: "ملفات الارتباط",
    paragraphs: [
      "يستخدم الموقع ملفات ارتباط أساسية لحفظ جلسة الدخول وتذكّر تفضيلاتك، وملفات ارتباط اختيارية لقياس أداء الصفحات.",
      "يمكنكين منع ملفات الارتباط أو حذفها من إعدادات متصفحك، مع العلم أن ذلك قد يؤثر على بعض الوظائف مثل تسجيل الدخول.",
    ],
  },
  {
    heading: "الإعلانات وGoogle AdSense",
    paragraphs: [
      "يعرض الموقع إعلانات عبر Google AdSense. تخضع هذه الإعلانات لسياسات Google الخاصة بالإعلانات، وقد تستخدم Google ملف ارتباط لعرض إعلانات مناسبة ل اهتماماتك وزياراتك السابقة.",
      "يمكنكين إيقاف الإعلانات المخصصة من صفحة إعدادات إعلانات Google على الرابط التالي: https://adssettings.google.com/ كما يمكنكين استخدام أداة اختيار الإعلانات المخصصة في إعدادات الخصوصية داخل متصفحك.",
    ],
  },
  {
    heading: "مشاركة البيانات",
    paragraphs: [
      "لا نبيع بياناتك. نشارك الحد الأدنى اللازم مع مزودي الخدمة الذين يستضيفون المنصة أو يخزّنون البيانات أو يوفّرون التحليلات، وفق اتفاقيات تحمي بياناتك.",
      "قد نفصح عن بيانات إذا طلب القانون ذلك أو لحماية حقوقنا القانونية أو سلامة المستخدمين.",
    ],
  },
  {
    heading: "حقوقك",
    paragraphs: [
      "لكِ الحق في الاطلاع على بياناتك، أو تصحيحها، أو طلب حذفها، أو سحب الموافقة على استخدامها.",
      "يمكنكين ممارسة هذه الحقوق بمراسلتنا عبر صفحة التواصل، وسننفذ الطلب خلال مدة معقولة.",
    ],
  },
  {
    heading: "حماية البيانات وأمانها",
    paragraphs: [
      "نحمي بياناتك بإجراءات تقنية وتنظيمية مناسبة، بما في ذلك تشفير كلمات المرور والتحقق من الهوية عند كل طلب حساس.",
      "ولا يمكن ضمان أمان مئة بالمئة على أي موقع، لذلك نطلب منك عدم مشاركة كلمة المرور الخاصة بك مع أي جهة.",
    ],
  },
  {
    heading: "التغييرات على السياسة",
    paragraphs: [
      "قد نحدّث هذه السياسة عند تغيّر خدماتنا أو الأنظمة المعمول بها. سيظهر تاريخ آخر تحديث أعلى الصفحة، وسيتم اعتماد التغييرات فور نشرها هنا.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <h1 className="section-title">سياسة الخصوصية</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          آخر تحديث: {lastUpdated}
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.heading} className="space-y-3">
          <h2 className="text-xl font-extrabold" style={{ color: "var(--heading)" }}>
            {section.heading}
          </h2>
          {section.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="leading-loose"
              style={{ color: "var(--text-secondary)" }}
            >
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <div
        className="rounded-2xl p-6"
        style={{ background: "var(--surface-raised)", border: "1px solid var(--border)" }}
      >
        <h2 className="mb-2 text-lg font-extrabold" style={{ color: "var(--heading)" }}>
          هل لديك سؤال؟
        </h2>
        <p className="mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          راسلينا عبر صفحة التواصل وسنجيبك في أقرب وقت.
        </p>
        <Link href="/contact" className="btn-outline px-6 py-2.5 text-sm">
          صفحة التواصل
        </Link>
      </div>
    </div>
  );
}