import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "لوحة المنظمة",
  description: "إدارة الفرص الوظيفية والتدريبية المنشورة من قبل منظمتك.",
};

export default function OrgDashboardPage() {
  return <DashboardClient />;
}
