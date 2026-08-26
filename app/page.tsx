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
  { name: "إدارة المشاريع", size: "text-xl md:text-2xl" },
  { name: "التصميم", size: "text-lg md:text-xl" },
  { name: "التسويق الرقمي", size: "text-base md:text-lg" },
  { name: "التحليل", size: "text-sm md:text-base" },
  { name: "التواصل", size: "text-lg md:text-xl" },
  { name: "القيادة", size: "text-xl md:text-2xl" },
  { name: "JavaScript", size: "text-xs md:text-sm" },
  { name: "Python", size: "text-sm md:text-base" },
  { name: "Excel", size: "text-base md:text-lg" },
  { name: "المحاسبة", size: "text-sm md:text-base" },
  { name: "HR", size: "text-base md:text-lg" },
  { name: "كتابة المحتوى", size: "text-lg md:text-xl" },
  { name: "UI/UX", size: "text-base md:text-lg" },
  { name: "SQL", size: "text-xs md:text-sm" },
  { name: "الصحة", size: "text-sm md:text-base" },
];

const careerPaths = [
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "مطورة ويب",
    desc: "انضمي لسوق التقنية المتنامي وابني مواقع وتطبيقات حديثة.",
    skills: ["JavaScript", "React", "HTML/CSS", "Node.js"],
    match: 87,
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20V10" />
        <path d="M18 20V4" />
        <path d="M6 20v-4" />
      </svg>
    ),
    title: "محللة بيانات",
    desc: "حوّلي البيانات إلى قرارات استراتيجية ذكية للشركات.",
    skills: ["Excel", "Python", "SQL", "تحليل"],
    match: 82,
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </svg>
    ),
    title: "مديرة تسويق رقمي",
    desc: "ادفعي العلامات التجارية للصفحة الأولى بحملات ذكية.",
    skills: ["SEO", "إعلانات", "محتوى", "تحليل"],
    match: 75,
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: "مديرة موارد بشرية",
    desc: "ابني فرقاً قوية وأسري بيئة عمل داعمة ومنتجة.",
    skills: ["تواصل", "قيادة", "تنظيم", "تقييم"],
    match: 91,
  },
];

