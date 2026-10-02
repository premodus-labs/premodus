import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { spaceGrotesk } from "@/lib/design/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Premodus Labs",
    template: "%s — Premodus Labs",
  },
  description:
    "We build technology at a world-class standard to solve the problems Malawi’s tech industry has overlooked.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceGrotesk.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink-strong font-sans">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
