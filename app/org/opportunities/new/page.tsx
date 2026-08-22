import type { Metadata } from "next";
import OpportunityForm from "../OpportunityForm";

export const metadata: Metadata = {
  title: "إضافة فرصة جديدة",
  description: "انشري فرصة وظيفية أو تدريبية جديدة باسم منظمتك.",
};

export default function NewOrgOpportunityPage() {
  return <OpportunityForm />;
}
