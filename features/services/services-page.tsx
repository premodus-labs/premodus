import { CallToAction } from "@/components/ui/call-to-action";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionTransition } from "@/components/ui/section-transition";
import { Text } from "@/components/ui/text";

const services = [
  {
    title: "Software development",
    capabilities: [
      "Custom web and mobile applications, built and maintained end-to-end.",
      "Digital product design — how something looks, feels, and works before a line of code justifies it.",
      "Legacy system modernization — rebuilding or extending software that’s aged past what it can support.",
      "API development for organizations that need their data or services accessible to other tools.",
    ],
    fit: "You have a process still running on spreadsheets, WhatsApp, or paper — and need something built to last.",
  },
  {
    title: "Digital transformation",
    capabilities: [
      "Systems integration — connecting institutional tools and data sources that currently don’t talk to each other.",
      "Process digitization — turning manual, paper-based, or fragmented workflows into ones that people actually use.",
      "Post-launch support through adoption, not just handoff at go-live.",
    ],
    fit: "You already have tools, teams, and processes — they just don’t work together yet.",
  },
  {
    title: "IT consulting",
    capabilities: [
      "Technology strategy and roadmapping — auditing what an institution has and what’s breaking down.",
      "Vendor and procurement advisory — an independent read before you commit to a proposal.",
      "Technical due diligence — assessing systems before budget gets committed to them.",
    ],
    fit: "You’re about to make a technology decision and want someone who will help you get it right the first time.",
  },
  {
    title: "Cybersecurity",
    capabilities: [
      "Security audits — assessing existing systems against real threat models, not generic checklists.",
      "Penetration testing — probing systems the way an actual attacker would.",
      "Secure implementation — building security into new systems from the start.",
    ],
    fit: "You’re handling sensitive data and need security built in from the start rather than bolted on after.",
  },
] as const;

export function ServicesPage() {
  return (
    <>
      <SectionTransition className="px-page pt-16 pb-section">
        <div className="mx-auto max-w-7xl">
        <div className="max-w-md">
          <ScrollReveal>
            <Text as="h1" variant="h1">Services</Text>
          </ScrollReveal>
          <ScrollReveal delay={0.18}>
            <Text variant="body" className="mt-4">
            Four services, all built with the same constraint in mind: this has to
            actually work here — not in a demo, not in a pitch deck, in the
            environment we’re actually operating in.
            </Text>
          </ScrollReveal>
        </div>
        <nav aria-label="Service areas" className="mt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {services.map((service, index) => (
              <li key={service.title}>
                <ScrollReveal delay={0.34 + index * 0.1}>
                  <a
                    href={`#${service.title.replaceAll(" ", "-")}`}
                    className="text-tiny text-ink-medium underline underline-offset-4 transition-colors duration-200 hover:text-ink-strong"
                  >
                    {service.title}
                  </a>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-major border-t border-surface">
          {services.map((service, index) => (
            <article
              key={service.title}
              id={service.title.replaceAll(" ", "-")}
              className="grid grid-cols-1 gap-8 border-b border-surface py-8 md:grid-cols-12 md:gap-gutter"
            >
              <ScrollReveal
                className="md:col-span-5"
                delay={index * 0.06}
              >
                <Text as="h2" variant="h4">
                  {service.title}
                </Text>
              </ScrollReveal>
              <div className="md:col-span-6 md:col-start-7">
                <ScrollReveal delay={index * 0.06 + 0.08}>
                <Text variant="tiny" className="block">Capabilities</Text>
                </ScrollReveal>
                <ul className="mt-3 flex list-none flex-col gap-3 p-0">
                  {service.capabilities.map((capability, capabilityIndex) => (
                    <li key={capability}>
                      <ScrollReveal delay={capabilityIndex * 0.08}>
                        <Text variant="small">{capability}</Text>
                      </ScrollReveal>
                    </li>
                  ))}
                </ul>
                <ScrollReveal delay={0.16}>
                  <div className="mt-6 border-l border-surface pl-4">
                    <Text variant="tiny" className="block">When you’d reach for this</Text>
                    <Text variant="small" className="mt-2">{service.fit}</Text>
                  </div>
                </ScrollReveal>
              </div>
            </article>
          ))}
        </div>
        </div>
      </SectionTransition>
      <SectionTransition className="section-panel px-page py-section">
        <div className="mx-auto w-full max-w-7xl">
          <ScrollReveal>
            <Text variant="small-bold">How engagements start</Text>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <Text as="h2" variant="h2" className="mt-4 max-w-2xl">
              No proposal templates, no sales layer between you and the people who’d actually do the work.
            </Text>
          </ScrollReveal>
          <div className="mt-major grid grid-cols-1 gap-major md:grid-cols-3">
          {[
            ["A conversation", "You describe the problem. We ask questions until we actually understand it — including, sometimes, whether it’s the right problem to solve first."],
            ["An honest scope", "What it would take, realistically — timeline, cost, what’s in and out. If we think you don’t need what you’re asking for, we’ll say so before you pay for it."],
            ["Direct access, start to finish", "No account manager relaying messages to the people doing the work. You talk to us."],
          ].map(([step, description], index) => (
            <ScrollReveal key={step} delay={index * 0.1}>
              <Text variant="tiny">0{index + 1}</Text>
              <Text as="h3" variant="body-bold" className="mt-4">{step}</Text>
              <Text variant="small" className="mt-3">{description}</Text>
            </ScrollReveal>
          ))}
          </div>
        </div>
      </SectionTransition>
      <CallToAction title="Start with a conversation, not a commitment." description="Tell us what you’re dealing with." />
    </>
  );
}
