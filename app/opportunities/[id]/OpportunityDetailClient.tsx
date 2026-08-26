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
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-lavender-200 border-t-royal-500" />
          <p className="text-lg font-bold text-royal-500">جارٍ التحميل…</p>
        </div>
      </div>
    );

  if (error || !opp)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="card max-w-md text-center">
          <span className="mb-4 block text-5xl">⚠️</span>
          <h2 className="text-xl font-bold text-navy-900">
            {error ?? "الفرصة غير موجودة"}
          </h2>
          <p className="mt-2 text-royal-500">
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
    if (s >= 40) return "from-coral-400 to-coral-500";
    return "from-coral-600 to-coral-700";
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/opportunities"
        className="inline-flex items-center gap-2 font-bold text-royal-500 transition-colors hover:text-royal-700"
      >
        → رجوع إلى كل الفرص
      </Link>

      {/* Header Card */}
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
              <h1 className="text-2xl font-extrabold text-navy-900 md:text-3xl">
                {opp.title_ar}
              </h1>
              <p className="mt-2 text-royal-500">
                {opp.organization?.name ?? opp.company} · {opp.location} ·{" "}
                {opp.employment_type}
              </p>
            </div>
          </div>

          {/* Circular Progress Ring */}
          <div className="relative flex-shrink-0">
            <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#F0EBFF"
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
                  <stop offset="0%" stopColor={score >= 70 ? "#4CAF87" : score >= 40 ? "#D4A5A5" : "#c8928f"} />
                  <stop offset="100%" stopColor={score >= 70 ? "#4CAF87" : score >= 40 ? "#D4A5A5" : "#9e605e"} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-navy-900">{score}%</span>
              <span className="text-xs text-royal-500">التوافق</span>
            </div>
          </div>
        </div>

        {/* Apply Button */}
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

      {/* Description */}
      {opp.description && (
        <div className="card">
          <h2 className="section-title mb-3">الوصف</h2>
          <p className="leading-relaxed text-navy-600">{opp.description}</p>
        </div>
      )}

      {/* Skills Grid */}
      <section>
        <h2 className="section-title mb-4">المهارات المطلوبة</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...opp.match.strengths, ...opp.match.gaps].map((g) => (
            <div key={g.skillId} className="card transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-navy-900">{g.skillNameAr}</h3>
                  <p className="text-sm text-royal-500">{g.skillNameEn}</p>
                </div>
                {g.met ? (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success-50 text-success-600">
                    ✓
                  </span>
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-50 text-coral-600">
                    ✗
                  </span>
                )}
              </div>

              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-royal-500">
                  <span>المستوى: {g.userLevel}</span>
                  <span>المطلوب: {g.requiredLevel}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-lavender-50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-royal-500 to-royal-600 transition-all"
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

      {/* Learning Resources */}
      {missingRequired.length > 0 && (
        <section className="card border-coral-200 bg-gradient-to-br from-coral-50 to-coral-100/60">
          <h2 className="mb-4 text-xl font-extrabold text-coral-800">
            مصادر تعلم مجانية للمهارات الناقصة 📚
          </h2>
          <div className="space-y-5">
            {missingRequired.map((g) => (
              <div key={g.skillId} className="glass rounded-2xl p-4">
                <p className="font-bold text-navy-900">
                  {g.skillNameAr}{" "}
                  <span className="text-xs font-normal text-royal-400">
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
                        className="flex items-center gap-2 text-royal-600 underline underline-offset-4 transition-colors hover:text-navy-800"
                      >
                        <span className="text-xs">{typeLabels[r.type]}</span>
                        <span>—</span>
                        <span>{r.title}</span>
                        <span className="text-royal-400">↗</span>
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
