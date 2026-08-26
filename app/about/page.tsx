import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "مِهَن | MIHAN — منصة عربية لتمكين المرأة مهنياً. تعرّفي على رسالتنا ورؤيتنا وقيمنا، وتعرفي على المؤسِّسة والمطوِّرة عبير محمد.",
  keywords: [
    "من نحن",
    "مِهَن",
    "MIHAN",
    "تمكين المرأة",
    "التوجيه المهني",
    "عبير محمد",
  ],
  openGraph: {
    title: "من نحن | مِهَن — منصة عربية لتمكين المرأة مهنياً",
    description:
      "تساعد منصة مِهَن النساء والفتيات العربيات على اكتشاف مهاراتهن وبناء مسار مهني واضح.",
    locale: "ar_AR",
    type: "website",
  },
};

const values = [
  {
    emoji: "💰",
    text: "التمكين الاقتصادي للمرأة",
  },
  {
    emoji: "📚",
    text: "التعلم مدى الحياة وتطوير المهارات",
  },
  {
    emoji: "🌸",
    text: "الشمولية ودعم العائدات لسوق العمل",
  },
  {
    emoji: "🤖",
    text: "الاعتماد على الذكاء الاصطناعي في التوجيه المهني",
  },
];

export default function AboutPage() {
  return (
    <div dir="rtl" className="space-y-14">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-royal-600 via-royal-500 to-coral-400 px-8 py-16 text-center text-white shadow-card md:px-16">
        <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-coral-300/20 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-6 h-36 w-36 rounded-full bg-lavender-300/15 blur-2xl" />

        <h1 className="relative text-4xl font-extrabold leading-snug md:text-5xl">
          من نحن
        </h1>
        <p className="relative mx-auto mt-5 max-w-2xl text-lg text-white/80">
          مِهَن | MIHAN — منصة عربية لتمكين المرأة مهنياً
        </p>
        <span
          aria-hidden="true"
          className="relative mx-auto mt-6 block h-1 w-24 rounded-full bg-white/40"
        />
      </section>

      {/* Mission & Vision */}
      <section className="grid gap-6 md:grid-cols-2">
        <article className="card border-t-4 border-t-royal-500">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-royal-50 text-2xl">
            🎯
          </div>
          <h2 className="text-xl font-extrabold text-navy-900 md:text-2xl">
            رسالتنا
          </h2>
          <p className="mt-3 leading-relaxed text-navy-600">
            تساعد منصة مِهَن النساء والفتيات العربيات على اكتشاف مهاراتهن غير
            المكتشفة، وبناء مسار مهني واضح، والوصول إلى فرص عمل وتدريب تتناسب
            مع قدراتهن الحقيقية.
          </p>
        </article>

        <article className="card border-t-4 border-t-coral-400">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-coral-50 text-2xl">
            🌟
          </div>
          <h2 className="text-xl font-extrabold text-navy-900 md:text-2xl">
            رؤيتنا
          </h2>
          <p className="mt-3 leading-relaxed text-navy-600">
            نطمح إلى عالم تستطيع فيه كل امرأة عربية أن تثبت قيمتها المهنية
            بمهاراتها وإنجازاتها، دون أن تقف الشهادات أو الظروف عائقاً أمام
            طموحها.
          </p>
        </article>
      </section>

      {/* Values */}
      <section>
        <h2 className="section-title mb-6 text-center">قيمنا</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <li
              key={v.text}
              className="card flex items-center gap-4 transition hover:-translate-y-1"
            >
              <span
                aria-hidden="true"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-royal-500 to-coral-400 text-xl text-white shadow-soft"
              >
                {v.emoji}
              </span>
              <p className="font-bold leading-relaxed text-navy-900">{v.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Founder */}
      <section>
        <h2 className="section-title mb-6 text-center">المؤسِّسة والمطوِّرة</h2>
        <article className="relative overflow-hidden rounded-3xl border-2 border-lavender-200 bg-gradient-to-l from-coral-50 via-white to-royal-50 p-8 shadow-card md:p-10">
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-coral-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-royal-200/40 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-right">
            <div
              aria-hidden="true"
              className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-gradient-to-br from-royal-600 to-coral-400 text-4xl font-extrabold text-white shadow-lg ring-4 ring-lavender-200"
            >
              ع
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-extrabold text-navy-900">
                عبير محمد
              </h3>
              <span className="inline-block rounded-full bg-royal-50 px-4 py-1 text-sm font-bold text-royal-600">
                مبرمجة ومطوِّرة أنظمة ذكية
              </span>
              <p className="leading-relaxed text-navy-600">
                صمّمت وطوّرت منصة مِهَن من الصفر، إيماناً منها بأهمية تمكين
                المرأة العربية عبر التكنولوجيا والذكاء الاصطناعي. تجمع عبير بين
                خبرتها في تطوير الأنظمة الذكية وشغفها بإحداث أثر اجتماعي حقيقي.
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Link href="/assessment" className="btn-primary inline-block">
          ابدئي رحلتك مع مِهَن الآن
        </Link>
      </section>
    </div>
  );
}
