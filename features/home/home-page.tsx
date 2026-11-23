import { ButtonLink } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionTransition } from "@/components/ui/section-transition";
import { Text } from "@/components/ui/text";
import { projects } from "@/lib/constants/projects";
import { HomeHero } from "@/features/home/home-hero";
import { FeaturedWork } from "@/features/home/featured-work";

const services = [
  {
    label: "Software Development",
    title: "Built to hold up under real use",
    description:
      "We write the version that still works when the traffic spikes, the data’s messy, and someone’s using it on a bad connection — not the version that only works in the sales deck.",
    video: "/media/card-software-development.mp4",
  },
  {
    label: "Cybersecurity",
    title: "Threat models built for the environment we’re actually in",
    description:
      "Malawi has particular threats, particular network patterns, and risks here don’t look like the risks in a generic framework.",
    video: "/media/card-cybersecurity.mp4",
  },
  {
    label: "Digital Transformation",
    title: "Change that fits how people actually work",
    description:
      "We don’t turn digital transformation projects into a problem no one had. We start with how the institution actually runs today, and build toward something better.",
    video: "/media/card-digital-transformation.mp4",
  },
] as const;

export function HomePage() {
  return (
    <>
      <HomeHero services={services} />

      <SectionTransition animateOnView={false} className="bg-surface">
        <FeaturedWork projects={projects.slice(0, 3)} />
      </SectionTransition>

      <SectionTransition className="px-page py-section text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
          <ScrollReveal>
            <Text as="h2" variant="h2">
              Need something built?
            </Text>
            <Text variant="body">
              We start with the problem so we can build what it needs.
            </Text>
          </ScrollReveal>
          <ScrollReveal delay={0.24}>
            <div className="flex flex-wrap justify-center gap-4">
              <ButtonLink href="/contact">Get in touch</ButtonLink>
            </div>
          </ScrollReveal>
        </div>
      </SectionTransition>
    </>
  );
}
