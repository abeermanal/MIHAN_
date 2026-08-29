"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SetupNotice from "@/components/SetupNotice";
import type { Opportunity, Organization } from "@/lib/types";

type Status = "active" | "closed";

const statusLabels: Record<Status, { text: string; className: string }> = {
  active: { text: "نشطة", className: "bg-success-100 text-success-700" },
  closed: { text: "مغلقة", className: "bg-muted/15 text-muted-strong" },
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

  if (loading) return <p className="text-center" style={{ color: "var(--text-secondary)" }}>جارٍ التحميل…</p>;
  if (error && !org) return <SetupNotice error={error} />;

  const activeCount = rows.filter((r) => r.status !== "closed").length;
  const closedCount = rows.filter((r) => r.status === "closed").length;

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-teal-gradient p-6 text-white sm:px-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="section-title !text-white">لوحة المنظمة</h1>
            <p className="mt-2 text-white/80">
              مرحباً {org?.name} — تابعي فرصك المنشورة وأضيفي الجديد.
            </p>
          </div>
          <Link href="/org/opportunities/new" className="btn-primary">
            + إضافة فرصة جديدة
          </Link>
        </div>
      </header>

      {error && (
        <div className="rounded-2xl bg-warning-50 p-4 text-sm font-bold text-warning-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-gradient text-white shadow-soft">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" />
              <path d="M9 12h6" />
              <path d="M9 16h6" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>{rows.length}</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>إجمالي الفرص</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success-100 text-success-700">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>{activeCount}</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>فرص نشطة</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/15 text-muted-strong">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>{closedCount}</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>فرص مغلقة</p>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="card text-center">
          <span className="inline-flex h-20 w-20 mx-auto items-center justify-center rounded-2xl bg-gold-500/10 text-gold-700 dark:text-gold-400">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
          </span>
          <h2 className="mt-4 text-xl font-extrabold" style={{ color: "var(--text)" }}>
            لم تنشري أي فرصة بعد
          </h2>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            ابدئي بنشر أول فرصة وظيفية أو تدريبية لتصل إلى الباحثات عن العمل.
          </p>
          <Link href="/org/opportunities/new" className="btn-primary mt-5 inline-flex">
            نشر أول فرصة
          </Link>
        </div>
      ) : (
        <div className="card rounded-2xl border">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b text-sm" style={{ borderColor: "var(--border)", background: "var(--surface-overlay)", color: "var(--text-secondary)" }}>
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
                      className="border-b" style={{ borderColor: "var(--border)" }}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-bold" style={{ color: "var(--text)" }}>{o.title_ar}</p>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>
                          {o.location || "بدون موقع محدد"}
                        </p>
                      </td>
                      <td className="px-5 py-3.5" style={{ color: "var(--text-secondary)" }}>{formatDate(o.created_at)}</td>
                      <td className="px-5 py-3.5" style={{ color: "var(--text-secondary)" }}>
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
                            className="underline-offset-4 hover:underline"
                            style={{ color: "var(--accent)" }}
                          >
                            عرض
                          </Link>
                          <Link
                            href={`/org/opportunities/${o.id}/edit`}
                            className="underline-offset-4 hover:underline"
                            style={{ color: "var(--accent)" }}
                          >
                            تعديل
                          </Link>
                          <button
                            onClick={() => handleDelete(o)}
                            disabled={busy}
                            className="underline-offset-4 hover:underline disabled:opacity-50"
                            style={{ color: "#E57373" }}
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

          <div className="space-y-3 md:hidden">
            {rows.map((o) => {
              const status = o.status === "closed" ? "closed" : "active";
              const busy = busyId === o.id;
              return (
                <div
                  key={o.id}
                  className="rounded-2xl border p-4"
                  style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold" style={{ color: "var(--text)" }}>{o.title_ar}</p>
                      <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                        {o.location || "بدون موقع محدد"}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleStatus(o)}
                      disabled={busy}
                      title="اضغطي لتبديل الحالة"
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold transition hover:opacity-80 disabled:opacity-50 ${statusLabels[status].className}`}
                    >
                      {statusLabels[status].text}
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <span>{formatDate(o.created_at)}</span>
                    <span>{(o.required_skills ?? []).length} مهارة مطلوبة</span>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm font-bold">
                    <Link
                      href={`/opportunities/${o.id}`}
                      className="underline-offset-4 hover:underline"
                      style={{ color: "var(--accent)" }}
                    >
                      عرض
                    </Link>
                    <Link
                      href={`/org/opportunities/${o.id}/edit`}
                      className="underline-offset-4 hover:underline"
                      style={{ color: "var(--accent)" }}
                    >
                      تعديل
                    </Link>
                    <button
                      onClick={() => handleDelete(o)}
                      disabled={busy}
                      className="underline-offset-4 hover:underline disabled:opacity-50"
                      style={{ color: "#E57373" }}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        tr:hover td { background: var(--accent-subtle); }
      `}</style>
    </div>
  );
}
