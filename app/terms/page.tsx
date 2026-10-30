import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "شروط الاستخدام",
  description:
    "شروط استخدام منصة مِهَن: القواعد العامة، حدود المسؤولية، حقوق الملكية الفكرية، وإخلاء المسؤولية عن محتوى الإعلانات والوظائف.",
  alternates: { canonical: `${siteUrl}/terms` },
  openGraph: {
    title: "شروط الاستخدام | مِهَن",
    description: "القواعد التي تنطبق على استخدامك منصة مِهَن.",
    url: `${siteUrl}/terms`,
    locale: "ar_AR",
    type: "article",
  },
};

const lastUpdated = "2026-05-04";

const sections = [
  {
    heading: "قبول الشروط",
    paragraphs: [
      "باستخدامك منصة مِهَن فإنك توافقين على هذه الشروط. إذا لم توافقي عليها، فيرجى عدم استخدام الموقع.",
    ],
  },
  {
    heading: "طبيعة المنصة",
    paragraphs: [
      "مِهَن منصة تعليمية وتوجيهية تقدم أدوات لمساعدة النساء على استكشاف مهاراتهن وبناء مسار مهني، ولا تقدم خدمة توظيف أو وكالة.",
      "المعلومات والنصائح في الموقع ذات طابع إرشادي ولا تمثل وعداً بنتيجة أو وظيفة أو دخل.",
    ],
  },
  {
    heading: "الحساب",
    paragraphs: [
      "أنتِ مسؤولة عن سرية بيانات دخولك وعن كل نشاط يجري عبر حسابك. أبلغينا فوراً إذا لاحظتِ أي استخدام غير مصرح به.",
      "يجب أن تكون البيانات المدخلة صحيحة، ولنا الحق في تعليق أو إغلاق الحساب المخالف لشروط الاستخدام أو قواعد الاحترام.",
    ],
  },
  {
    heading: "الاستخدام المقبول",
    paragraphs: [
      "لا يجوز استخدام الموقع لنشر محتوى مخل بالآداب أو مكره أو غير قانوني، ولا لمحاولة اختراق النظام أو تعطيل الخدمة أو استخراج بيانات المستخدمين آلياً.",
      "لا يجوز إعادة نشر محتوى الموقع تجارياً دون إذن كتابي مسبق منّا.",
    ],
  },
  {
    heading: "محتوى الوظائف والإعلانات",
    paragraphs: [
      "الفرص والوظائف التي تظهر في الموقع معلنة من جهات خارجية، ولا نضمن صحتها أو استمرارها أو خلوها من الاحتيال. نوصي بالتحقق من كل معلومة قبل التواصل أو الدفع.",
      "الإعلانات التي تظهر عبر Google AdSense يحددها نظام الإعلانات تلقائياً، ولا نتحكم في المحتوى الذي يعرض ولا في طريقة اختياره.",
    ],
  },
  {
    heading: "حقوق الملكية الفكرية",
    paragraphs: [
      "الاسم والشعار وتصميم الموقع ومحتوى المقالات ملك لنا أو مرخص لنا، ولا يجوز استخدامها دون إذن.",
    ],
  },
  {
    heading: "حدود المسؤولية",
    paragraphs: [
      "لا نضمن دقة كل معلومة في الموقع، ولا خلوَها من الأخطاء، ولا نتحمل مسؤولية قرارات التوظيف أو التدريب المبنية على ما تقرينه هنا.",
    ],
  },
  {
    heading: "تعديل الشروط",
    paragraphs: [
      "قد نحدّث هذه الشروط عند الحاجة، ويُعمَل بالتاريخ الموضح أعلى الصفحة. استمرارك استخدام الموقع بعد التحديث يعني موافقتك عليه.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <h1 className="section-title">شروط الاستخدام</h1>
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
          استفسار حول الشروط؟
        </h2>
        <p className="mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          مراسلينا وسنوضّح أي بند قبل استخدامك المنصة.
        </p>
        <Link href="/contact" className="btn-outline px-6 py-2.5 text-sm">
          صفحة التواصل
        </Link>
      </div>
    </div>
  );
}