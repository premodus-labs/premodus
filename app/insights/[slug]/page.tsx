import type { Metadata } from "next";
import { InsightPage } from "@/features/insights/insight-page";
import { getInsight, getInsights } from "@/features/insights/insight-data";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const insights = await getInsights();
  return insights.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const insight = await getInsight((await params).slug);
  return insight ? { title: insight.title, description: insight.description } : {};
}

export default async function Page({ params }: PageProps) {
  return <InsightPage slug={(await params).slug} />;
}
