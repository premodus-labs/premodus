import type { MetadataRoute } from "next";
import { getInsights } from "@/features/insights/insight-data";

const siteUrl = "https://premodus.tech";
const publicPaths = [
  "/",
  "/about",
  "/contact",
  "/insights",
  "/services",
  "/work",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const insights = await getInsights();
  return [
    ...publicPaths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    })),
    ...insights.map((insight) => ({
      url: new URL(`/insights/${insight.slug}`, siteUrl).toString(),
      lastModified: insight.date,
    })),
  ];
}
