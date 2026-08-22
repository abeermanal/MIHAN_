"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SkillCard from "@/components/SkillCard";
import SetupNotice from "@/components/SetupNotice";

interface SkillWithLevel {
  id: string;
  name_ar: string;
  name_en: string;
  category: string;
  level: number | null;
}

const levelOptions = [
  { value: 0, label: "لا أعرفها" },
  { value: 1, label: "مبتدئ" },
  { value: 2, label: "أساسي" },
  { value: 3, label: "جيد" },
  { value: 4, label: "متقدم" },
  { value: 5, label: "خبير" },
];

export default function AssessmentClient() {
  const router = useRouter();
  const [skills, setSkills] = useState<SkillWithLevel[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/skills")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? "خطأ");
        return res.json();
      })
      .then((data) => {
        setSkills(data.skills);
        const initial: Record<string, number> = {};
        for (const s of data.skills) {
          if (s.level != null) initial[s.id] = s.level;
        }
        setAnswers(initial);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([skill_id, level]) => ({
            skill_id,
            level,
          })),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "فشل الحفظ");
      router.push("/opportunities");
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-center text-plum-500">جارٍ التحميل…</p>;
  if (skills.length === 0)
    return <SetupNotice error={error ?? undefined} />;

  const answered = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="section-title">تقييم المهارات 🎯</h1>
        <p className="mt-2 text-plum-600">
          حددي مستواك في كل مهارة — سيستخدمه النظام لحساب توافقك مع الفرص.
        </p>
      </header>

      {error && (
        <div className="rounded-xl bg-rose-50 p-4 text-rose-700">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s) => (
          <SkillCard
            key={s.id}
            name={s.name_ar}
            nameEn={s.name_en}
            level={answers[s.id] ?? null}
          />
        ))}
      </div>

      <div className="card space-y-6">
        {skills.map((s, idx) => (
          <div key={s.id} className="border-b border-plum-50 pb-4 last:border-none last:pb-0">
            <div className="mb-2 flex items-center justify-between">
              <label className="font-bold text-plum-800" htmlFor={`skill-${s.id}`}>
                {idx + 1}. {s.name_ar}
                <span className="mr-2 text-xs font-normal text-plum-400">{s.name_en}</span>
              </label>
            </div>
            <select
              id={`skill-${s.id}`}
              className="input"
              value={answers[s.id] ?? ""}
              onChange={(e) =>
                setAnswers((prev) => {
                  const next = { ...prev };
                  if (e.target.value === "") delete next[s.id];
                  else next[s.id] = Number(e.target.value);
                  return next;
                })
              }
            >
              <option value="">— اختري المستوى —</option>
              {levelOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label} ({o.value})
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 flex items-center justify-between rounded-2xl bg-white/95 p-4 shadow-card backdrop-blur">
        <span className="text-sm text-plum-500">
          تم الإجابة على {answered} من {skills.length}
        </span>
        <button
          className="btn-primary"
          onClick={save}
          disabled={saving || answered === 0}
        >
          {saving ? "جارٍ الحفظ…" : "حفظ التقييم ومشاهدة الفرص"}
        </button>
      </div>
    </div>
  );
}
