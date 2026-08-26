"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const aiTags = [
  "تحليل السيرة الذاتية",
  "اكتشاف المهارات الخفية",
  "تنبؤ فرص التطور",
  "مطابقة ذكية",
  "نصائح مخصصة",
  "تتبع الأداء",
  "أنماط التعلم",
  "سوق العمل المباشر",
];

const skillCloud = [
  { name: "إدارة المشاريع", size: "text-xl md:text-2xl", color: "text-royal-600", bg: "bg-royal-50" },
  { name: "التصميم", size: "text-lg md:text-xl", color: "text-coral-600", bg: "bg-coral-100" },
  { name: "التسويق الرقمي", size: "text-base md:text-lg", color: "text-lavender-700", bg: "bg-lavender-50" },
  { name: "التحليل", size: "text-sm md:text-base", color: "text-navy-600", bg: "bg-cream-100" },
  { name: "التواصل", size: "text-lg md:text-xl", color: "text-royal-500", bg: "bg-royal-50" },
  { name: "القيادة", size: "text-xl md:text-2xl", color: "text-coral-500", bg: "bg-coral-50" },
  { name: "JavaScript", size: "text-xs md:text-sm", color: "text-navy-500", bg: "bg-cream-100" },
  { name: "Python", size: "text-sm md:text-base", color: "text-lavender-600", bg: "bg-lavender-50" },
  { name: "Excel", size: "text-base md:text-lg", color: "text-royal-700", bg: "bg-royal-50" },
  { name: "المحاسبة", size: "text-sm md:text-base", color: "text-coral-600", bg: "bg-coral-50" },
  { name: "HR", size: "text-base md:text-lg", color: "text-navy-600", bg: "bg-cream-100" },
  { name: "كتابة المحتوى", size: "text-lg md:text-xl", color: "text-lavender-700", bg: "bg-lavender-50" },
  { name: "UI/UX", size: "text-base md:text-lg", color: "text-coral-500", bg: "bg-coral-50" },
  { name: "SQL", size: "text-xs md:text-sm", color: "text-navy-500", bg: "bg-cream-100" },
  { name: "الصحة", size: "text-sm md:text-base", color: "text-royal-600", bg: "bg-royal-50" },
];

const careerPaths = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "مطورة ويب",
    desc: "انضمي لسوق التقنية المتنامي وابني مواقع وتطبيقات حديثة.",
    skills: ["JavaScript", "React", "HTML/CSS", "Node.js"],
    match: 87,
    color: "from-royal-600 to-royal-800",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10" />
        <path d="M18 20V4" />
        <path d="M6 20v-4" />
      </svg>
    ),
    title: "محللة بيانات",
    desc: "حوّلي البيانات إلى قرارات استراتيجية ذكية للشركات.",
    skills: ["Excel", "Python", "SQL", "تحليل"],
    match: 82,
    color: "from-lavender-500 to-royal-600",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </svg>
    ),
    title: "مديرة تسويق رقمي",
    desc: "ادفعي العلامات التجارية للصفحة الأولى بحملات ذكية.",
    skills: ["SEO", "إعلانات", "محتوى", "تحليل"],
    match: 75,
    color: "from-coral-400 to-coral-600",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: "مديرة موارد بشرية",
    desc: "ابني فرقاً قوية وأسري بيئة عمل داعمة ومنتجة.",
    skills: ["تواصل", "قيادة", "تنظيم", "تقييم"],
    match: 91,
    color: "from-royal-500 to-royal-700",
  },
];

function ProgressRing({ percent, label }: { percent: number; label: string }) {
  const size = 96;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={size} height={size} className="shrink-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F0EBFF" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6C4AB6" />
            <stop offset="100%" stopColor="#D4A5A5" />
          </linearGradient>
        </defs>
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="15"
          className="fill-navy-800 font-extrabold"
        >
          {percent}%
        </text>
      </svg>
      <span className="text-[11px] font-bold text-navy-500">{label}</span>
    </div>
  );
}

