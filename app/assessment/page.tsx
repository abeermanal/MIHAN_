import type { Metadata } from "next";
import AssessmentClient from "./AssessmentClient";

export const metadata: Metadata = {
  title: "تقييم المهارات",
  description:
    "تقييم تفاعلي لتحديد مستواك في أهم مهارات سوق العمل واكتشاف نقاط قوتك.",
};

export default function AssessmentPage() {
  return <AssessmentClient />;
}
