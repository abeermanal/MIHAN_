"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
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

  if (loading) return <p className="text-center text-plum-500">جارٍ التحميل…</p>;
  if (error && items.length === 0 && opportunities.length === 0)
    return <SetupNotice error={error} />;

  const completed = items.filter((i) => i.is_completed).length;
  const pct = items.length ? Math.round((completed / items.length) * 100) : 0;

  // تجميع حسب المهارة
  const grouped = items.reduce<Record<string, Item[]>>((acc, item) => {
    const key = item.skills?.name_ar ?? "عناصر عامة";
    (acc[key] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <header>
        <h1 className="section-title">مسار التعلم 📚</h1>
        <p className="mt-2 text-plum-600">
          اختاري فرصة، وسنولّد لك خطة تعلم مجانية لسد الفجوات بينك وبينها.
        </p>
      </header>

      <section className="card">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[240px] flex-1">
            <label htmlFor="opp" className="mb-1 block text-sm font-bold text-plum-700">
              الفرصة المستهدفة
            </label>
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
            <Link href="/assessment" className="btn-gold">
              ابدئي من التقييم
            </Link>
          )}
        </div>
        {error && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-rose-700">{error}</p>}
      </section>

      {items.length > 0 && (
        <section className="card">
          <div className="mb-2 flex items-center justify-between font-bold text-plum-700">
            <span>تقدمك في الخطة</span>
            <span>
              {completed} / {items.length} ({pct}%)
            </span>
          </div>
          <ProgressBar value={pct} color="green" />
        </section>
      )}

      {items.length === 0 ? (
        <p className="card text-center text-plum-500">
          لا توجد عناصر بعد — اختاري فرصة بالأعلى وأنشئي خطتك.
        </p>
      ) : (
        Object.entries(grouped).map(([skillName, skillItems]) => (
          <section key={skillName} className="card">
            <h2 className="text-lg font-extrabold text-plum-800">{skillName}</h2>
            <ul className="mt-3 space-y-3">
              {skillItems.map((item) => (
                <li
                  key={item.id}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 ${
                    item.is_completed
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-plum-100 bg-white"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.is_completed}
                      onChange={() => toggle(item)}
                      className="h-5 w-5 accent-plum-600"
                      aria-label={`تحديد ${item.title}`}
                    />
                    <div className="min-w-0">
                      <a
                        href={item.resource_url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block truncate font-bold underline-offset-4 hover:underline ${
                          item.is_completed
                            ? "text-emerald-700 line-through"
                            : "text-plum-800"
                        }`}
                      >
                        {item.title}
                      </a>
                      <span className="text-xs text-plum-400">
                        {typeLabels[item.resource_type] ?? item.resource_type}
                        {item.is_completed && " · مكتمل ✓"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(item)}
                    className="text-sm font-bold text-rose-500 hover:text-rose-700"
                  >
                    حذف
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
