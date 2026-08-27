import type { Metadata } from "next";
import OpportunityForm from "../../OpportunityForm";
import { requireOrgForPage } from "@/lib/orgGuard";

export const metadata: Metadata = {
  title: "تعديل الفرصة",
  description: "تعديل تفاصيل الفرصة المنشورة من قبل منظمتك.",
};

interface Props {
  params: { id: string };
}

export default async function EditOrgOpportunityPage({ params }: Props) {
  await requireOrgForPage();
  return <OpportunityForm opportunityId={params.id} />;
}
