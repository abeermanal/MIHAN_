"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SetupNotice from "@/components/SetupNotice";
import type { Opportunity, Organization } from "@/lib/types";

type Status = "active" | "closed";

const statusLabels: Record<Status, { text: string; className: string }> = {
  active: { text: "نشطة", className: "bg-success-50 text-success-700" },
  closed: { text: "مغلقة", className: "bg-lavender-100 text-royal-600" },
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
          router.replace("/");
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

  if (loading) return <p className="text-center text-royal-500">جارٍ التحميل…</p>;
  if (error && !org) return <SetupNotice error={error} />;

  const activeCount = rows.filter((r) => r.status !== "closed").length;
  const closedCount = rows.filter((r) => r.status === "closed").length;

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-gradient-to-l from-royal-600 via-royal-500 to-coral-400 px-8 py-10 text-white">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="section-title !text-white">لوحة المنظمة 🏢</h1>
            <p className="mt-2 text-white/80">
              مرحباً {org?.name} — تابعي فرصك المنشورة وأضيفي الجديد.
            </p>
          </div>
          <Link href="/org/opportunities/new" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-royal-600 shadow-soft transition-all duration-300 hover:shadow-glow hover:brightness-105">
            + إضافة فرصة جديدة
          </Link>
        </div>
      </header>

      {error && (
        <div className="rounded-2xl bg-coral-50 p-4 text-sm font-bold text-coral-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-royal-500 to-coral-400 text-xl text-white shadow-soft">
            📋
          </div>
          <div>
            <p className="text-2xl font-extrabold text-navy-900">{rows.length}</p>
            <p className="text-sm text-royal-500">إجمالي الفرص</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success-50 text-xl">
            ✅
          </div>
          <div>
            <p className="text-2xl font-extrabold text-navy-900">{activeCount}</p>
            <p className="text-sm text-royal-500">فرص نشطة</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender-50 text-xl">
            🔒
          </div>
          <div>
            <p className="text-2xl font-extrabold text-navy-900">{closedCount}</p>
            <p className="text-sm text-royal-500">فرص مغلقة</p>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="card text-center">
          <span className="text-5xl">📭</span>
          <h2 className="mt-4 text-xl font-extrabold text-navy-900">
            لم تنشري أي فرصة بعد
          </h2>
          <p className="mt-2 text-royal-500">
            ابدئي بنشر أول فرصة وظيفية أو تدريبية لتصل إلى الباحثات عن العمل.
          </p>
          <Link href="/org/opportunities/new" className="btn-primary mt-5 inline-flex">
            نشر أول فرصة
          </Link>
        </div>
      ) : (
        <div className="card overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[760px] text-right">
            <thead>
              <tr className="border-b border-lavender-100/60 bg-lavender-50/50 text-sm text-navy-600">
                <th className="px-5 py-3.5 font-bold">الفرصة</th>
                <th className="px-5 py-3.5 font-bold">تاريخ النشر</th>
                <th className="px-5 py-3.5 font-bold">المهارات المطلوبة</th>
                <th className="px-5 py-3.5 font-bold">الحالة</th>
                <th className="px-5 py-3.5 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => {
                const status = o.status === "closed" ? "closed" : "active";
                const busy = busyId === o.id;
                return (
                  <tr
                    key={o.id}
                    className="border-b border-lavender-50 transition hover:bg-lavender-50/60"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-navy-900">{o.title_ar}</p>
                      <p className="text-xs text-royal-400">
                        {o.location || "بدون موقع محدد"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-royal-500">{formatDate(o.created_at)}</td>
                    <td className="px-5 py-3.5 text-royal-500">
                      {(o.required_skills ?? []).length}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleStatus(o)}
                        disabled={busy}
                        title="اضغطي لتبديل الحالة"
                        className={`rounded-full px-3 py-1 text-xs font-extrabold transition hover:opacity-80 disabled:opacity-50 ${statusLabels[status].className}`}
                      >
                        {statusLabels[status].text}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 text-sm font-bold">
                        <Link
                          href={`/opportunities/${o.id}`}
                          className="text-royal-600 underline-offset-4 hover:text-navy-800 hover:underline"
                        >
                          عرض
                        </Link>
                        <Link
                          href={`/org/opportunities/${o.id}/edit`}
                          className="text-coral-500 underline-offset-4 hover:text-coral-700 hover:underline"
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