export default function HomePage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className="space-y-20 pb-12 md:space-y-24">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cream-50 via-white to-lavender-50 px-5 py-12 sm:px-8 md:px-16 md:py-24">
        {/* background decorations */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-royal-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-coral-400/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-lavender-400/8 blur-3xl" />

        <div className="relative z-10 grid items-center gap-10 md:gap-12 lg:grid-cols-2">
          {/* text */}
          <div className={`space-y-5 transition-all duration-700 sm:space-y-6 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <span className="inline-block rounded-full border border-royal-200/60 bg-royal-50/80 px-4 py-1.5 text-[11px] font-bold text-royal-600 sm:text-xs">
              ✨ منصة عربية للتمكين المهني
            </span>
            <h1 className="text-2xl font-extrabold leading-tight text-navy-900 sm:text-3xl md:text-5xl">
              اكتشفي مهاراتك…
              <br />
              <span className="bg-gradient-to-l from-royal-600 via-royal-400 to-coral-400 bg-clip-text text-transparent">
                وابني مستقبلك
              </span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-navy-500 sm:text-lg">
              مِهَن تستخدم الذكاء الاصطناعي لمساعدتك على اكتشاف قدراتك، فهم مهاراتك، واختيار المسار المهني الذي يناسبك.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link href="/assessment" className="btn-primary min-h-[48px] px-6 py-3 text-sm sm:px-7 sm:text-base">
                اكتشفي مهاراتك الآن
              </Link>
            </div>
          </div>

          {/* mockup dashboard */}
          <div className={`transition-all delay-200 duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
            <div className="glass relative rounded-3xl border border-lavender-100/60 bg-white/80 p-4 shadow-card sm:p-6 backdrop-blur-xl">
              {/* top bar */}
              <div className="mb-4 flex items-center gap-2 sm:mb-5">
                <span className="h-3 w-3 rounded-full bg-coral-400" />
                <span className="h-3 w-3 rounded-full bg-cream-300" />
                <span className="h-3 w-3 rounded-full bg-success-500" />
                <span className="mr-auto text-[10px] font-bold text-navy-400 sm:text-xs">MIHAN Dashboard</span>
              </div>

              {/* skill cards */}
              <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { name: "إدارة المشاريع", level: 85, color: "bg-royal-500" },
                  { name: "التصميم", level: 72, color: "bg-coral-400" },
                  { name: "التحليل", level: 90, color: "bg-lavender-500" },
                  { name: "التواصل", level: 65, color: "bg-royal-400" },
                ].map((s) => (
                  <div key={s.name} className="rounded-2xl border border-lavender-100/60 bg-white p-2.5 shadow-sm sm:p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-navy-700 sm:text-xs">{s.name}</span>
                      <span className="text-[9px] font-bold text-navy-400 sm:text-[10px]">{s.level}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-lavender-50">
                      <div className={`${s.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${s.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* progress rings row */}
              <div className="flex items-center justify-around rounded-2xl border border-lavender-100/60 bg-gradient-to-br from-lavender-50/50 to-white p-3 sm:p-4">
                <ProgressRing percent={87} label="التوافق العام" />
                <ProgressRing percent={73} label="مهارات تقنية" />
                <ProgressRing percent={92} label="مهارات شخصية" />
              </div>

              {/* career match pill */}
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-lavender-100/60 bg-white p-2.5 shadow-sm sm:mt-4 sm:p-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-royal-600 to-coral-400 text-xs font-extrabold text-white shadow-soft sm:h-10 sm:w-10 sm:text-sm">
                  ٩١٪
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-bold text-navy-700 sm:text-xs">أعلى فرصة: مديرة موارد بشرية</p>
                  <p className="text-[9px] text-navy-400 sm:text-[10px]">متوافقة مع مهاراتك الحالية</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── الذكاء الاصطناعي ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-royal-600 via-royal-500 to-coral-400 px-5 py-12 sm:px-8 md:px-16 md:py-16">
        <div className="pointer-events-none absolute -left-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-coral-300/20 blur-3xl" />

        <div className="relative z-10 grid items-center gap-10 md:gap-12 lg:grid-cols-2">
          <div className="space-y-5 sm:space-y-6">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm sm:text-xs">
              🤖 مدعومة بالذكاء الاصطناعي
            </span>
            <h2 className="text-xl font-extrabold leading-snug text-white sm:text-2xl md:text-4xl">
              الذكاء الاصطناعي يرى
              <br />
              <span className="text-coral-100">ما قد لا ترينه</span>
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
              نستخدم نماذج ذكية تحلل مهاراتك وخبراتك لتكتشف فرصاً لا تظهر في
              البحث التقليدي — فرص مصممة لكِ تحديداً.
            </p>
            <Link href="/assessment" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-white px-7 py-3 font-bold text-royal-600 shadow-soft transition-all duration-300 hover:shadow-glow hover:brightness-105 hover:translate-y-[-1px]">
              اختبري بنفسك
            </Link>
          </div>

          <div className="relative flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {aiTags.map((tag, i) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/20 sm:px-4 sm:py-2 sm:text-sm"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {tag}
              </span>
            ))}
            {/* decorative rings */}
            <div className="pointer-events-none absolute inset-0 m-auto h-48 w-48 rounded-full border border-dashed border-white/15" />
            <div className="pointer-events-none absolute inset-0 m-auto h-32 w-32 rounded-full border border-dashed border-white/10" />
          </div>
        </div>
      </section>

      {/* ── المهارات ── */}
      <section>
        <div className="mb-8 text-center sm:mb-10">
          <span className="mb-3 inline-block rounded-full bg-royal-50 px-4 py-1 text-xs font-bold text-royal-600">+٥٠ مهارة</span>
          <h2 className="section-title">المهارات</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-navy-500 sm:text-base">
            أكثر من ٥٠ مهارة مطلوبة في السوق العربية — اكتشفي أيها أقرب لك
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {skillCloud.map((s) => (
            <span
              key={s.name}
              className={`${s.bg} ${s.color} ${s.size} cursor-default rounded-2xl px-3 py-2 font-bold transition-all duration-200 hover:scale-105 hover:shadow-soft sm:rounded-2xl sm:px-5 sm:py-3`}
            >
              {s.name}
            </span>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/assessment" className="btn-outline min-h-[48px]">
            قيّمي مهاراتي الآن
          </Link>
        </div>
      </section>

      {/* ── المسارات المهنية ── */}
      <section id="career-paths">
        <div className="mb-8 text-center sm:mb-10">
          <span className="mb-3 inline-block rounded-full bg-lavender-50 px-4 py-1 text-xs font-bold text-lavender-700">المسارات</span>
          <h2 className="section-title">المسارات المهنية</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-navy-500 sm:text-base">
            مسارات مختارة بعناية — كل واحدة هي فرصة حقيقية تنتظرك
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {careerPaths.map((p) => (
            <div key={p.title} className="card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
              {/* top accent bar */}
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-l ${p.color}`} />

              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${p.color} text-white shadow-soft sm:h-14 sm:w-14`}>
                  {p.icon}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-extrabold text-navy-900 sm:text-lg">{p.title}</h3>
                    <span className="shrink-0 rounded-full bg-gradient-to-l from-royal-600 to-coral-400 px-2.5 py-0.5 text-[10px] font-extrabold text-white sm:px-3 sm:text-xs">
                      {p.match}% توافق
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-navy-500 sm:text-sm">{p.desc}</p>
                </div>
              </div>

              {/* skills tags */}
              <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                {p.skills.map((sk) => (
                  <span key={sk} className="rounded-full bg-lavender-50 px-2.5 py-0.5 text-[10px] font-bold text-royal-600 sm:px-3 sm:py-1 sm:text-xs">
                    {sk}
                  </span>
                ))}
              </div>

              <Link
                href="/opportunities"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-royal-600 transition-colors hover:text-coral-500 sm:mt-4 sm:text-sm"
              >
                استعرضي الفرص
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-royal-600 via-royal-500 to-coral-400 px-5 py-12 text-center text-white sm:px-8 md:px-16 md:py-16">
        <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-coral-300/15 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-2xl space-y-5 sm:space-y-6">
          <h2 className="text-xl font-extrabold sm:text-2xl md:text-4xl">
            مستقبلك يبدأ بخطوة واحدة
          </h2>
          <p className="text-base text-white/80 sm:text-lg">
            سجلي الآن مجاناً وابدئي رحلة اكتشاف مهاراتك الحقيقية
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/signup" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-white px-8 py-3 text-base font-bold text-royal-600 shadow-soft transition-all duration-300 hover:shadow-glow hover:brightness-105 hover:translate-y-[-1px] sm:text-base">
              ابدئي رحلتك مجاناً
            </Link>
            <Link href="/about" className="inline-flex min-h-[48px] items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3 text-sm font-bold text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10 sm:px-7 sm:text-base">
              تعرّفي على مِهَن
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
