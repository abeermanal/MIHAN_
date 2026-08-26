"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OrgLogo from "@/components/OrgLogo";
import SetupNotice from "@/components/SetupNotice";
import { getResourcesForSkill } from "@/lib/resources";
import type { OpportunityWithMatch } from "@/lib/types";

const typeLabels: Record<string, string> = {
  article: "مقال",
  video: "فيديو",
  course: "دورة",
  practice: "تطبيق عملي",
};

export default function OpportunityDetailClient({ id }: { id: string }) {
  const [opp, setOpp] = useState<OpportunityWithMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingPlan, setCreatingPlan] = useState(false);

  useEffect(() => {
    fetch(`/api/opportunities?id=${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? "خطأ");
        return res.json();
      })
      .then((data) => setOpp(data.opportunity))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function createLearningPath() {
    setCreatingPlan(true);
    try {
      const res = await fetch("/api/learning-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunity_id: id }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "فشل الإنشاء");
      window.location.href = "/learning-path";
    } catch (err) {
      alert(err instanceof Error ? err.message : "فشل إنشاء الخطة");
    } finally {
      setCreatingPlan(false);
    }
  }

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-surface border-t-accent" />
          <p className="text-lg font-bold text-accent">جارٍ التحميل…</p>
        </div>
      </div>
    );

  if (error || !opp)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="card max-w-md text-center">
          <span className="mb-4 block text-5xl">⚠️</span>
          <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            {error ?? "الفرصة غير موجودة"}
          </h2>
          <p className="mt-2 text-accent">
            حدث خطأ أثناء تحميل بيانات الفرصة.
          </p>
          <Link href="/opportunities" className="btn-primary mt-6 inline-block">
            ← رجوع للفرص
          </Link>
        </div>
      </div>
    );

  const missingRequired = opp.match.gaps.filter((g) => g.isRequired);
  const score = opp.match.score;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  function getScoreColor(s: number) {
    if (s >= 70) return "from-success-500 to-success-400";
    if (s >= 40) return "from-gold-400 to-gold-500";
    return "from-red-500 to-red-600";
  }

  return (
    <div className="space-y-6">
      <Link
        href="/opportunities"
        className="inline-flex items-center gap-2 font-bold text-accent transition-colors hover:text-accent-hover"
      >
        → رجوع إلى كل الفرص
      </Link>

      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {opp.organization?.name && (
              <OrgLogo
                name={opp.organization.name}
                logoUrl={opp.organization.logo_url}
                size="lg"
              />
            )}
            <div>
              <h1 className="text-2xl font-extrabold md:text-3xl" style={{ color: "var(--text)" }}>
                {opp.title_ar}
              </h1>
              <p className="mt-2 text-accent">
                {opp.organization?.name ?? opp.company} · {opp.location} ·{" "}
                {opp.employment_type}
              </p>
            </div>
          </div>

          <div className="relative flex-shrink-0">
            <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--border)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className={`bg-gradient-to-r ${getScoreColor(score)}`}
                style={{
                  stroke: "url(#scoreGradient)",
                  strokeDasharray: circumference,
                  strokeDashoffset: offset,
                  transition: "stroke-dashoffset 1s ease-in-out",
                }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={score >= 70 ? "#4CAF87" : score >= 40 ? "#D4B36A" : "#DC3545"} />
                  <stop offset="100%" stopColor={score >= 70 ? "#34D399" : score >= 40 ? "#C9A84C" : "#B91C1C"} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>{score}%</span>
              <span className="text-xs text-muted">التوافق</span>
            </div>
          </div>
        </div>

        {opp.url && (
          <a
            href={opp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 inline-flex items-center gap-2"
          >
            صفحة التقديم
            <span className="text-lg">↗</span>
          </a>
        )}
      </div>

      {opp.description && (
        <div className="card">
          <h2 className="section-title mb-3">الوصف</h2>
          <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>{opp.description}</p>
        </div>
      )}

      <section>
        <h2 className="section-title mb-4">المهارات المطلوبة</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...opp.match.strengths, ...opp.match.gaps].map((g) => (
            <div key={g.skillId} className="card transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold" style={{ color: "var(--text)" }}>{g.skillNameAr}</h3>
                  <p className="text-sm text-accent">{g.skillNameEn}</p>
                </div>
                {g.met ? (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success-50 text-success-600">
                    ✓
                  </span>
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-warning-50 text-warning-700">
                    ✗
                  </span>
                )}
              </div>

              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-accent">
                  <span>المستوى: {g.userLevel}</span>
                  <span>المطلوب: {g.requiredLevel}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--surface)" }}>
                  <div
                    className="h-full rounded-full bg-gold-gradient transition-all"
                    style={{
                      width: `${Math.min(((g.userLevel ?? 0) / g.requiredLevel) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {missingRequired.length > 0 && (
        <section className="card" style={{ borderColor: "var(--accent)", background: "var(--accent-subtle)" }}>
          <h2 className="mb-4 text-xl font-extrabold text-accent">
            مصادر تعلم مجانية للمهارات الناقصة 📚
          </h2>
          <div className="space-y-5">
            {missingRequired.map((g) => (
              <div key={g.skillId} className="glass rounded-2xl p-4">
                <p className="font-bold" style={{ color: "var(--text)" }}>
                  {g.skillNameAr}{" "}
                  <span className="text-xs font-normal text-muted">
                    ({g.skillNameEn}) — المطلوب مستوى {g.requiredLevel}
                  </span>
                </p>
                <ul className="mt-2 space-y-2">
                  {getResourcesForSkill(g.skillNameEn).map((r) => (
                    <li key={r.url}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-accent underline underline-offset-4 transition-colors hover:text-accent-hover"
                      >
                        <span className="text-xs">{typeLabels[r.type]}</span>
                        <span>—</span>
                        <span>{r.title}</span>
                        <span className="text-accent">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button
            className="btn-accent mt-6"
            onClick={createLearningPath}
            disabled={creatingPlan}
          >
            {creatingPlan ? "جارٍ الإنشاء…" : "إنشاء مسار تعلم لهذه الفرصة"}
          </button>
        </section>
      )}
    </div>
  );
}
