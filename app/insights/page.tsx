import type { Metadata } from "next";
import { InsightsPage } from "@/features/insights/insights-page";

export const metadata: Metadata = {
  title: "Insights",
  description: "Notes from Premodus Labs on technology, systems, and local context.",
};

export default async function Page({ searchParams }: PageProps<"/insights">) {
  const tag = (await searchParams).tag;
  return <InsightsPage selectedTag={typeof tag === "string" ? tag : undefined} />;
}
