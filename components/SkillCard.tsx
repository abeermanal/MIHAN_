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
      ? "border-success-300 bg-success-50/30"
      : status === "missing"
        ? "border-warning-300 bg-warning-50/30"
        : "border border-[var(--border)] bg-[var(--surface)]";

  return (
    <div className={`rounded-2xl p-4 shadow-card ${border}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold" style={{ color: "var(--text)" }}>{name}</h3>
          {nameEn && <p className="text-xs" style={{ color: "var(--muted)" }}>{nameEn}</p>}
        </div>
        {status === "met" && (
          <span className="rounded-full bg-success-100 px-2 py-0.5 text-xs font-bold text-success-700">
            ✓ متوفرة
          </span>
        )}
        {status === "missing" && (
          <span className="rounded-full bg-warning-100 px-2 py-0.5 text-xs font-bold text-warning-700">
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
                filled ? "bg-gold-500" : ""
              }`}
              style={filled ? undefined : { backgroundColor: "var(--border)" }}
            />
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs" style={{ color: "var(--muted)" }}>
        <span>{level != null ? levelLabels[level] ?? `مستوى ${level}` : "غير مُقيّمة"}</span>
        {requiredLevel != null && (
          <span>المطلوب: مستوى {requiredLevel}</span>
        )}
      </div>
    </div>
  );
}
