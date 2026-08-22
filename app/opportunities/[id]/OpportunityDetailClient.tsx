"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SkillCard from "@/components/SkillCard";
import OrgLogo from "@/components/OrgLogo";
import ProgressBar from "@/components/ProgressBar";
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

  if (loading) return <p className="text-center text-plum-500">جارٍ التحميل…</p>;
  if (error || !opp)
    return (
      <div className="space-y-4">
        <SetupNotice error={error ?? "الفرصة غير موجودة"} />
        <Link href="/opportunities" className="btn-primary">
          ← رجوع للفرص
        </Link>
      </div>
    );

  const missingRequired = opp.match.gaps.filter((g) => g.isRequired);

  return (
    <div className="space-y-6">
      <Link
        href="/opportunities"
        className="inline-block font-bold text-plum-500 hover:text-plum-700"
      >
        → رجوع إلى كل الفرص
      </Link>

      <header className="card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {opp.organization?.name && (
              <OrgLogo
                name={opp.organization.name}
                logoUrl={opp.organization.logo_url}
                size="lg"
              />
            )}
            <div>
              <h1 className="text-2xl font-extrabold text-plum-800 md:text-3xl">
                {opp.title_ar}
              </h1>
              <p className="mt-1 text-plum-600">
                {opp.organization?.name ?? opp.company} · {opp.location} ·{" "}
                {opp.employment_type}
              </p>
            </div>
          </div>
          <div className="w-full max-w-xs">
            <div className="mb-1 flex items-center justify-between text-sm font-bold text-plum-600">
              <span>نسبة التوافق</span>
              <span className="text-lg text-plum-800">{opp.match.score}%</span>
            </div>
            <ProgressBar
              value={opp.match.score}
              color={opp.match.score >= 70 ? "green" : opp.match.score >= 40 ? "gold" : "red"}
            />
          </div>
        </div>
        {opp.description && (
          <p className="mt-4 leading-relaxed text-plum-700">{opp.description}</p>
        )}
        {opp.url && (
          <a
            href={opp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold mt-4 inline-flex"
          >
            صفحة التقديم ↗
          </a>
        )}
      </header>

      <section>
        <h2 className="section-title mb-4">المهارات المطلوبة</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...opp.match.strengths, ...opp.match.gaps].map((g) => (
            <SkillCard
              key={g.skillId}
              name={g.skillNameAr}
              nameEn={g.skillNameEn}
              level={g.userLevel}
              requiredLevel={g.requiredLevel}
              status={g.met ? "met" : "missing"}
            />
          ))}
        </div>
      </section>

      {missingRequired.length > 0 && (
        <section className="card border-gold-200 bg-gold-50/60">
          <h2 className="text-xl font-extrabold text-gold-800">
            مصادر تعلم مجانية للمهارات الناقصة 📚
          </h2>
          <ul className="mt-4 space-y-3">
            {missingRequired.map((g) => (
              <li key={g.skillId}>
                <p className="font-bold text-plum-800">
                  {g.skillNameAr}{" "}
                  <span className="text-xs font-normal text-plum-400">
                    ({g.skillNameEn}) — المطلوب مستوى {g.requiredLevel}
                  </span>
                </p>
                <ul className="mt-1 list-disc space-y-1 pr-5 text-sm">
                  {getResourcesForSkill(g.skillNameEn).map((r) => (
                    <li key={r.url}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-plum-600 underline underline-offset-4 hover:text-plum-800"
                      >
                        {typeLabels[r.type]} — {r.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <button className="btn-primary mt-5" onClick={createLearningPath} disabled={creatingPlan}>
            {creatingPlan ? "جارٍ الإنشاء…" : "إنشاء مسار تعلم لهذه الفرصة"}
          </button>
        </section>
      )}
    </div>
  );
}
