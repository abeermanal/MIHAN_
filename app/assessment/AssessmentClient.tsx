"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  if (loading) return <p className="text-center text-muted">جارٍ التحميل…</p>;
  if (skills.length === 0)
    return <SetupNotice error={error ?? undefined} />;

  const answered = Object.keys(answers).length;
  const pct = skills.length ? Math.round((answered / skills.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-40 sm:pb-28">
      <header className="rounded-3xl bg-teal-gradient px-8 py-10 text-white">
        <h1 className="text-3xl font-extrabold">تقييم المهارات</h1>
        <p className="mt-2 text-sm text-white/80">
          حددي مستواك في كل مهارة — سيستخدمه النظام لحساب توافقك مع الفرص.
        </p>
      </header>

      <div className="card space-y-3">
        <div className="flex items-center justify-between text-sm font-bold" style={{ color: "var(--text)" }}>
          <span>التقدم في التقييم</span>
          <span className="text-accent">{answered} / {skills.length}</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "var(--surface)" }}>
          <div
            className="h-full rounded-full bg-gold-gradient transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>أجيبي على جميع المهارات للحصول على أفضل توصيات</p>
      </div>

      {error && (
        <div className="rounded-2xl p-4" style={{ background: "rgba(220, 53, 69, 0.1)", color: "#DC3545" }}>{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s, idx) => {
          const selected = answers[s.id] != null;
          return (
            <div
              key={s.id}
              className="card transition-all duration-200"
              style={{
                borderColor: selected ? "var(--accent)" : undefined,
                background: selected ? "var(--accent-subtle)" : undefined,
              }}
            >
              <div className="mb-3">
                <span className="text-xs font-bold text-accent">#{idx + 1}</span>
                <h3 className="text-base font-extrabold" style={{ color: "var(--text)" }}>{s.name_ar}</h3>
                <p className="text-xs text-muted">{s.name_en}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {levelOptions.map((o) => {
                  const isActive = answers[s.id] === o.value;
                  return (
                    <button
                      key={o.value}
                      onClick={() =>
                        setAnswers((prev) => {
                          const next = { ...prev };
                          if (isActive) delete next[s.id];
                          else next[s.id] = o.value;
                          return next;
                        })
                      }
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-150 ${
                        isActive
                          ? "bg-gold-gradient shadow-soft"
                          : "border hover:border-accent"
                      }`}
                      style={{
                        color: isActive ? "#0A1F1F" : "var(--accent)",
                        borderColor: isActive ? undefined : "var(--border)",
                      }}
                    >
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-extrabold ${
                          isActive ? "bg-white/20" : ""
                        }`}
                        style={{ color: isActive ? "#0A1F1F" : "var(--accent)" }}
                      >
                        {o.value}
                      </span>
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50">
        <div
          className="glass mx-auto flex max-w-4xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-xs font-extrabold"
              style={{ color: "#0A1F1F" }}
            >
              {answered}/{skills.length}
            </div>
            <span className="text-sm font-bold" style={{ color: "var(--text)" }}>تم الإجابة على {answered} من {skills.length}</span>
          </div>
          <button
            className="btn-primary w-full sm:w-auto"
            onClick={save}
            disabled={saving || answered === 0}
          >
            {saving ? "جارٍ الحفظ…" : "حفظ التقييم ومشاهدة الفرص"}
          </button>
        </div>
      </div>
    </div>
  );
}