function ProgressRing({
  percent,
  label,
}: {
  percent: number;
  label: string;
}) {
  const size = 96;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={size} height={size} className="shrink-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ring-grad-gold)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="ring-grad-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D4B36A" />
            <stop offset="100%" stopColor="#C9A84C" />
          </linearGradient>
        </defs>
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="15"
          style={{
            fill: "var(--text)",
            fontWeight: 800,
          }}
        >
          {percent}%
        </text>
      </svg>
      <span
        className="text-[11px] font-bold"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </span>
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
      <section className="relative overflow-hidden rounded-3xl" style={{ backgroundColor: "var(--surface)" }}>
        <div
          className="pointer-events-none absolute inset-0 bg-pattern-grid bg-grid opacity-100"
        />

        <div className="relative z-10 grid items-center gap-10 md:gap-12 lg:grid-cols-2 px-5 py-12 sm:px-8 md:px-16 md:py-24">
          <div
            className={`space-y-5 transition-all duration-700 sm:space-y-6 ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <span
              className="inline-block rounded-full px-4 py-1.5 text-[11px] font-bold sm:text-xs"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "var(--accent-subtle)",
                color: "var(--accent)",
              }}
            >
              منصة عربية للتمكين المهني
            </span>
            <h1
              className="text-2xl font-extrabold leading-tight sm:text-3xl md:text-5xl"
              style={{ color: "var(--text)" }}
            >
              اكتشفي مهاراتك...
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(to left, var(--accent), #26A8A8)",
                }}
              >
                وابني مستقبلك
              </span>
            </h1>
            <p
              className="max-w-lg text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              مِهَن تستخدم الذكاء الاصطناعي لمساعدتك على اكتشاف قدراتك، فهم
              مهاراتك، واختيار المسار المهني الذي يناسبك.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/assessment"
                className="btn-primary min-h-[48px] px-6 py-3 text-sm sm:px-7 sm:text-base"
              >
                اكتشفي مهاراتك الآن
              </Link>
              <Link
                href="/#how-it-works"
                className="btn-outline min-h-[48px] px-6 py-3 text-sm sm:px-7 sm:text-base"
              >
                كيف تعمل مِهَن؟
              </Link>
            </div>
          </div>

          <div
            className={`transition-all delay-200 duration-700 ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <div
              className="glass relative rounded-3xl p-4 sm:p-6 backdrop-blur-xl"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--surface-raised) 70%, transparent)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="mb-4 flex items-center gap-2 sm:mb-5">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-gold-400" />
                <span className="h-3 w-3 rounded-full bg-success-500" />
                <span
                  className="mr-auto text-[10px] font-bold sm:text-xs"
                  style={{ color: "var(--muted)" }}
                >
                  MIHAN Dashboard
                </span>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { name: "إدارة المشاريع", level: 85 },
                  { name: "التصميم", level: 72 },
                  { name: "التحليل", level: 90 },
                  { name: "التواصل", level: 65 },
                ].map((s) => (
                  <div
                    key={s.name}
                    className="rounded-2xl p-2.5 sm:p-3"
                    style={{
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--surface)",
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className="text-[10px] font-bold sm:text-xs"
                        style={{ color: "var(--text)" }}
                      >
                        {s.name}
                      </span>
                      <span
                        className="text-[9px] font-bold sm:text-[10px]"
                        style={{ color: "var(--muted)" }}
                      >
                        {s.level}%
                      </span>
                    </div>
                    <div
                      className="h-1.5 w-full overflow-hidden rounded-full"
                      style={{ backgroundColor: "var(--border)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${s.level}%`,
                          background:
                            "linear-gradient(to left, #D4B36A, #C9A84C)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="flex items-center justify-around rounded-2xl p-3 sm:p-4"
                style={{
                  border: "1px solid var(--border)",
                  background:
                    "linear-gradient(to bottom right, var(--accent-subtle), transparent)",
                }}
              >
                <ProgressRing percent={87} label="التوافق العام" />
                <ProgressRing percent={73} label="مهارات تقنية" />
                <ProgressRing percent={92} label="مهارات شخصية" />
              </div>

              <div
                className="mt-3 flex items-center gap-3 rounded-2xl p-2.5 shadow-sm sm:mt-4 sm:p-3"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                }}
              >
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-extrabold text-white shadow-soft sm:h-10 sm:w-10 sm:text-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #D4B36A, #C9A84C, #B8963E)",
                    color: "#0A1F1F",
                  }}
                >
                  ٩١٪
                </div>
                <div className="min-w-0">
                  <p
                    className="truncate text-[10px] font-bold sm:text-xs"
                    style={{ color: "var(--text)" }}
                  >
                    أعلى فرصة: مديرة موارد بشرية
                  </p>
                  <p
                    className="text-[9px] sm:text-[10px]"
                    style={{ color: "var(--muted)" }}
                  >
                    متوافقة مع مهاراتك الحالية
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative overflow-hidden rounded-3xl px-5 py-12 sm:px-8 md:px-16 md:py-16"
        style={{
          background:
            "linear-gradient(135deg, #0D5555, #0D2B2B, #0A1F1F)",
        }}
      >
        <div className="pointer-events-none absolute -left-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-teal-500/15 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-10 text-center sm:mb-12">
            <span
              className="mb-3 inline-block rounded-full px-4 py-1.5 text-[11px] font-bold sm:text-xs"
              style={{
                border: "1px solid rgba(201,168,76,0.3)",
                backgroundColor: "rgba(201,168,76,0.1)",
                color: "var(--accent)",
              }}
            >
              كيف تعمل مِهَن؟
            </span>
            <h2
              className="text-2xl font-extrabold md:text-3xl"
              style={{ color: "var(--text)" }}
            >
              أربع خطوات نحو مستقبلك
            </h2>
            <p
              className="mx-auto mt-3 max-w-lg text-sm sm:text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              عملية بسيطة ومحسّنة تأخذك من اكتشاف المهارات إلى فرصة العمل
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                title: "اكتشفي مهاراتك",
                desc: "أجيبي عن أسئلة ذكية تكشف عن مهاراتك الحقيقية وقدراتك الخفية.",
              },
              {
                num: "02",
                title: "تعرّفي على مسارك",
                desc: "الذكاء الاصطناعي يحلل إجاباتك ويقترح المسارات المهنية الأنسب لك.",
              },
              {
                num: "03",
                title: "ابني خطتك",
                desc: "خطة تعلم مخصصة بموارد مجانية تأخذك خطوة بخطوة نحو هدفك.",
              },
              {
                num: "04",
                title: "انطلقي للعمل",
                desc: "فرص متوافقة مع مهاراتك وشراكات مع شركات تدعم العائدات للعمل.",
              },
            ].map((step) => (
              <div key={step.num} className="relative text-center">
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-lg font-extrabold"
                  style={{
                    background:
                      "linear-gradient(135deg, #D4B36A, #C9A84C, #B8963E)",
                    color: "#0A1F1F",
                  }}
                >
                  {step.num}
                </div>
                <h3
                  className="mb-2 text-base font-extrabold"
                  style={{ color: "var(--text)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl px-5 py-12 sm:px-8 md:px-16 md:py-16" style={{ background: "linear-gradient(135deg, #0D5555, #0A1F1F)" }}>
        <div className="pointer-events-none absolute -left-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-gold-500/10 blur-3xl" />

        <div className="relative z-10 grid items-center gap-10 md:gap-12 lg:grid-cols-2">
          <div className="space-y-5 sm:space-y-6">
            <span
              className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm sm:text-xs"
            >
              مدعومة بالذكاء الاصطناعي
            </span>
            <h2
              className="text-xl font-extrabold leading-snug sm:text-2xl md:text-4xl"
              style={{ color: "var(--text)" }}
            >
              الذكاء الاصطناعي يرى
              <br />
              <span style={{ color: "var(--accent)" }}>
                ما قد لا ترينه
              </span>
            </h2>
            <p
              className="max-w-md text-sm leading-relaxed sm:text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              نستخدم نماذج ذكية تحلل مهاراتك وخبراتك لتكتشف فرصاً لا تظهر في
              البحث التقليدي — فرص مصممة لكِ تحديداً.
            </p>
            <Link
              href="/assessment"
              className="btn-primary inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-7 py-3"
            >
              اختبري بنفسك
            </Link>
          </div>

          <div className="relative flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {aiTags.map((tag, i) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 sm:px-4 sm:py-2 sm:text-sm"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {tag}
              </span>
            ))}
            <div className="pointer-events-none absolute inset-0 m-auto h-48 w-48 rounded-full border border-dashed border-white/10" />
            <div className="pointer-events-none absolute inset-0 m-auto h-32 w-32 rounded-full border border-dashed border-white/5" />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 text-center sm:mb-10">
          <span
            className="mb-3 inline-block rounded-full px-4 py-1 text-xs font-bold"
            style={{
              backgroundColor: "var(--accent-subtle)",
              color: "var(--accent)",
            }}
          >
            +٥٠ مهارة
          </span>
          <h2 className="section-title">المهارات</h2>
          <p
            className="mx-auto mt-3 max-w-lg text-sm sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            أكثر من ٥٠ مهارة مطلوبة في السوق العربية — اكتشفي أيها أقرب لك
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {skillCloud.map((s, i) => {
            const isGold = i % 3 === 0;
            return (
              <span
                key={s.name}
                className={`${s.size} cursor-default rounded-2xl px-3 py-2 font-bold transition-all duration-200 hover:scale-105 hover:shadow-soft sm:rounded-2xl sm:px-5 sm:py-3`}
                style={{
                  color: isGold ? "var(--accent)" : "var(--text-secondary)",
                  backgroundColor: isGold
                    ? "var(--accent-subtle)"
                    : "var(--surface-raised)",
                  border: `1px solid ${isGold ? "rgba(201,168,76,0.2)" : "var(--border)"}`,
                }}
              >
                {s.name}
              </span>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Link href="/assessment" className="btn-outline min-h-[48px]">
            قيّمي مهاراتي الآن
          </Link>
        </div>
      </section>

      <section id="career-paths">
        <div className="mb-8 text-center sm:mb-10">
          <span
            className="mb-3 inline-block rounded-full px-4 py-1 text-xs font-bold"
            style={{
              backgroundColor: "var(--accent-subtle)",
              color: "var(--accent)",
            }}
          >
            المسارات
          </span>
          <h2 className="section-title">المسارات المهنية</h2>
          <p
            className="mx-auto mt-3 max-w-lg text-sm sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            مسارات مختارة بعناية — كل واحدة هي فرصة حقيقية تنتظرك
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {careerPaths.map((p) => (
            <div
              key={p.title}
              className="card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{
                  background:
                    "linear-gradient(to left, #D4B36A, #C9A84C)",
                }}
              />

              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white shadow-soft sm:h-14 sm:w-14"
                  style={{
                    background:
                      "linear-gradient(135deg, #0D5555, #147070)",
                    color: "var(--accent)",
                  }}
                >
                  {p.icon}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3
                      className="text-base font-extrabold sm:text-lg"
                      style={{ color: "var(--text)" }}
                    >
                      {p.title}
                    </h3>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold text-white sm:px-3 sm:text-xs"
                      style={{
                        background:
                          "linear-gradient(135deg, #D4B36A, #B8963E)",
                        color: "#0A1F1F",
                      }}
                    >
                      {p.match}% توافق
                    </span>
                  </div>
                  <p
                    className="text-xs leading-relaxed sm:text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {p.desc}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                {p.skills.map((sk) => (
                  <span
                    key={sk}
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-bold sm:px-3 sm:py-1 sm:text-xs"
                    style={{
                      backgroundColor: "var(--accent-subtle)",
                      color: "var(--accent)",
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>

              <Link
                href="/opportunities"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold transition-colors sm:mt-4 sm:text-sm"
                style={{ color: "var(--accent)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                استعرضي الفرص
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section
        className="relative overflow-hidden rounded-3xl px-5 py-12 text-center sm:px-8 md:px-16 md:py-16"
        style={{
          background:
            "linear-gradient(135deg, #D4B36A, #C9A84C, #B8963E)",
        }}
      >
        <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-2xl space-y-5 sm:space-y-6">
          <h2
            className="text-xl font-extrabold sm:text-2xl md:text-4xl"
            style={{ color: "#0A1F1F" }}
          >
            مستقبلك يبدأ بخطوة واحدة
          </h2>
          <p
            className="text-base sm:text-lg"
            style={{ color: "rgba(10, 31, 31, 0.7)" }}
          >
            سجلي الآن مجاناً وابدئي رحلة اكتشاف مهاراتك الحقيقية
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/signup"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-8 py-3 text-base font-bold shadow-soft transition-all duration-300 hover:shadow-glow hover:brightness-105 hover:translate-y-[-1px] sm:text-base"
              style={{
                backgroundColor: "#0A1F1F",
                color: "var(--accent)",
              }}
            >
              ابدئي رحلتك مجاناً
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border-2 px-7 py-3 text-sm font-bold transition-all duration-300 hover:bg-white/10 sm:px-7 sm:text-base"
              style={{
                borderColor: "rgba(10, 31, 31, 0.3)",
                color: "#0A1F1F",
              }}
            >
              تعرّفي على مِهَن
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
