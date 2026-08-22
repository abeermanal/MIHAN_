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
    <div dir="rtl" className="space-y-12">
      {/* ترويسة الصفحة */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-plum-700 via-plum-600 to-plum-800 px-6 py-14 text-center text-white shadow-card md:px-16">
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-gold-400/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -right-8 h-44 w-44 rounded-full bg-gold-300/15 blur-2xl" />
        <h1 className="text-3xl font-extrabold leading-snug md:text-5xl">
          من نحن
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-plum-100">
          مِهَن | MIHAN — منصة عربية لتمكين المرأة مهنياً
        </p>
        <span
          aria-hidden="true"
          className="mt-6 inline-block h-1 w-24 rounded-full bg-gradient-to-l from-transparent via-gold-300 to-transparent"
        />
      </section>

      {/* الرسالة والرؤية */}
      <section className="grid gap-6 md:grid-cols-2">
        <article className="card border-t-4 border-t-plum-600">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-plum-800 md:text-2xl">
            <span aria-hidden="true" className="text-2xl">🎯</span>
            رسالتنا
          </h2>
          <p className="mt-3 leading-relaxed text-plum-600">
            تساعد منصة مِهَن النساء والفتيات العربيات على اكتشاف مهاراتهن غير
            المكتشفة، وبناء مسار مهني واضح، والوصول إلى فرص عمل وتدريب تتناسب
            مع قدراتهن الحقيقية.
          </p>
        </article>

        <article className="card border-t-4 border-t-gold-400">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-plum-800 md:text-2xl">
            <span aria-hidden="true" className="text-2xl">🌟</span>
            رؤيتنا
          </h2>
          <p className="mt-3 leading-relaxed text-plum-600">
            نطمح إلى عالم تستطيع فيه كل امرأة عربية أن تثبت قيمتها المهنية
            بمهاراتها وإنجازاتها، دون أن تقف الشهادات أو الظروف عائقاً أمام
            طموحها.
          </p>
        </article>
      </section>

      {/* القيم */}
      <section>
        <h2 className="section-title mb-6 flex items-center justify-center gap-2 text-center">
          <span aria-hidden="true" className="text-3xl">💜</span>
          قيمنا
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <li
              key={v.text}
              className="card flex items-center gap-4 transition hover:-translate-y-0.5 hover:border-gold-300"
            >
              <span
                aria-hidden="true"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-plum-100 text-xl"
              >
                {v.emoji}
              </span>
              <p className="font-bold leading-relaxed text-plum-700">{v.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* المؤسِّسة والمطوِّرة */}
      <section>
        <h2 className="section-title mb-6 text-center">المؤسِّسة والمطوِّرة</h2>
        <article className="relative overflow-hidden rounded-3xl border-2 border-gold-300 bg-gradient-to-l from-gold-50 via-white to-plum-50 p-6 shadow-card md:p-10">
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-gold-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-plum-200/40 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-right">
            {/* صورة رمزية بالأحرف الأولى */}
            <div
              aria-hidden="true"
              className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-gradient-to-br from-plum-600 to-plum-800 text-4xl font-extrabold text-gold-300 shadow-card ring-4 ring-gold-300"
            >
              ع
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-extrabold text-plum-900">
                عبير محمد
              </h3>
              <p className="inline-block rounded-lg bg-gold-100 px-3 py-1 font-bold text-gold-800">
                مبرمجة ومطوِّرة أنظمة ذكية
              </p>
              <p className="leading-relaxed text-plum-600">
                صمّمت وطوّرت منصة مِهَن من الصفر، إيماناً منها بأهمية تمكين
                المرأة العربية عبر التكنولوجيا والذكاء الاصطناعي. تجمع عبير بين
                خبرتها في تطوير الأنظمة الذكية وشغفها بإحداث أثر اجتماعي حقيقي.
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* دعوة لاتخاذ إجراء */}
      <section className="text-center">
        <Link href="/assessment" className="btn-gold">
          ابدئي رحلتك مع مِهَن الآن
        </Link>
      </section>

      {/* تذييل الصفحة */}
      <footer className="border-t border-plum-100 pt-6 text-center text-sm font-bold text-plum-500">
        MIHAN © 2026 — جميع الحقوق محفوظة
      </footer>
    </div>
  );
}
