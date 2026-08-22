import type { Metadata } from "next";
import OpportunityForm from "../../OpportunityForm";

export const metadata: Metadata = {
  title: "تعديل الفرصة",
  description: "تعديل تفاصيل الفرصة المنشورة من قبل منظمتك.",
};

interface Props {
  params: { id: string };
}

export default function EditOrgOpportunityPage({ params }: Props) {
  return <OpportunityForm opportunityId={params.id} />;
}
