"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const variant = pathname === "/work" ? "inverse" : "default";

  return (
    <>
      <SiteHeader variant={variant} />
      <main className="flex-1">{children}</main>
      <SiteFooter variant={variant} />
    </>
  );
}
