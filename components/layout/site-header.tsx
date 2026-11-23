"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site, siteNav } from "@/lib/constants/navigation";

function isActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({
  variant = "default",
}: {
  variant?: "default" | "inverse";
}) {
  const pathname = usePathname() as string;
  const inverse = variant === "inverse";
  const items = [
    siteNav[0],
    siteNav[1],
    siteNav[2],
    siteNav[3],
  ];

  return (
    <header
      className={`sticky top-0 z-50 h-[60px] ${
        inverse ? "bg-surface text-inverse" : "bg-canvas text-ink-strong"
      }`}
    >
      <div className="mx-auto flex h-full w-full items-center justify-between px-4 md:px-[80px]">
        <Link
          href="/"
          aria-label={site.name}
          className={`flex h-full items-center focus-visible:outline-2 focus-visible:outline-offset-[-2px] ${
            inverse ? "focus-visible:outline-inverse" : "focus-visible:outline-ink-strong"
          }`}
        >
          <Image
            src={inverse ? "/brand/premodus-logo-paper.svg" : "/brand/premodus-logo-ink.svg"}
            alt={site.name}
            width={177}
            height={16}
            className="h-4 w-[177px] shrink-0 object-contain"
          />
        </Link>
        <nav aria-label="Primary">
          <ul className="flex h-full items-center gap-4 md:gap-20">
            {items.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block whitespace-nowrap px-2 py-2 text-body-medium ${
                      inverse ? "text-inverse/75" : "text-ink-weak"
                    } focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      inverse ? "focus-visible:outline-inverse" : "focus-visible:outline-ink-strong"
                    } md:px-0`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
