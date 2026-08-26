import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabaseServer";
import AddSkillForm from "@/components/AddSkillForm";
import SetupNotice from "@/components/SetupNotice";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "جواز المهارات",
  description:
    "جواز مهاراتك الرقمي — كل مهاراتك المقيّمة من التقييمات والمشاريع والخبرات في مكان واحد.",
};

interface PassportSkill {
  id: string;
  name_ar: string;
  name_en: string;
  category: string;
  level: number | null;
}

const categoryMeta: Record<string, { label: string; className: string }> = {
  technical: { label: "تقنية", className: "bg-royal-100 text-royal-700" },
  soft: { label: "شخصية", className: "bg-coral-100 text-coral-700" },
  analytical: { label: "تحليل", className: "bg-lavender-100 text-lavender-700" },
  design: { label: "تصميم", className: "bg-coral-50 text-coral-600" },
  marketing: { label: "تسويق", className: "bg-success-50 text-success-700" },
  general: { label: "عامة", className: "bg-cream-100 text-royal-500" },
};

const levelLabels = ["", "مبتدئ", "أساسي", "جيد", "متقدم", "خبير"];

function CategoryBadge({ category }: { category: string }) {
  const meta = categoryMeta[category] ?? {
    label: category,
    className: "bg-cream-100 text-royal-500",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${meta.className}`}>
      {meta.label}
    </span>
  );
}

function Stars({ level }: { level: number }) {
  return (
    <span dir="ltr" className="text-base tracking-wide">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= level ? "text-coral-400" : "text-lavender-200"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default async function SkillPassportPage() {
  const auth = await requireUser();
  if (!auth.ok) {
    if (auth.response.status === 401) redirect("/login");
    return <SetupNotice />;
  }
  const { supabase, userId, user } = auth;

  const [{ data: catalog, error: catalogError }, { data: userSkills, error: userError }] =
    await Promise.all([
      supabase.from("skills").select("*").order("name_en"),
      supabase.from("user_skills").select("*").eq("user_id", userId),
    ]);

  if (catalogError || userError) {
    return <SetupNotice error="تعذر جلب المهارات حالياً، حاولي تحديث الصفحة." />;
  }

  const levelBySkill = new Map(
    (userSkills ?? []).map((us: { skill_id: string; level: number }) => [
      us.skill_id,
      us.level,
    ])
  );

  const passportSkills: PassportSkill[] = (catalog ?? []).map(
    (s: { id: string; name_ar: string; name_en: string; category: string }) => ({
      id: s.id,
      name_ar: s.name_ar,
      name_en: s.name_en,
      category: s.category,
      level: levelBySkill.get(s.id) ?? null,
    })
  );

  const rated = passportSkills.filter((s) => s.level !== null && s.level > 0);
  const unrated = passportSkills.filter((s) => s.level === null || s.level === 0);

  const displayName =
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "") ||
    user.email?.split("@")[0] ||
    "مستخدمة MIHAN";

  const avgLevel =
    rated.length > 0
      ? Math.round((rated.reduce((sum, s) => sum + (s.level ?? 0), 0) / rated.length) * 10) / 10
      : null;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="section-title">جواز المهارات 🛂</h1>
          <p className="mt-2 text-royal-500">
            مهاراتك المكتسبة من الاختبارات والمشاريع والخبرات
          </p>
        </div>
        <AddSkillForm />
      </header>

      <section className="rounded-3xl bg-gradient-to-l from-royal-600 via-royal-500 to-coral-400 p-8 text-white">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-xl font-extrabold text-white backdrop-blur-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-bold tracking-wide text-white/70">
                جواز المهارات الرقمي — MIHAN
              </p>
              <h2 className="mt-1 text-lg font-extrabold">{displayName}</h2>
            </div>
          </div>
          <dl className="flex gap-4">
            <div className="rounded-2xl bg-white/10 px-5 py-3 text-center backdrop-blur-sm">
              <dt className="text-xs text-white/70">إجمالي المهارات</dt>
              <dd className="mt-0.5 text-2xl font-extrabold text-coral-100">
                {passportSkills.length}
              </dd>
            </div>
            <div className="rounded-2xl bg-white/10 px-5 py-3 text-center backdrop-blur-sm">
              <dt className="text-xs text-white/70">مهارات مقيّمة</dt>
              <dd className="mt-0.5 text-2xl font-extrabold text-coral-100">{rated.length}</dd>
            </div>
            <div className="rounded-2xl bg-white/10 px-5 py-3 text-center backdrop-blur-sm">
              <dt className="text-xs text-white/70">المتوسط</dt>
              <dd className="mt-0.5 text-2xl font-extrabold text-coral-100">
                {avgLevel !== null ? `${avgLevel}/5` : "—"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {rated.length === 0 ? (
        <div className="card p-8 text-center">
          <span className="text-4xl">🌱</span>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-royal-500">
            لا توجد مهارات مقيّمة بعد. أضيفي مهارة أو أكملي التقييم.
          </p>
          <Link href="/assessment" className="btn-primary mt-5 inline-flex">
            بدء تقييم المهارات
          </Link>
        </div>
      ) : (
        <section>
          <h2 className="mb-4 text-lg font-extrabold text-navy-900">
            مهاراتي المقيّمة ({rated.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rated.map((s) => (
              <article key={s.id} className="card space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-navy-900">
                      {s.name_ar || s.name_en}
                    </h3>
                    <p dir="ltr" className="text-xs text-royal-400">
                      {s.name_en}
                    </p>
                  </div>
                  <CategoryBadge category={s.category} />
                </div>
                <div className="flex items-center justify-between border-t border-lavender-100/60 pt-3">
                  <Stars level={s.level ?? 0} />
                  <span className="text-xs font-bold text-royal-500">
                    {levelLabels[s.level ?? 0]} ({s.level}/5)
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {unrated.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-navy-700">
            مهارات في الكتالوج لم تقيّميها بعد
            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-lavender-100 px-1.5 text-[11px] font-extrabold text-royal-600">
              {unrated.length}
            </span>
          </h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {unrated.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-2 rounded-2xl border border-lavender-100/60 bg-white px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-navy-700">
                    {s.name_ar || s.name_en}
                  </p>
                  <p dir="ltr" className="truncate text-xs text-royal-400">
                    {s.name_en}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-lavender-50 px-2 py-0.5 text-[11px] font-bold text-royal-400">
                  غير مقيّمة
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
