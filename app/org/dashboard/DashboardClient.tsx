"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SetupNotice from "@/components/SetupNotice";
import type { Opportunity, Organization } from "@/lib/types";

type Status = "active" | "closed";

const statusLabels: Record<Status, { text: string; className: string }> = {
  active: { text: "نشطة", className: "bg-emerald-100 text-emerald-700" },
  closed: { text: "مغلقة", className: "bg-plum-100 text-plum-600" },
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("ar", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function DashboardClient() {
  const router = useRouter();
  const [org, setOrg] = useState<Organization | null>(null);
  const [rows, setRows] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const meRes = await fetch("/api/org/me");
        if (meRes.status === 403) {
          router.replace("/"); // باحثة عن عمل — ليست جهة عمل
          return;
        }
        if (!meRes.ok) throw new Error((await meRes.json()).error ?? "خطأ");
        const meData = await meRes.json();
        if (cancelled) return;
        setOrg(meData.organization);

        const oppRes = await fetch("/api/org/opportunities");
        if (!oppRes.ok) throw new Error((await oppRes.json()).error ?? "خطأ");
        const oppData = await oppRes.json();
        if (cancelled) return;
        setRows(oppData.opportunities ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function toggleStatus(row: Opportunity) {
    if (!row.id) return;
    setBusyId(row.id);
    setError(null);
    try {
      const next: Status = row.status === "closed" ? "active" : "closed";
      const res = await fetch(`/api/org/opportunities/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "فشل التحديث");
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, status: next } : r))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحديث الحالة");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(row: Opportunity) {
    if (!row.id) return;
    if (!window.confirm(`هل تريدين حذف فرصة «${row.title_ar}» نهائياً؟`)) return;

    setBusyId(row.id);
    setError(null);
    try {
      const res = await fetch(`/api/org/opportunities/${row.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "فشل الحذف");
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل الحذف");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="text-center text-plum-500">جارٍ التحميل…</p>;
  if (error && !org) return <SetupNotice error={error} />;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title">لوحة المنظمة 🏢</h1>
          <p className="mt-2 text-plum-600">
            مرحباً {org?.name} — تابعي فرصك المنشورة وأضيفي الجديد.
          </p>
        </div>
        <Link href="/org/opportunities/new" className="btn-primary">
          + إضافة فرصة جديدة
        </Link>
      </header>

      {error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">
          {error}
        </p>
      )}

      {rows.length === 0 ? (
        <div className="card text-center">
          <span className="text-4xl">📭</span>
          <h2 className="mt-3 text-xl font-extrabold text-plum-800">
            لم تنشري أي فرصة بعد
          </h2>
          <p className="mt-2 text-plum-600">
            ابدئي بنشر أول فرصة وظيفية أو تدريبية لتصل إلى الباحثات عن العمل.
          </p>
          <Link href="/org/opportunities/new" className="btn-gold mt-5 inline-flex">
            نشر أول فرصة
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-plum-100 bg-white shadow-card">
          <table className="w-full min-w-[760px] text-right">
            <thead>
              <tr className="border-b border-plum-100 bg-plum-50 text-sm text-plum-700">
                <th className="px-4 py-3 font-bold">الفرصة</th>
                <th className="px-4 py-3 font-bold">تاريخ النشر</th>
                <th className="px-4 py-3 font-bold">المهارات المطلوبة</th>
                <th className="px-4 py-3 font-bold">الحالة</th>
                <th className="px-4 py-3 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => {
                const status = o.status === "closed" ? "closed" : "active";
                const busy = busyId === o.id;
                return (
                  <tr
                    key={o.id}
                    className="border-b border-plum-50 transition hover:bg-plum-50/60"
                  >
                    <td className="px-4 py-3">
                      <p className="font-bold text-plum-800">{o.title_ar}</p>
                      <p className="text-xs text-plum-400">
                        {o.location || "بدون موقع محدد"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-plum-600">{formatDate(o.created_at)}</td>
                    <td className="px-4 py-3 text-plum-600">
                      {(o.required_skills ?? []).length}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(o)}
                        disabled={busy}
                        title="اضغطي لتبديل الحالة"
                        className={`rounded-full px-2.5 py-1 text-xs font-extrabold transition hover:opacity-80 disabled:opacity-50 ${statusLabels[status].className}`}
                      >
                        {statusLabels[status].text}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 text-sm font-bold">
                        <Link
                          href={`/opportunities/${o.id}`}
                          className="text-plum-600 underline-offset-4 hover:text-plum-800 hover:underline"
                        >
                          عرض
                        </Link>
                        <Link
                          href={`/org/opportunities/${o.id}/edit`}
                          className="text-gold-700 underline-offset-4 hover:text-gold-800 hover:underline"
                        >
                          تعديل
                        </Link>
                        <button
                          onClick={() => handleDelete(o)}
                          disabled={busy}
                          className="text-rose-600 underline-offset-4 hover:text-rose-800 hover:underline disabled:opacity-50"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
