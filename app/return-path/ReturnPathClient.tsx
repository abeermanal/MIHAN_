"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SkillCard from "@/components/SkillCard";
import SetupNotice from "@/components/SetupNotice";

interface SkillWithLevel {
  id: string;
  name_ar: string;
  name_en: string;
  level: number | null;
}

const EXPERIENCE_PRESETS: {
  label: string;
  skills: { name_en: string; level: number }[];
}[] = [
  {
    label: "عملتِ في التعليم أو التدريس",
    skills: [
      { name_en: "Communication", level: 4 },
      { name_en: "Project Management", level: 3 },
      { name_en: "Problem Solving", level: 3 },
    ],
  },
  {
    label: "أدرتِ منزلاً ومشاريع أسرية",
    skills: [
      { name_en: "Project Management", level: 3 },
      { name_en: "Problem Solving", level: 3 },
      { name_en: "Creativity", level: 2 },
    ],
  },
  {
    label: "عملتِ في خدمة العملاء أو المبيعات",
    skills: [
      { name_en: "Communication", level: 4 },
      { name_en: "Digital Marketing", level: 2 },
    ],
  },
  {
    label: "عملتِ في المحاسبة أو الإدارة",
    skills: [
      { name_en: "SQL", level: 2 },
      { name_en: "Data Analysis", level: 2 },
      { name_en: "Project Management", level: 3 },
    ],
  },
  {
    label: "تطوعتِ في فعاليات أو جمعيات",
    skills: [
      { name_en: "Communication", level: 3 },
      { name_en: "Project Management", level: 2 },
    ],
  },
];

export default function ReturnPathClient() {
  const [skills, setSkills] = useState<SkillWithLevel[]>([]);
  const [experience, setExperience] = useState("");
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadSkills() {
    const res = await fetch("/api/skills");
    if (!res.ok) throw new Error((await res.json()).error ?? "خطأ");
    const data = await res.json();
    setSkills(data.skills);
  }

  useEffect(() => {
    loadSkills()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function togglePreset(label: string) {
    setSelectedPresets((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const items = selectedPresets.flatMap((label) => {
        const preset = EXPERIENCE_PRESETS.find((p) => p.label === label);
        return preset ? preset.skills : [];
      });

      if (experience.trim()) {
        items.push({ name_en: "Communication", level: 3 });
      }

      if (items.length === 0) {
        throw new Error("اختاري خبرة واحدة على الأقل أو اكتبي خبرتك.");
      }

      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "فشل الحفظ");
      await loadSkills();
      setMessage("تمت إضافة مهاراتك بنجاح 🌸 يمكنك الآن استكشاف الفرص المتوافقة معك.");
      setExperience("");
      setSelectedPresets([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  }

  const userSkills = skills.filter((s) => s.level != null);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-teal-600 via-teal-500 to-teal-400 px-8 py-14 text-center shadow-card md:px-16">
        <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-gold-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-teal-700/30 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-4 h-32 w-32 rounded-full bg-gold-200/15 blur-2xl" />

        <h1 className="relative text-4xl font-extrabold text-gold-300 md:text-5xl">
          عودتك قوة 🌸
        </h1>
        <p className="relative mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
          الانقطاع عن العمل ليس نهاية المسار — كل تجربة عشتِها اكتسبتِ منها مهارات.
          وثّقي خبراتك هنا، وسنحوّلها إلى ملف مهني يفتح لك الأبواب من جديد.
        </p>
      </section>

      {error && <SetupNotice error={error} />}

      {!error && (
        <>
          <section>
            <h2 className="section-title mb-2">ماذا فعلتِ خلال فترتك السابقة؟</h2>
            <p className="mb-5 text-text-secondary">
              اختاري ما ينطبق عليك — سنضيف المهارات المرتبطة تلقائياً إلى ملفك.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {EXPERIENCE_PRESETS.map((p) => {
                const active = selectedPresets.includes(p.label);
                return (
                  <button
                    key={p.label}
                    onClick={() => togglePreset(p.label)}
                    className={`rounded-2xl border-2 p-4 text-right font-bold transition-all duration-200 ${
                      active
                        ? "border-gold-400 bg-gold-400/10 text-gold-700 dark:text-gold-300 shadow-soft"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-gold-500/50 text-[var(--text-secondary)]"
                    }`}
                    aria-pressed={active}
                  >
                    {active && (
                      <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-xs text-teal-900">
                        ✓
                      </span>
                    )}
                    {p.label}
                  </button>
                );
              })}
            </div>

            <div className="card mt-6">
              <label htmlFor="exp" className="mb-2 block text-sm font-bold text-[var(--text)]">
                أو اكتبي خبرتك بحرية
              </label>
              <textarea
                id="exp"
                className="input min-h-[100px]"
                placeholder="مثال: أدرتُ مشروعاً منزلياً لبيع الحلويات لمدة سنتين…"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button className="btn-primary" onClick={save} disabled={saving}>
                {saving ? "جارٍ الحفظ…" : "إضافة الخبرات إلى مهاراتي"}
              </button>
              <Link href="/opportunities" className="btn-accent">
                تصفحي الفرص
              </Link>
            </div>

            {message && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-success-50 p-4">
                <span className="mt-0.5 text-lg text-success-600">✓</span>
                <p className="font-bold text-success-700">{message}</p>
              </div>
            )}
          </section>

          {userSkills.length > 0 && (
            <section>
              <h2 className="section-title mb-4">مهاراتك الحالية</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {userSkills.map((s) => (
                  <SkillCard
                    key={s.id}
                    name={s.name_ar}
                    nameEn={s.name_en}
                    level={s.level}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {loading && !error && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--border)] border-t-gold-400" />
          <span className="mr-3 text-gold-700 dark:text-gold-400">جارٍ التحميل…</span>
        </div>
      )}
    </div>
  );
}
