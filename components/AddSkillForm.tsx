"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const categoryOptions = [
  { value: "technical", label: "تقنية" },
  { value: "soft", label: "شخصية" },
  { value: "analytical", label: "تحليل" },
  { value: "design", label: "تصميم" },
  { value: "marketing", label: "تسويق" },
  { value: "general", label: "عامة" },
];

const levelOptions = [
  { value: 1, label: "مبتدئ" },
  { value: 2, label: "أساسي" },
  { value: 3, label: "جيد" },
  { value: 4, label: "متقدم" },
  { value: 5, label: "خبير" },
];

export default function AddSkillForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [category, setCategory] = useState("technical");
  const [level, setLevel] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!nameAr.trim() && !nameEn.trim()) {
      setError("أدخلي اسم المهارة بالعربية أو بالإنجليزية على الأقل.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              name_ar: nameAr.trim() || nameEn.trim(),
              name_en: nameEn.trim() || nameAr.trim(),
              category,
              level,
            },
          ],
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "فشل حفظ المهارة");

      setSuccess(true);
      setNameAr("");
      setNameEn("");
      setCategory("technical");
      setLevel(3);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="btn-primary w-full px-4 py-2 text-sm sm:w-auto"
      >
        {open ? "إغلاق ✕" : "+ إضافة مهارة"}
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="card mt-3 space-y-4 p-4 transition-all duration-300 sm:p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="skill-name-ar" className="mb-1 block font-bold text-navy-700">
                اسم المهارة (عربي) <span className="text-coral-500">*</span>
              </label>
              <input
                id="skill-name-ar"
                type="text"
                className="input"
                placeholder="مثال: تصميم جرافيك"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="skill-name-en" className="mb-1 block font-bold text-navy-700">
                الاسم بالإنجليزية (اختياري)
              </label>
              <input
                id="skill-name-en"
                type="text"
                dir="ltr"
                className="input"
                placeholder="Graphic Design"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="skill-category" className="mb-1 block font-bold text-navy-700">
                التصنيف
              </label>
              <select
                id="skill-category"
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categoryOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="skill-level" className="mb-1 block font-bold text-navy-700">
                المستوى
              </label>
              <select
                id="skill-level"
                className="input"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
              >
                {levelOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label} ({o.value})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="rounded-2xl bg-coral-50 p-3 text-sm font-bold text-coral-700">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-2xl bg-success-50 p-3 text-sm font-bold text-success-700">
              ✓ تمت إضافة المهارة إلى جوازك
            </p>
          )}

          <button type="submit" className="btn-accent w-full sm:w-auto" disabled={loading}>
            {loading ? "جارٍ الحفظ…" : "حفظ المهارة"}
          </button>
        </form>
      )}
    </div>
  );
}
