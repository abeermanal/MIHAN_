import type { Metadata } from "next";
import OpportunityForm from "../OpportunityForm";
import { requireOrgForPage } from "@/lib/orgGuard";

export const metadata: Metadata = {
  title: "إضافة فرصة جديدة",
  description: "انشري فرصة وظيفية أو تدريبية جديدة باسم منظمتك.",
};

export default async function NewOrgOpportunityPage() {
  await requireOrgForPage();
  return <OpportunityForm />;
}
