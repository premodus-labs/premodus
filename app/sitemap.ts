import type { MetadataRoute } from "next";

const siteUrl = "https://premodus.tech";
const publicPaths = [
  "/",
  "/about",
  "/contact",
  "/insights",
  "/services",
  "/work",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
  }));
}
