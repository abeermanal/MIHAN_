"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SetupNotice from "@/components/SetupNotice";

interface Item {
  id: string;
  title: string;
  resource_url: string | null;
  resource_type: string;
  is_completed: boolean;
  skill_id: string | null;
  skills: { name_ar: string; name_en: string } | null;
}

interface OpportunityOption {
  id: string;
  title_ar: string;
}

const typeLabels: Record<string, string> = {
  article: "مقال",
  video: "فيديو",
  course: "دورة",
  practice: "تطبيق عملي",
};

const typeColors: Record<string, string> = {
  article: "bg-royal-100 text-royal-700",
  video: "bg-coral-100 text-coral-700",
  course: "bg-lavender-100 text-lavender-700",
  practice: "bg-cream-100 text-navy-600",
};

export default function LearningPathClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityOption[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadItems() {
    const res = await fetch("/api/learning-path");
    if (!res.ok) throw new Error((await res.json()).error ?? "خطأ");
    const data = await res.json();
    setItems(data.items);
  }

  useEffect(() => {
    Promise.all([
      fetch("/api/learning-path").then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error ?? "خطأ");
        return r.json();
      }),
      fetch("/api/opportunities").then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error ?? "خطأ");
        return r.json();
      }),
    ])
      .then(([lp, opps]) => {
        setItems(lp.items);
        setOpportunities(opps.opportunities);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function createPlan() {
    if (!selected) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/learning-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunity_id: selected }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "فشل الإنشاء");
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل الإنشاء");
    } finally {
      setCreating(false);
    }
  }

  async function toggle(item: Item) {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_completed: !i.is_completed } : i))
    );
    await fetch(`/api/learning-path/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_completed: !item.is_completed }),
    });
  }

  async function remove(item: Item) {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    await fetch(`/api/learning-path/${item.id}`, { method: "DELETE" });
  }

  if (loading) return <p className="text-center text-royal-500">جارٍ التحميل…</p>;
  if (error && items.length === 0 && opportunities.length === 0)
    return <SetupNotice error={error} />;

  const completed = items.filter((i) => i.is_completed).length;
  const pct = items.length ? Math.round((completed / items.length) * 100) : 0;

  const grouped = items.reduce<Record<string, Item[]>>((acc, item) => {
    const key = item.skills?.name_ar ?? "عناصر عامة";
    (acc[key] ??= []).push(item);
    return acc;
  }, {});

  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="rounded-3xl bg-gradient-to-l from-royal-600 via-royal-500 to-coral-400 px-8 py-10 text-white">
        <h1 className="text-3xl font-extrabold">مسار التعلم</h1>
        <p className="mt-2 text-sm text-white/80">
          اختاري فرصة، وسنولّد لك خطة تعلم مجانية لسد الفجوات بينك وبينها.
        </p>
      </header>

      {/* Opportunity selector */}
      <section className="card">
        <label htmlFor="opp" className="mb-2 block text-sm font-bold text-navy-700">
          الفرصة المستهدفة
        </label>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[240px] flex-1">
            <select
              id="opp"
              className="input"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">— اختاري فرصة —</option>
              {opportunities.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title_ar}
                </option>
              ))}
            </select>
          </div>
          <button className="btn-primary" onClick={createPlan} disabled={!selected || creating}>
            {creating ? "جارٍ الإنشاء…" : "إنشاء / تحديث الخطة"}
          </button>
          {opportunities.length === 0 && (
            <Link href="/assessment" className="btn-accent">
              ابدئي من التقييم
            </Link>
          )}
        </div>
        {error && <p className="mt-3 rounded-2xl bg-coral-50 p-3 text-coral-700">{error}</p>}
      </section>

      {/* Progress section with circular ring */}
      {items.length > 0 && (
        <section className="card">
          <div className="flex items-center gap-6">
            {/* SVG circular progress */}
            <div className="relative h-28 w-28 flex-shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 96 96">
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-lavender-100"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  fill="none"
                  stroke="url(#progressGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6C4AB6" />
                    <stop offset="100%" stopColor="#D4A5A5" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-navy-900">{pct}%</span>
              </div>
            </div>
            <div>
              <p className="text-lg font-extrabold text-navy-900">تقدمك في الخطة</p>
              <p className="text-sm text-royal-500">
                {completed} مكتمل من أصل {items.length} عنصر
              </p>
              <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-lavender-50">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-royal-500 to-coral-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-lavender-50 to-royal-50">
            <svg className="h-10 w-10 text-royal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h3 className="text-lg font-extrabold text-navy-900">لا توجد عناصر بعد</h3>
          <p className="mt-1 text-sm text-royal-400">اختاري فرصة بالأعلى وأنشئي خطتك للبدء</p>
        </div>
      ) : (
        /* Roadmap timeline */
        <div className="space-y-6">
          {Object.entries(grouped).map(([skillName, skillItems]) => {
            const completedInGroup = skillItems.filter((i) => i.is_completed).length;
            return (
              <section key={skillName}>
                {/* Group header */}
                <div className="mb-3 flex items-center gap-3">
                  <h2 className="text-lg font-extrabold text-navy-900">{skillName}</h2>
                  <span className="rounded-full bg-royal-50 px-3 py-0.5 text-xs font-bold text-royal-600">
                    {completedInGroup}/{skillItems.length}
                  </span>
                </div>

                {/* Timeline */}
                <div className="relative mr-5 border-r-2 border-lavender-200 pr-8">
                  {skillItems.map((item) => (
                    <div key={item.id} className="relative mb-4 last:mb-0">
                      {/* Timeline connector */}
                      <div
                        className={`absolute -right-[calc(2rem+5px)] top-3 h-3 w-3 rounded-full border-2 transition-colors duration-200 ${
                          item.is_completed
                            ? "border-success-500 bg-success-500"
                            : "border-lavender-300 bg-white"
                        }`}
                      />

                      {/* Item card */}
                      <div
                        className={`group relative rounded-2xl border p-4 transition-all duration-200 ${
                          item.is_completed
                            ? "border-success-200 bg-success-50"
                            : "border-lavender-100 bg-white hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Custom checkbox */}
                          <label className="relative flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              checked={item.is_completed}
                              onChange={() => toggle(item)}
                              className="peer sr-only"
                              aria-label={`تحديد ${item.title}`}
                            />
                            <div className="flex h-5 w-5 items-center justify-center rounded border-2 border-lavender-300 transition-all peer-checked:border-royal-500 peer-checked:bg-royal-500">
                              {item.is_completed && (
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </div>
                          </label>

                          <div className="min-w-0 flex-1">
                            <a
                              href={item.resource_url ?? "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block truncate font-bold underline-offset-4 hover:underline ${
                                item.is_completed
                                  ? "text-success-700 line-through"
                                  : "text-navy-900"
                              }`}
                            >
                              {item.title}
                            </a>
                            <div className="mt-1 flex items-center gap-2">
                              <span
                                className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  typeColors[item.resource_type] ?? "bg-lavender-100 text-navy-600"
                                }`}
                              >
                                {typeLabels[item.resource_type] ?? item.resource_type}
                              </span>
                              {item.is_completed && (
                                <span className="text-[10px] font-bold text-success-600">مكتمل ✓</span>
                              )}
                            </div>
                          </div>

                          {/* Delete button */}
                          <button
                            onClick={() => remove(item)}
                            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl text-rose-400 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                            title="حذف"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
