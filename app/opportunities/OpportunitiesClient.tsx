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
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-royal-200 border-t-royal-600" />
          <p className="text-lg font-bold text-royal-600">جارٍ التحميل…</p>
        </div>
      </div>
    );

  if (error) return <SetupNotice error={error} />;

  const best = rows[0];

  function getScoreBadgeClass(score: number) {
    if (score >= 70)
      return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
    if (score >= 40)
      return "bg-gradient-to-r from-coral-400 to-coral-500 text-white";
    return "bg-gradient-to-r from-red-400 to-red-500 text-white";
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="rounded-3xl bg-gradient-to-r from-navy-900 via-royal-900 to-navy-800 px-8 py-10 text-white">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="section-title text-3xl text-white">الفرص الوظيفية</h1>
            <p className="mt-3 max-w-xl text-lg text-white/70">
              مرتبة حسب نسبة التوافق مع مهاراتك — المهارة المطلوبة الناقصة تُخصم
              20% من النتيجة.
            </p>
          </div>
          <Link
            href="/assessment"
            className="btn-outline border-white text-white hover:bg-white hover:text-navy-900"
          >
            تحديث التقييم
          </Link>
        </div>
      </header>

      {/* Best Opportunity */}
      {best && (
        <div className="card border-r-4 border-royal-600 shadow-lg transition-all hover:shadow-xl">
          <p className="text-sm font-bold text-royal-500">أفضل فرصة لك الآن</p>
          <h2 className="mt-2 flex flex-wrap items-center gap-3 text-xl font-extrabold text-navy-800">
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
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-royal-500 to-royal-700 transition-all"
                style={{ width: `${best.match.score}%` }}
              />
            </div>
            <span className="text-2xl font-extrabold text-royal-700">
              {best.match.score}%
            </span>
          </div>
        </div>
      )}

      {/* Results List */}
      {rows.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <span className="mb-4 text-5xl">🔍</span>
          <h2 className="text-xl font-bold text-navy-800">لا توجد فرص حالياً</h2>
          <p className="mt-2 text-royal-500">
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
                    <h3 className="font-bold text-navy-800">{opp.title_ar}</h3>
                    <p className="text-sm text-royal-500">
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
                      className="rounded-full bg-coral-50 px-3 py-1 text-xs font-medium text-coral-700"
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
