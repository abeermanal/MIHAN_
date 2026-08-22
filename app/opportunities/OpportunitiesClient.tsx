"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OpportunityTable from "@/components/OpportunityTable";
import OrgLogo from "@/components/OrgLogo";
import ProgressBar from "@/components/ProgressBar";
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

  if (loading) return <p className="text-center text-plum-500">جارٍ التحميل…</p>;
  if (error) return <SetupNotice error={error} />;

  const best = rows[0];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title">الفرص الوظيفية 💼</h1>
          <p className="mt-2 text-plum-600">
            مرتبة حسب نسبة التوافق مع مهاراتك — المهارة المطلوبة الناقصة تُخصم
            20% من النتيجة.
          </p>
        </div>
        <Link href="/assessment" className="btn-gold">
          تحديث التقييم
        </Link>
      </header>

      {best && (
        <div className="card bg-gradient-to-l from-plum-50 to-gold-50">
          <p className="text-sm font-bold text-plum-500">أفضل فرصة لك الآن</p>
          <h2 className="mt-1 flex flex-wrap items-center gap-2 text-xl font-extrabold text-plum-800">
            {best.organization && (
              <OrgLogo
                name={best.organization.name}
                logoUrl={best.organization.logo_url}
                size="lg"
              />
            )}
            {best.title_ar} — {best.organization?.name ?? best.company}
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <ProgressBar value={best.match.score} color="gold" />
            <span className="text-lg font-extrabold text-plum-700">
              {best.match.score}%
            </span>
          </div>
        </div>
      )}

      <OpportunityTable rows={rows} />
    </div>
  );
}
