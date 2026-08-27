import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";
import { requireOrgForPage } from "@/lib/orgGuard";

export const metadata: Metadata = {
  title: "لوحة المنظمة",
  description: "إدارة الفرص الوظيفية والتدريبية المنشورة من قبل منظمتك.",
};

export default async function OrgDashboardPage() {
  await requireOrgForPage();
  return <DashboardClient />;
}
