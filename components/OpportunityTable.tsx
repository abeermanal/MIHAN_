import Link from "next/link";
import OrgLogo from "./OrgLogo";
import type { OpportunityWithMatch } from "@/lib/types";

function scoreColor(score: number) {
  if (score >= 70) return "bg-success-100 text-success-700";
  if (score >= 40) return "bg-gold-100 text-gold-700";
  return "bg-rose-100 text-rose-700";
}

export default function OpportunityTable({ rows }: { rows: OpportunityWithMatch[] }) {
  if (rows.length === 0) {
    return (
      <p className="card text-center" style={{ color: "var(--text-secondary)" }}>
        لا توجد فرص بعد — أضيفي البيانات الأولية عبر{" "}
        <code className="rounded px-1" style={{ backgroundColor: "var(--border)" }}>POST /api/seed</code>.
      </p>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-card md:block">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-[var(--border)] text-sm" style={{ backgroundColor: "var(--surface-overlay)", color: "var(--text-secondary)" }}>
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
                <tr key={o.id} className="border-b border-[var(--border)] transition" style={{ backgroundColor: "var(--surface)" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--accent-subtle)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--surface)"; }}>
                  <td className="px-4 py-3 font-bold" style={{ color: "var(--text)" }}>{o.title_ar}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      {o.organization && (
                        <OrgLogo name={orgName} logoUrl={o.organization.logo_url} />
                      )}
                      <span style={{ color: "var(--text-secondary)" }}>{orgName}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{o.location ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ backgroundColor: "var(--border)", color: "var(--text-secondary)" }}>
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
                      className="font-bold underline-offset-4 hover:underline"
                      style={{ color: "var(--accent)" }}
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

      <div className="space-y-3 md:hidden">
        {rows.map((o) => {
          const orgName = o.organization?.name ?? o.company ?? "—";
          return (
            <Link
              key={o.id}
              href={`/opportunities/${o.id}`}
              className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-card transition-all duration-200 hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold" style={{ color: "var(--text)" }}>{o.title_ar}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {o.organization && <OrgLogo name={orgName} logoUrl={o.organization.logo_url} />}
                    <span className="truncate">{orgName}</span>
                  </p>
                </div>
                <span
                  className={`inline-block w-14 shrink-0 rounded-full px-2 py-1 text-center text-sm font-extrabold ${scoreColor(o.match.score)}`}
                >
                  {o.match.score}%
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
                <span>{o.location ?? "—"}</span>
                <span>·</span>
                <span className="rounded-full px-2.5 py-0.5 font-bold" style={{ backgroundColor: "var(--border)", color: "var(--text-secondary)" }}>
                  {o.employment_type ?? "—"}
                </span>
              </div>
              <span
                className="mt-4 inline-block text-sm font-bold underline-offset-4 hover:underline"
                style={{ color: "var(--accent)" }}
              >
                التفاصيل ←
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}