import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabaseServer";
import AddSkillForm from "@/components/AddSkillForm";
import SetupNotice from "@/components/SetupNotice";

export const dynamic = "force-dynamic"; // الصفحة تعتمد على جلسة المستخدمة

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
  technical: { label: "تقنية", className: "bg-plum-100 text-plum-700" },
  soft: { label: "شخصية", className: "bg-gold-100 text-gold-700" },
  analytical: { label: "تحليل", className: "bg-sky-100 text-sky-700" },
  design: { label: "تصميم", className: "bg-pink-100 text-pink-700" },
  marketing: { label: "تسويق", className: "bg-emerald-100 text-emerald-700" },
  general: { label: "عامة", className: "bg-plum-50 text-plum-500" },
};

const levelLabels = ["", "مبتدئ", "أساسي", "جيد", "متقدم", "خبير"];

function CategoryBadge({ category }: { category: string }) {
  const meta = categoryMeta[category] ?? {
    label: category,
    className: "bg-plum-50 text-plum-500",
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
        <span key={i} className={i <= level ? "text-gold-400" : "text-plum-200"}>
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

  // نفس بيانات GET /api/skills لكن مباشرة من الخادم (نفس الشكل: skills + level)
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
          <p className="mt-2 text-plum-600">
            مهاراتك المكتسبة من الاختبارات والمشاريع والخبرات
          </p>
        </div>
        <AddSkillForm />
      </header>

      {/* بطاقة الجواز */}
      <section className="card bg-gradient-to-l from-plum-700 to-plum-600 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15 text-xl font-extrabold text-gold-300">
              M
            </span>
            <div>
              <p className="text-xs font-bold tracking-wide text-gold-300">
                جواز المهارات الرقمي — MIHAN
              </p>
              <h2 className="mt-0.5 text-lg font-extrabold">{displayName}</h2>
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-4 text-center sm:gap-6">
            <div>
              <dt className="text-xs text-plum-200">إجمالي المهارات</dt>
              <dd className="mt-0.5 text-xl font-extrabold text-gold-300">
                {passportSkills.length}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-plum-200">مهارات مقيّمة</dt>
              <dd className="mt-0.5 text-xl font-extrabold text-gold-300">{rated.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-plum-200">متوسط المستوى</dt>
              <dd className="mt-0.5 text-xl font-extrabold text-gold-300">
                {avgLevel !== null ? `${avgLevel}/5` : "—"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {rated.length === 0 ? (
        <div className="card text-center">
          <span className="text-4xl">🌱</span>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-plum-600">
            لا توجد مهارات مقيّمة بعد. أضيفي مهارة أو أكملي التقييم.
          </p>
          <Link href="/assessment" className="btn-primary mt-5 inline-flex">
            بدء تقييم المهارات
          </Link>
        </div>
      ) : (
        <section>
          <h2 className="mb-4 text-lg font-extrabold text-plum-800">
            مهاراتي المقيّمة ({rated.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rated.map((s) => (
              <article key={s.id} className="card space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-plum-800">
                      {s.name_ar || s.name_en}
                    </h3>
                    <p dir="ltr" className="text-xs text-plum-400">
                      {s.name_en}
                    </p>
                  </div>
                  <CategoryBadge category={s.category} />
                </div>
                <div className="flex items-center justify-between border-t border-plum-50 pt-3">
                  <Stars level={s.level ?? 0} />
                  <span className="text-xs font-bold text-plum-500">
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
          <h2 className="mb-4 text-sm font-bold text-plum-500">
            مهارات في الكتالوج لم تقيّميها بعد ({unrated.length})
          </h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {unrated.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-plum-50 bg-white px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-plum-600">
                    {s.name_ar || s.name_en}
                  </p>
                  <p dir="ltr" className="truncate text-xs text-plum-300">
                    {s.name_en}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-plum-50 px-2 py-0.5 text-[11px] font-bold text-plum-400">
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
