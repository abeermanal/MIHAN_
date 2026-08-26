import Link from "next/link";
import OrgLogo from "./OrgLogo";
import type { OpportunityWithMatch } from "@/lib/types";

function scoreColor(score: number) {
  if (score >= 70) return "bg-emerald-100 text-emerald-700";
  if (score >= 40) return "bg-coral-100 text-coral-700";
  return "bg-rose-100 text-rose-700";
}

export default function OpportunityTable({ rows }: { rows: OpportunityWithMatch[] }) {
  if (rows.length === 0) {
    return (
      <p className="card text-center text-royal-500">
        لا توجد فرص بعد — أضيفي البيانات الأولية عبر{" "}
        <code className="rounded bg-royal-100 px-1">POST /api/seed</code>.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-royal-100 bg-white shadow-card">
      <table className="w-full min-w-[720px] text-right">
        <thead>
          <tr className="border-b border-royal-100 bg-royal-50 text-sm text-royal-700">
            <th className="px-4 py-3 font-bold">الفرصة</th>
            <th className="px-4 py-3 font-bold">الشركة</th>
            <th className="px-4 py-3 font-bold">الموقع</th>
            <th className="px-4 py-3 font-bold">النوع</th>
            <th className="px-4 py-3 font-bold">نسبة التوافق</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => {
            const orgName = o.organization?.name ?? o.company ?? "—";
            return (
              <tr key={o.id} className="border-b border-royal-50 transition hover:bg-royal-50/60">
                <td className="px-4 py-3 font-bold text-navy-800">{o.title_ar}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    {o.organization && (
                      <OrgLogo name={orgName} logoUrl={o.organization.logo_url} />
                    )}
                    <span className="text-royal-600">{orgName}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-royal-600">{o.location ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-royal-100 px-2.5 py-0.5 text-xs font-bold text-royal-600">
                    {o.employment_type ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block w-14 rounded-full px-2 py-1 text-center text-sm font-extrabold ${scoreColor(
                      o.match.score
                    )}`}
                  >
                    {o.match.score}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/opportunities/${o.id}`}
                    className="font-bold text-royal-600 underline-offset-4 hover:text-navy-800 hover:underline"
                  >
                    التفاصيل ←
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
