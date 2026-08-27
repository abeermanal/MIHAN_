import type { Metadata } from "next";
import ReturnPathClient from "./ReturnPathClient";
import { requireSeekerForPage } from "@/lib/orgGuard";

export const metadata: Metadata = {
  title: "طريق العودة",
  description:
    "منصة دعم النساء العائدات للعمل بعد انقطاع — وثّقي خبراتك السابقة وحوّليها إلى مهارات معترف بها وابدئي من جديد بثقة.",
};

export default async function ReturnPathPage() {
  await requireSeekerForPage();
  return <ReturnPathClient />;
}
