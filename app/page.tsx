import Link from "next/link";

const features = [
  {
    href: "/assessment",
    emoji: "🎯",
    title: "قيّمي مهاراتك",
    desc: "تقييم تفاعلي قصير يحدد مستواك في أهم مهارات سوق العمل.",
  },
  {
    href: "/opportunities",
    emoji: "💼",
    title: "اكتشفي الفرص",
    desc: "فرص وظيفية وتدريبية مرتبة حسب نسبة توافقك مع كل فرصة.",
  },
  {
    href: "/learning-path",
    emoji: "📚",
    title: "مسار التعلم",
    desc: "خطة تعلم مجانية خطوة بخطوة لسد الفجوات بينك وبين وظيفتك.",
  },
  {
    href: "/coach",
    emoji: "🤖",
    title: "المدربة الذكية",
    desc: "مدربة ذكية تحلل ملفك وتقدم نصائح مخصصة لمسارك المهني.",
  },
  {
    href: "/return-path",
    emoji: "🌸",
    title: "طريق العودة",
    desc: "خصيصاً للعائدات بعد انقطاع — وثّقي خبراتك السابقة بسهولة.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-gradient-to-l from-plum-700 via-plum-600 to-plum-800 px-6 py-14 text-center text-white shadow-card md:px-16">
        <h1 className="text-3xl font-extrabold leading-snug md:text-5xl">
          مسارك المهني يبدأ من هنا
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-plum-100">
          MIHAN تساعدك على اكتشاف مهاراتك، معرفة الفرص الأنسب لك، وسد
          الفجوات بمصادر تعلم مجانية — كل ذلك بواجهة عربية سهلة.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/assessment" className="btn-gold">
            ابدئي التقييم الآن
          </Link>
          <Link
            href="/opportunities"
            className="inline-flex items-center justify-center rounded-xl border-2 border-white/60 px-5 py-2.5 font-bold text-white transition hover:bg-white/10"
          >
            تصفحي الفرص
          </Link>
        </div>
      </section>

      <section>
        <h2 className="section-title mb-6 text-center">ماذا نقدم لك؟</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="card group transition hover:-translate-y-1 hover:border-plum-300"
            >
              <span className="text-3xl">{f.emoji}</span>
              <h3 className="mt-3 text-xl font-bold text-plum-800 group-hover:text-plum-600">
                {f.title}
              </h3>
              <p className="mt-2 leading-relaxed text-plum-600">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="card bg-gradient-to-l from-gold-50 to-plum-50 text-center">
        <h2 className="text-xl font-extrabold text-plum-800 md:text-2xl">
          انقطعتِ عن العمل؟ لستِ وحدك 💜
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-plum-600">
          صفحة «طريق العودة» تساعدك على توثيق خبراتك السابقة وتحويلها إلى
          مهارات معترف بها، لتعودي بثقة إلى سوق العمل.
        </p>
        <Link href="/return-path" className="btn-primary mt-5">
          ابدئي طريق العودة
        </Link>
      </section>
    </div>
  );
}
