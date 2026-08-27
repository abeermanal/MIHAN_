import type { Metadata } from "next";
import AssessmentClient from "./AssessmentClient";
import { requireSeekerForPage } from "@/lib/orgGuard";

export const metadata: Metadata = {
  title: "تقييم المهارات",
  description:
    "تقييم تفاعلي لتحديد مستواك في أهم مهارات سوق العمل واكتشاف نقاط قوتك.",
};

export default async function AssessmentPage() {
  await requireSeekerForPage();
  return <AssessmentClient />;
}
