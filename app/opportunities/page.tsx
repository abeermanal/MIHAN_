import type { Metadata } from "next";
import OpportunitiesClient from "./OpportunitiesClient";

export const metadata: Metadata = {
  title: "الفرص الوظيفية",
  description:
    "تصفحي الفرص الوظيفية والتدريبية مرتبة حسب نسبة توافقك مع كل فرصة.",
};

export default function OpportunitiesPage() {
  return <OpportunitiesClient />;
}
