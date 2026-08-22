interface SkillCardProps {
  name: string;
  nameEn?: string;
  level?: number | null;
  max?: number;
  requiredLevel?: number;
  status?: "met" | "missing" | "neutral";
}

const levelLabels = ["", "مبتدئ", "أساسي", "جيد", "متقدم", "خبير"];

export default function SkillCard({
  name,
  nameEn,
  level,
  max = 5,
  requiredLevel,
  status = "neutral",
}: SkillCardProps) {
  const border =
    status === "met"
      ? "border-emerald-200 bg-emerald-50/50"
      : status === "missing"
        ? "border-rose-200 bg-rose-50/50"
        : "border-plum-100 bg-white";

  return (
    <div className={`rounded-2xl border p-4 shadow-card ${border}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-plum-800">{name}</h3>
          {nameEn && <p className="text-xs text-plum-400">{nameEn}</p>}
        </div>
        {status === "met" && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
            ✓ متوفرة
          </span>
        )}
        {status === "missing" && (
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
            ✗ ناقصة
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {Array.from({ length: max }, (_, i) => {
          const filled = level != null && i < level;
          return (
            <span
              key={i}
              className={`h-2.5 flex-1 rounded-full ${
                filled ? "bg-plum-500" : "bg-plum-100"
              }`}
            />
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-plum-500">
        <span>{level != null ? levelLabels[level] ?? `مستوى ${level}` : "غير مُقيّمة"}</span>
        {requiredLevel != null && (
          <span>المطلوب: مستوى {requiredLevel}</span>
        )}
      </div>
    </div>
  );
}
