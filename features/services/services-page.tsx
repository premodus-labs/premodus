import { CallToAction } from "@/components/ui/call-to-action";
import { ButtonLink } from "@/components/ui/button";
import { SectionTransition } from "@/components/ui/section-transition";
import { Text } from "@/components/ui/text";

const services = [
  {
    title: "Software development",
    media: "/media/card-software-development.mp4",
    description:
      "We design and build software: web applications, cross-platform mobile apps, and integrations that connect existing systems. Design and engineering happen in one team, from scoping through launch.",
    deliverables: [
      "Scoping, requirements gathering, and process mapping",
      "UI/UX design: wireframes, visual design, and a click-based prototype",
      "Design system components, styles, and usage guidelines",
      "Web applications",
      "Cross-platform mobile applications",
      "Backend and API development",
      "Third-party integrations",
      "Maintenance and ongoing technical support",
    ],
  },
  {
    title: "Cybersecurity",
    media: "/media/card-cybersecurity.mp4",
    description:
      "We assess and strengthen the security of an organization’s systems, applications, and practices. We find weak spots, explain them in plain terms, and guide the client through fixing them.",
    deliverables: [
      "Security assessment: review of systems, infrastructure, and controls",
      "Vulnerability assessment and penetration testing",
      "Finding report: prioritized risks with clear remediation steps",
      "Security policy and process",
      "Incident response plan",
      "Secure architecture review",
      "Team security training",
      "Ongoing security monitoring",
    ],
  },
  {
    title: "Digital transformation",
    media: "/media/card-digital-transformation.mp4",
    description:
      "We help organizations move their operations onto digital systems. We assess how work gets done today, advise on the tools and technology, and plan the change, so the tools we recommend fit the organization and part of its service.",
    deliverables: [
      "Current-state assessment: existing processes, tools, and data points",
      "Digital strategy: prioritization, roadmap, and costed options",
      "Process mapping and redesign",
      "Technology and vendor selection",
      "System architecture and integration design",
      "Implementation planning",
      "Change management plan and staff training",
      "Post-launch support",
      "Retainer",
      "Troubleshooting",
      "API development",
      "Code review",
      "Legacy system integration",
      "Data migration",
      "Security hardening",
      "Post-implementation support",
    ],
  },
] as const;

export function ServicesPage() {
  return (
    <div className="bg-surface text-inverse">
      <SectionTransition className="px-page pt-header-t pb-header-b">
        <Text as="h1" variant="h2" className="mx-auto w-full !text-inverse">
          Three Services, All Built With the Same Constraint in Mind: This
          Has to Actually Work Here — Not in a Demo, Not in a Pitch Deck, in
          the Environment We’re Actually Operating in.
        </Text>
      </SectionTransition>

      <SectionTransition className="px-page pb-section">
        <div className="mx-auto flex w-full flex-col gap-major">
          {services.map((service) => (
            <article
              key={service.title}
              id={service.title.replaceAll(" ", "-")}
              className="rounded-lg grid min-h-[560px] grid-cols-1 overflow-hidden bg-canvas text-ink-strong md:grid-cols-2"
            >
              <video
                className="h-[800px] w-full max-w-[600px] object-cover md:w-[600px]"
                src={service.media}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label={`${service.title} animation`}
              />
              <div className="flex items-center px-8 py-major text-ink-strong md:px-major">
                <div className="max-w-md">
                  <Text as="h3" variant="h3" className="!text-ink-strong">
                    {service.title}
                  </Text>
                  <Text variant="body" className="mt-4 !text-ink-medium">
                    {service.description}
                  </Text>
                  <Text variant="h4" className="mt-6 block !text-ink-strong">
                    Deliverables
                  </Text>
                  <ul className="mt-3 flex list-disc flex-col gap-1 pl-4">
                    {service.deliverables.map((deliverable) => (
                      <li key={deliverable}>
                        <Text variant="body" className="!text-ink-medium">{deliverable}</Text>
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href="/contact" className="mt-6">
                    Get in touch
                  </ButtonLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionTransition>

      <CallToAction
        variant="inverse"
        title="Start with a conversation, not a commitment."
        description="Tell us what you’re dealing with."
      />
    </div>
  );
}
