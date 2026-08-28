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
  article: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  video: "bg-gold-500/15 text-gold-700 dark:text-gold-400",
  course: "bg-teal-500/15 text-teal-700 dark:text-teal-200",
  practice: "bg-[var(--muted)] text-[var(--text-secondary)]",
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

  if (loading) return <p className="text-center text-gold-700 dark:text-gold-400">جارٍ التحميل…</p>;
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
      <header className="rounded-3xl bg-gradient-to-l from-teal-600 via-teal-500 to-teal-400 px-8 py-10 text-white">
        <h1 className="text-3xl font-extrabold">مسار التعلم</h1>
        <p className="mt-2 text-sm text-white/80">
          اختاري فرصة، وسنولّد لك خطة تعلم مجانية لسد الفجوات بينك وبينها.
        </p>
      </header>

      <section className="card">
        <label htmlFor="opp" className="mb-2 block text-sm font-bold text-[var(--text)]">
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
        {error && <p className="mt-3 rounded-2xl bg-rose-500/10 p-3 text-rose-400">{error}</p>}
      </section>

      {items.length > 0 && (
        <section className="card">
          <div className="flex items-center gap-6">
            <div className="relative h-28 w-28 flex-shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 96 96">
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="6"
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
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="#d4a574" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-[var(--text)]">{pct}%</span>
              </div>
            </div>
            <div>
              <p className="text-lg font-extrabold text-[var(--text)]">تقدمك في الخطة</p>
              <p className="text-sm text-gold-700 dark:text-gold-400">
                {completed} مكتمل من أصل {items.length} عنصر
              </p>
              <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-gold-400 to-teal-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {items.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gold-400/10">
            <svg className="h-10 w-10 text-gold-700 dark:text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h3 className="text-lg font-extrabold text-[var(--text)]">لا توجد عناصر بعد</h3>
          <p className="mt-1 text-sm text-gold-700 dark:text-gold-400">اختاري فرصة بالأعلى وأنشئي خطتك للبدء</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([skillName, skillItems]) => {
            const completedInGroup = skillItems.filter((i) => i.is_completed).length;
            return (
              <section key={skillName}>
                <div className="mb-3 flex items-center gap-3">
                  <h2 className="text-lg font-extrabold text-[var(--text)]">{skillName}</h2>
                  <span className="rounded-full bg-teal-500/15 px-3 py-0.5 text-xs font-bold text-teal-700 dark:text-teal-300">
                    {completedInGroup}/{skillItems.length}
                  </span>
                </div>

                <div className="relative mr-5 border-r-2 border-teal-500/30 pr-8">
                  {skillItems.map((item) => (
                    <div key={item.id} className="relative mb-4 last:mb-0">
                      <div
                        className={`absolute -right-[calc(2rem+5px)] top-3 h-3 w-3 rounded-full border-2 transition-colors duration-200 ${
                          item.is_completed
                            ? "border-success-500 bg-success-500"
                            : "border-[var(--border)] bg-[var(--surface)]"
                        }`}
                      />

                      <div
                        className={`group relative rounded-2xl border p-4 transition-all duration-200 ${
                          item.is_completed
                            ? "border-success-200 bg-success-50"
                            : "border-[var(--border)] bg-[var(--surface)] hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <label className="relative flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              checked={item.is_completed}
                              onChange={() => toggle(item)}
                              className="peer sr-only"
                              aria-label={`تحديد ${item.title}`}
                            />
                            <div className="flex h-5 w-5 items-center justify-center rounded border-2 border-[var(--border)] transition-all peer-checked:border-gold-400 peer-checked:bg-gold-400">
                              {item.is_completed && (
                                <svg className="h-3 w-3 text-teal-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
                                  : "text-[var(--text)]"
                              }`}
                            >
                              {item.title}
                            </a>
                            <div className="mt-1 flex items-center gap-2">
                              <span
                                className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  typeColors[item.resource_type] ?? "bg-[var(--muted)] text-[var(--text-secondary)]"
                                }`}
                              >
                                {typeLabels[item.resource_type] ?? item.resource_type}
                              </span>
                              {item.is_completed && (
                                <span className="text-[10px] font-bold text-success-600">مكتمل ✓</span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => remove(item)}
                            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl text-rose-400 opacity-0 transition-all hover:bg-rose-500/10 hover:text-rose-600 group-hover:opacity-100"
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
