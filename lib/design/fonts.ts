import { Host_Grotesk, Space_Mono } from "next/font/google";

export const hostGrotesk = Host_Grotesk({
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-host-grotesk",
});

export const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-space-mono",
});
