"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OrgLogo from "@/components/OrgLogo";
import SetupNotice from "@/components/SetupNotice";
import type { OpportunityWithMatch } from "@/lib/types";

export default function OpportunitiesClient() {
  const [rows, setRows] = useState<OpportunityWithMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/opportunities")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? "خطأ");
        return res.json();
      })
      .then((data) => setRows(data.opportunities))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-surface border-t-accent" />
          <p className="text-lg font-bold text-accent">جارٍ التحميل…</p>
        </div>
      </div>
    );

  if (error) return <SetupNotice error={error} />;

  const best = rows[0];

  function getScoreBadgeClass(score: number) {
    if (score >= 70)
      return "bg-gradient-to-r from-success-500 to-success-400 text-white";
    if (score >= 40)
      return "bg-gradient-to-r from-gold-400 to-gold-500 text-white";
    return "bg-gradient-to-r from-red-500 to-red-600 text-white";
  }

  return (
    <div className="space-y-8">
      <header className="rounded-3xl bg-teal-gradient p-6 text-white sm:px-8 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="section-title !text-white">الفرص الوظيفية</h1>
            <p className="mt-3 max-w-xl text-lg text-white/80">
              مرتبة حسب نسبة التوافق مع مهاراتك — المهارة المطلوبة الناقصة تُخصم
              20% من النتيجة.
            </p>
          </div>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10"
          >
            تحديث التقييم
          </Link>
        </div>
      </header>

      {best && (
        <div className="card border-r-4 border-accent shadow-lg transition-all hover:shadow-xl">
          <p className="text-sm font-bold text-accent">أفضل فرصة لك الآن</p>
          <h2 className="mt-2 flex flex-wrap items-center gap-3 text-xl font-extrabold" style={{ color: "var(--text)" }}>
            {best.organization && (
              <OrgLogo
                name={best.organization.name}
                logoUrl={best.organization.logo_url}
                size="lg"
              />
            )}
            <span>
              {best.title_ar} — {best.organization?.name ?? best.company}
            </span>
          </h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-3 flex-1 overflow-hidden rounded-full" style={{ background: "var(--surface)" }}>
              <div
                className="h-full rounded-full bg-gold-gradient transition-all"
                style={{ width: `${best.match.score}%` }}
              />
            </div>
            <span className="text-2xl font-extrabold text-accent">
              {best.match.score}%
            </span>
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <span className="mb-4 text-5xl">🔍</span>
          <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>لا توجد فرص حالياً</h2>
          <p className="mt-2 text-accent">
            قم بتحديث تقييمك للحصول على فرص مناسبة لمهاراتك.
          </p>
          <Link href="/assessment" className="btn-primary mt-6">
            تحديث التقييم
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {rows.map((opp) => (
            <Link
              key={opp.id}
              href={`/opportunities/${opp.id}`}
              className="card block transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {opp.organization && (
                    <OrgLogo
                      name={opp.organization.name}
                      logoUrl={opp.organization.logo_url}
                      size="sm"
                    />
                  )}
                  <div>
                    <h3 className="font-bold" style={{ color: "var(--text)" }}>{opp.title_ar}</h3>
                    <p className="text-sm text-accent">
                      {opp.organization?.name ?? opp.company} · {opp.location} ·{" "}
                      {opp.employment_type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-4 py-1.5 text-sm font-bold ${getScoreBadgeClass(opp.match.score)}`}
                  >
                    {opp.match.score}%
                  </span>
                </div>
              </div>
              {opp.match.gaps && opp.match.gaps.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {opp.match.gaps.map((g) => (
                    <span
                      key={g.skillId}
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
                    >
                      {g.skillNameAr}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
