import Link from "next/link";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Text } from "@/components/ui/text";
import { site, siteNav } from "@/lib/constants/navigation";

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/premodus/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "X",
    href: "https://x.com/premoduslabs",
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  },
 
];

function SectionLink({ label }: { label: string }) {
  const item = siteNav.find((i) => i.label === label);
  const className =
    "font-medium text-ink-strong underline decoration-accent-pink decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-ink-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong";
  if (!item) return <span className={className}>{label}</span>;
  return (
    <Link href={item.href} className={className}>
      {label}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink-strong/10 px-page pt-footer pb-footer">
      <div className="mx-auto flex max-w-6xl flex-col gap-major lg:flex-row lg:items-stretch lg:justify-between">
        {/* Left: newsletter, copyright, socials */}
        <div className="flex w-full max-w-md flex-col gap-8 lg:justify-between">
          <div className="border-l-4 border-ink-strong/20 bg-canvas p-7 [clip-path:polygon(0_0,100%_0,100%_calc(100%-20px),calc(100%-20px)_100%,0_100%)]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Text as="h2" variant="h4">
                  Subscribe to our mailing list
                </Text>
                <ScrollReveal as="p" className="text-sm text-ink-medium">
                  Get insights and updates straight to your inbox.
                </ScrollReveal>
              </div>

              <NewsletterForm />
            </div>
          </div>

          <div className="flex flex-col gap-4 pl-1">
            <Text variant="tiny" className="!text-ink-strong">
              © {site.name} {new Date().getFullYear()}
            </Text>
            <ul className="flex items-center gap-3">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-strong text-accent-pink transition-all duration-200 hover:-translate-y-1 hover:bg-accent-pink hover:text-ink-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
                      <path d={social.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: story paragraph with the site sections woven in */}
        <div className="flex w-full max-w-lg flex-col gap-6 lg:justify-between lg:pt-7">
          <nav aria-label="Footer">
            <ScrollReveal as="p" className="text-small leading-7 text-ink-medium">
              Every realm that has weathered a long winter was built in the
              summer before it. Premodus takes its name from the old Latin:{" "}
              <em>pre</em>, meaning before, and <em>modus</em>, the way, the
              method, the manner of doing things. The way, found before the
              storm. Our <SectionLink label="Services" /> are the walls we raise
              while the sky is still clear, and{" "}
              <SectionLink label="About" /> is the oath we swear to those who
              will stand behind them. Our <SectionLink label="Work" /> is what
              remains standing when the cold finally arrives. Should you need
              to call your banners,{" "}
              <SectionLink label="Contact" /> is where the horn is sounded.
            </ScrollReveal>
          </nav>
          <a
            href={`mailto:${site.email}`}
            className="text-small font-medium text-ink-strong underline decoration-accent-pink decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-ink-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
          >
            {site.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
