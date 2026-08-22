import type { Metadata } from "next";
import OpportunityDetailClient from "./OpportunityDetailClient";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `تفاصيل الفرصة`,
    description:
      "تفاصيل الفرصة الوظيفية: المهارات المطلوبة، ما تملكينه، وما ينقصك مع مصادر تعلم مجانية.",
  };
}

export default function OpportunityDetailPage({ params }: Props) {
  return <OpportunityDetailClient id={params.id} />;
}
