import { headers } from "next/headers";

export type RegionName = "Malawi" | "Africa";

export async function getRegionName(): Promise<RegionName> {
  const h = await headers();
  const country =
    h.get("x-vercel-ip-country") ?? // Vercel
    h.get("cf-ipcountry") ??        // Cloudflare
    process.env.DEV_COUNTRY ??      // local testing
    "";

  return country.toUpperCase() === "MW" ? "Malawi" : "Africa";
}