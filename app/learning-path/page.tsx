import type { Metadata } from "next";
import LearningPathClient from "./LearningPathClient";

export const metadata: Metadata = {
  title: "مسار التعلم",
  description:
    "خطة تعلم مجانية خطوة بخطوة لسد الفجوات بين مهاراتك الحالية ومتطلبات وظيفتك المثالية.",
};

export default function LearningPathPage() {
  return <LearningPathClient />;
}
