import Link from "next/link";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { Text } from "@/components/ui/text";
import { site, siteNav } from "@/lib/constants/navigation";

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/premodus/" },
  { label: "X", href: "https://x.com/premoduslabs" },
] as const;

const footerLinkClass =
  "text-small text-inverse transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-inverse";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-surface px-page pt-footer pb-footer text-inverse">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-major border-t border-inverse/25 pt-8 md:grid-cols-12 md:gap-gutter">
          <div className="md:col-span-5">
            <Link
              href="/"
              className="text-heading-3 text-inverse focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-inverse"
            >
              {site.name}
            </Link>
            {/* DRAFT COPY: confirm this footer summary before launch. */}
            <p className="mt-4 max-w-sm text-small text-inverse/75">
              Technology built for the problems that matter here.
            </p>
            <div className="mt-8 max-w-md border-t border-inverse/25 pt-4">
              <p className="text-tiny text-inverse/60">Stay in touch</p>
              <Text as="h2" variant="h4" animate={false} className="mt-2 !text-inverse">
                Subscribe to our mailing list
              </Text>
              <p className="mt-2 text-small text-inverse/75">
                Get insights and updates straight to your inbox.
              </p>
              <div className="mt-4">
                <NewsletterForm />
              </div>
            </div>
          </div>

          <nav className="md:col-span-3 md:col-start-7" aria-label="Footer navigation">
            <p className="text-tiny text-inverse/60">Navigate</p>
            <ul className="mt-4 flex flex-col gap-3">
              {siteNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3 md:col-start-10">
            <p className="text-tiny text-inverse/60">Connect</p>
            <a
              href={`mailto:${site.email}`}
              className={`mt-4 inline-block ${footerLinkClass}`}
            >
              {site.email}
            </a>
            <ul className="mt-6 flex flex-col gap-3" aria-label="Social links">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={footerLinkClass}
                  >
                    {social.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-major border-t border-inverse/25 pt-4 text-tiny text-inverse/60">
          © {site.name} {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
