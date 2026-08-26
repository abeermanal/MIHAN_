"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SetupNotice from "@/components/SetupNotice";
import type { Organization, Opportunity, Skill } from "@/lib/types";

const EMPLOYMENT_TYPES = [
  "دوام كامل",
  "دوام جزئي",
  "عمل عن بُعد",
  "تدريب",
  "مشروع مؤقت",
];

const LEVEL_LABELS = ["مبتدئة", "أساسية", "جيدة", "جيدة جداً", "متقدمة", "خبيرة"];

interface SelectedSkill {
  level: number;
  is_required: boolean;
}

interface Props {
  opportunityId?: string;
}

export default function OpportunityForm({ opportunityId }: Props) {
  const router = useRouter();
  const isEdit = Boolean(opportunityId);

  const [org, setOrg] = useState<Organization | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, SelectedSkill>>({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [url, setUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setCompany(meData.organization?.name ?? "");

        const skillsRes = await fetch("/api/skills");
        if (!skillsRes.ok) throw new Error((await skillsRes.json()).error ?? "خطأ");
        const skillsData = await skillsRes.json();
        if (cancelled) return;
        setSkills(skillsData.skills ?? []);

        if (opportunityId) {
          const oppRes = await fetch(`/api/org/opportunities?id=${opportunityId}`);
          if (oppRes.status === 404) {
            router.replace("/org/dashboard");
            return;
          }
          if (!oppRes.ok) throw new Error((await oppRes.json()).error ?? "خطأ");
          const oppData = await oppRes.json();
          if (cancelled) return;

          const opp: Opportunity = oppData.opportunity;
          setTitle(opp.title_ar ?? "");
          setDescription(opp.description ?? "");
          setCompany(opp.company || meData.organization?.name || "");
          setLocation(opp.location ?? "");
          setEmploymentType(
            opp.employment_type && EMPLOYMENT_TYPES.includes(opp.employment_type)
              ? opp.employment_type
              : ""
          );
          setUrl(opp.url ?? "");
          const restored: Record<string, SelectedSkill> = {};
          for (const r of opp.required_skills ?? []) {
            restored[r.skill_id] = { level: r.level, is_required: r.is_required };
          }
          setSelected(restored);
        }
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
  }, [opportunityId, router]);

  const filteredSkills = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter(
      (s) =>
        s.name_ar.includes(q) ||
        s.name_en.toLowerCase().includes(q) ||
        s.category.includes(q)
    );
  }, [skills, search]);

  function toggleSkill(skillId: string) {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[skillId]) delete next[skillId];
      else next[skillId] = { level: 2, is_required: true };
      return next;
    });
  }

  function updateSkill(skillId: string, patch: Partial<SelectedSkill>) {
    setSelected((prev) => ({
      ...prev,
      [skillId]: { ...prev[skillId], ...patch },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("عنوان الفرصة مطلوب.");
      return;
    }
    if (!description.trim()) {
      setError("وصف الفرصة مطلوب.");
      return;
    }

    const required_skills = Object.entries(selected).map(([skill_id, v]) => ({
      skill_id,
      level: v.level,
      is_required: v.is_required,
    }));

    const payload = {
      title_ar: title.trim(),
      description: description.trim(),
      company: company.trim() || undefined,
      location: location.trim() || undefined,
      employment_type: employmentType || undefined,
      url: url.trim() || undefined,
      required_skills,
    };

    setSaving(true);
    try {
      const res = await fetch(
        isEdit ? `/api/org/opportunities/${opportunityId}` : "/api/org/opportunities",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error((await res.json()).error ?? "فشل الحفظ");
      router.push("/org/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل الحفظ، حاولي مجدداً.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-center text-royal-500">جارٍ التحميل…</p>;
  if (error && !org) return <SetupNotice error={error} />;

  const selectedCount = Object.keys(selected).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/org/dashboard"
        className="inline-block font-bold text-royal-600 transition hover:text-royal-800"
      >
        → رجوع إلى لوحة المنظمة
      </Link>

      <header>
        <h1 className="section-title">
          {isEdit ? "تعديل الفرصة ✏️" : "إضافة فرصة جديدة 🎯"}
        </h1>
        <p className="mt-2 text-royal-500">
          {isEdit
            ? "حدّثي تفاصيل الفرصة ثم احفظي التعديلات."
            : "انشري فرصة وظيفية أو تدريبية لتظهر للباحثات عن العمل."}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label htmlFor="title" className="mb-1 block font-bold text-navy-700">
            عنوان الفرصة <span className="text-coral-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            className="input"
            placeholder="مثال: مطورة واجهات أمامية"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block font-bold text-navy-700">
            وصف الفرصة <span className="text-coral-500">*</span>
          </label>
          <textarea
            id="description"
            rows={5}
            required
            className="input resize-y"
            placeholder="المهام، بيئة العمل، المميزات، متطلبات التقديم…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="company" className="mb-1 block font-bold text-navy-700">
              اسم الجهة
            </label>
            <input
              id="company"
              type="text"
              className="input"
              placeholder={org?.name ?? ""}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            {!isEdit && (
              <p className="mt-1 text-xs text-royal-400">
                يُعبأ تلقائياً من بروفايل منظمتك.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="mb-1 block font-bold text-navy-700">
              الموقع (اختياري)
            </label>
            <input
              id="location"
              type="text"
              className="input"
              placeholder="مثال: الرياض — أو عن بُعد"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="employmentType" className="mb-1 block font-bold text-navy-700">
              نوع التعاقد
            </label>
            <select
              id="employmentType"
              className="input"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="">— اختر النوع —</option>
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="url" className="mb-1 block font-bold text-navy-700">
              رابط التقديم (اختياري)
            </label>
            <input
              id="url"
              type="url"
              dir="ltr"
              className="input"
              placeholder="https://example.com/apply"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <fieldset className="rounded-2xl border border-cream-200 p-5">
          <legend className="px-2 font-extrabold text-navy-800">
            المهارات المطلوبة{" "}
            <span className="ms-1 inline-flex items-center rounded-full bg-royal-100 px-2.5 py-0.5 text-xs font-bold text-royal-600">
              {selectedCount} مختارة
            </span>
          </legend>

          <div className="relative mb-3">
            <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-royal-400">
              🔍
            </span>
            <input
              type="search"
              className="input ps-9"
              placeholder="ابحثي عن مهارة…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredSkills.length === 0 ? (
            <p className="py-3 text-center text-sm text-royal-500">
              لا توجد مهارات مطابقة — تأكدي من تشغيل البيانات الأولية عبر POST /api/seed.
            </p>
          ) : (
            <ul className="max-h-72 space-y-1 overflow-y-auto pe-1">
              {filteredSkills.map((s) => {
                const sel = selected[s.id];
                return (
                  <li
                    key={s.id}
                    className={`rounded-2xl border p-3 transition ${
                      sel
                        ? "border-royal-300 bg-royal-50"
                        : "border-transparent hover:bg-royal-50/50"
                    }`}
                  >
                    <label className="flex cursor-pointer items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={Boolean(sel)}
                        onChange={() => toggleSkill(s.id)}
                        className="h-4 w-4 accent-royal-600"
                      />
                      <span className="font-bold text-navy-800">{s.name_ar}</span>
                      <span dir="ltr" className="text-xs text-royal-400">
                        {s.name_en}
                      </span>
                    </label>

                    {sel && (
                      <div className="mt-3 flex flex-wrap items-center gap-4 rounded-xl bg-white/60 p-3 ps-7">
                        <label className="flex items-center gap-1.5 text-sm text-royal-600">
                          المستوى المطلوب:
                          <select
                            value={sel.level}
                            onChange={(e) =>
                              updateSkill(s.id, { level: Number(e.target.value) })
                            }
                            className="rounded-lg border border-royal-200 bg-white px-2 py-1 text-sm outline-none focus:border-royal-500"
                          >
                            {[0, 1, 2, 3, 4, 5].map((lv) => (
                              <option key={lv} value={lv}>
                                {lv} — {LEVEL_LABELS[lv]}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="flex cursor-pointer items-center gap-1.5 text-sm text-royal-600">
                          <input
                            type="checkbox"
                            checked={sel.is_required}
                            onChange={(e) =>
                              updateSkill(s.id, { is_required: e.target.checked })
                            }
                            className="h-4 w-4 accent-coral-500"
                          />
                          إلزامية
                        </label>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </fieldset>

        {error && (
          <div className="rounded-xl bg-coral-50 p-3 text-sm font-bold text-coral-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link href="/org/dashboard" className="font-bold text-royal-500 transition hover:text-royal-700">
            إلغاء
          </Link>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "جارٍ الحفظ…" : isEdit ? "حفظ التعديلات" : "نشر الفرصة"}
          </button>
        </div>
      </form>
    </div>
  );
}
