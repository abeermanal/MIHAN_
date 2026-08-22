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

/** خبرات شائعة لدى العائدات → المهارات المرتبطة بها */
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

      // خبرة مخصصة نصية → تُحفظ كمهارة تواصل + إدارة مشاريع بمستوى أساسي
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
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-l from-gold-400 via-gold-300 to-plum-300 px-6 py-12 text-center shadow-card md:px-16">
        <h1 className="text-3xl font-extrabold text-plum-950 md:text-4xl">
          مرحباً بعودتك 🌸
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-plum-900">
          الانقطاع عن العمل ليس نهاية المسار — كل تجربة عشتِها اكتسبتِ منها
          مهارات. وثّقي خبراتك هنا، وسنحوّلها إلى ملف مهني يفتح لك الأبواب من
          جديد.
        </p>
      </section>

      {error && <SetupNotice error={error} />}

      {!error && (
        <>
          <section>
            <h2 className="section-title mb-2">ماذا فعلتِ خلال فترتك السابقة؟</h2>
            <p className="mb-4 text-plum-600">
              اختاري ما ينطبق عليك — سنضيف المهارات المرتبطة تلقائياً إلى ملفك.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {EXPERIENCE_PRESETS.map((p) => {
                const active = selectedPresets.includes(p.label);
                return (
                  <button
                    key={p.label}
                    onClick={() => togglePreset(p.label)}
                    className={`rounded-2xl border-2 p-4 text-right font-bold transition ${
                      active
                        ? "border-plum-500 bg-plum-100 text-plum-800"
                        : "border-plum-100 bg-white text-plum-600 hover:border-plum-300"
                    }`}
                    aria-pressed={active}
                  >
                    {active && <span className="ml-1 text-plum-600">✓</span>} {p.label}
                  </button>
                );
              })}
            </div>

            <div className="card mt-5">
              <label htmlFor="exp" className="mb-1 block font-bold text-plum-700">
                أو اكتبي خبرتك بحرية
              </label>
              <textarea
                id="exp"
                className="input min-h-[90px]"
                placeholder="مثال: أدرتُ مشروعاً منزلياً لبيع الحلويات لمدة سنتين…"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button className="btn-primary" onClick={save} disabled={saving}>
                {saving ? "جارٍ الحفظ…" : "إضافة الخبرات إلى مهاراتي"}
              </button>
              <Link href="/opportunities" className="btn-gold">
                تصفحي الفرص
              </Link>
            </div>
            {message && (
              <p className="mt-4 rounded-xl bg-emerald-50 p-4 font-bold text-emerald-700">
                {message}
              </p>
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

      {loading && !error && <p className="text-center text-plum-500">جارٍ التحميل…</p>}
    </div>
  );
}
