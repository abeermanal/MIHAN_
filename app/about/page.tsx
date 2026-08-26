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
    icon: "coin",
    text: "التمكين الاقتصادي للمرأة",
  },
  {
    icon: "book",
    text: "التعلم مدى الحياة وتطوير المهارات",
  },
  {
    icon: "heart",
    text: "الشمولية ودعم العائدات لسوق العمل",
  },
  {
    icon: "cpu",
    text: "الاعتماد على الذكاء الاصطناعي في التوجيه المهني",
  },
];

function ValueIcon({ icon }: { icon: string }) {
  if (icon === "coin")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M14.5 9a3.5 2 0 00-5 0" />
        <path d="M9.5 15a3.5 2 0 005 0" />
        <line x1="12" y1="7" x2="12" y2="17" />
      </svg>
    );
  if (icon === "book")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    );
  if (icon === "heart")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3.33.81-4.5 2.15A6.56 6.56 0 007.5 3A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" />
      </svg>
    );
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div dir="rtl" className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl bg-teal-gradient px-8 py-16 text-center text-white shadow-card md:px-16">
        <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-teal-400/15 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-6 h-36 w-36 rounded-full bg-gold-400/10 blur-2xl" />

        <h1 className="relative text-4xl font-extrabold leading-snug md:text-5xl">
          من نحن
        </h1>
        <p className="relative mx-auto mt-5 max-w-2xl text-lg text-white/80">
          مِهَن | MIHAN — منصة عربية لتمكين المرأة مهنياً
        </p>
        <span
          aria-hidden="true"
          className="relative mx-auto mt-6 block h-1 w-24 rounded-full bg-gold-400/60"
        />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="card border-t-4 border-t-gold-500">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-400">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold md:text-2xl" style={{ color: "var(--text)" }}>
            رسالتنا
          </h2>
          <p className="mt-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            تساعد منصة مِهَن النساء والفتيات العربيات على اكتشاف مهاراتهن غير
            المكتشفة، وبناء مسار مهني واضح، والوصول إلى فرص عمل وتدريب تتناسب
            مع قدراتهن الحقيقية.
          </p>
        </article>

        <article className="card border-t-4 border-t-teal-400">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-300">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold md:text-2xl" style={{ color: "var(--text)" }}>
            رؤيتنا
          </h2>
          <p className="mt-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            نطمح إلى عالم تستطيع فيه كل امرأة عربية أن تثبت قيمتها المهنية
            بمهاراتها وإنجازاتها، دون أن تقف الشهادات أو الظروف عائقاً أمام
            طموحها.
          </p>
        </article>
      </section>

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
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-gradient text-white shadow-soft"
              >
                <ValueIcon icon={v.icon} />
              </span>
              <p className="font-bold leading-relaxed" style={{ color: "var(--text)" }}>{v.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="section-title mb-6 text-center">المؤسِّسة والمطوِّرة</h2>
        <article className="relative overflow-hidden rounded-3xl border-2 border-gold-500 bg-gradient-to-l from-gold-500/5 via-surface-raised to-teal-500/5 p-8 shadow-card md:p-10" style={{ background: "linear-gradient(to left, rgba(201,168,76,0.05), var(--surface-raised), rgba(26,138,138,0.05))" }}>
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-right">
            <div
              aria-hidden="true"
              className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-gold-gradient text-4xl font-extrabold text-white shadow-lg ring-4 ring-gold-500/30"
            >
              ع
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>
                عبير محمد
              </h3>
              <span className="inline-block rounded-full bg-gold-500/15 px-4 py-1 text-sm font-bold text-gold-400">
                مبرمجة ومطوِّرة أنظمة ذكية
              </span>
              <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                صمّمت وطوّرت منصة مِهَن من الصفر، إيماناً منها بأهمية تمكين
                المرأة العربية عبر التكنولوجيا والذكاء الاصطناعي. تجمع عبير بين
                خبرتها في تطوير الأنظمة الذكية وشغفها بإحداث أثر اجتماعي حقيقي.
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="text-center">
        <Link href="/assessment" className="btn-primary inline-block">
          ابدئي رحلتك مع مِهَن الآن
        </Link>
      </section>
    </div>
  );
}
