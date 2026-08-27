import type { Metadata } from "next";
import CoachClient from "./CoachClient";
import { requireSeekerForPage } from "@/lib/orgGuard";

export const metadata: Metadata = {
  title: "المدربة الذكية",
  description:
    "مدربة مهنية ذكية تحلل ملفك المهني وتقدم نصائح مخصصة: ما المجال المناسب لك، وكيف تبدئين، وكيف تجهزين للمقابلات.",
};

export default async function CoachPage() {
  await requireSeekerForPage();
  return <CoachClient />;
}
