interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "plum" | "gold" | "green" | "red";
}

const colors = {
  plum: "bg-royal-500",
  gold: "bg-coral-400",
  green: "bg-emerald-500",
  red: "bg-rose-500",
};

export default function ProgressBar({ value, max = 100, color = "plum" }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-royal-100" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${colors[color]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
