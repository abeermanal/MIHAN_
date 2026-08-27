import type { Metadata } from "next";
import LearningPathClient from "./LearningPathClient";
import { requireSeekerForPage } from "@/lib/orgGuard";

export const metadata: Metadata = {
  title: "مسار التعلم",
  description:
    "خطة تعلم مجانية خطوة بخطوة لسد الفجوات بين مهاراتك الحالية ومتطلبات وظيفتك المثالية.",
};

export default async function LearningPathPage() {
  await requireSeekerForPage();
  return <LearningPathClient />;
}
