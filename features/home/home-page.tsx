import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionTransition } from "@/components/ui/section-transition";
import { Text } from "@/components/ui/text";
import { getBoilerImage } from "@/lib/constants/boiler-images";
import { HomeHero } from "@/features/home/home-hero";
import { ServicesScroller } from "@/features/home/services-scroller";

const services = [
  {
    label: "Software Development",
    title: "Built to hold up under real use, not just under a demo.",
    description:
      "We write the version that still works when the traffic spikes, the data’s messy, and someone’s using it on a bad connection — not the version that only works in the sales deck.",
    model: "computer",
    fallbackImage: "/images/services/software-development.jpg",
  },
  {
    label: "Digital Transformation",
    title: "Change that fits how people actually work, not disruption for its own sake.",
    description:
      "We don’t turn digital transformation projects into a problem no one had. We start with how the institution actually runs today, and build toward something better.",
    model: "wall",
    fallbackImage: "/images/services/digital-transformation.jpg",
  },
  {
    label: "IT Consulting",
    title: "Advice from people who’ve had to live with the consequences of bad advice.",
    description:
      "We ask what you’re solving before we recommend the next one — because a recommendation that ignores the local context sets up the next problem.",
    model: "paper",
    fallbackImage: "/images/services/it-consulting.jpg",
  },
  {
    label: "Cybersecurity",
    title: "Threat models built for the environment we’re actually in, not a checklist copied from somewhere else.",
    description:
      "Malawi has particular threats, particular network patterns, and risks here don’t look like the risks in a generic framework.",
    model: "shield",
    fallbackImage: "/images/services/cybersecurity.jpg",
  },
] as const;

const projects = ["OpenData Malawi", "E-Pay", "Z.AI"] as const;

export function HomePage() {
  return (
    <>
      <HomeHero />

      <SectionTransition animateOnView={false} className="px-page pt-section pb-major">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
              <Text as="h2" variant="h2" className="max-w-xl">
                World-class starts with how we treat each piece of the work.
              </Text>
              <Text variant="tiny" className="hidden shrink-0 lg:block">
                How we work
              </Text>
            </div>
          </ScrollReveal>
          <ServicesScroller services={services} />
        </div>
      </SectionTransition>

      <SectionTransition className="home-section-beat px-page py-major mb-section">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 border-t border-surface pt-8 lg:grid-cols-12 lg:gap-gutter">
          <ScrollReveal className="lg:col-span-5">
            <Text variant="small-bold">What this means for you</Text>
            <Text variant="h3" className="mt-4">
              Early conversations, not sales pitches.
            </Text>
          </ScrollReveal>
          <ScrollReveal className="lg:col-span-5 lg:col-start-7" delay={0.12}>
            <Text variant="small">
              We’d rather understand the actual problem than lead with a
              proposal. Every engagement starts with the same question: what
              does this look like if it’s built properly, for what you’re
              actually dealing with?
            </Text>
          </ScrollReveal>
        </div>
      </SectionTransition>

      <SectionTransition className="home-section-beat px-page py-major mb-section">
        <ScrollReveal>
          <Text as="h2" variant="h2">
            A small team that moves like one.
          </Text>
        </ScrollReveal>
        <div className="mt-major grid grid-cols-1 gap-major md:grid-cols-3">
          {["Small, fast, high-agency", "Question the default", "Impact before optics"].map(
            (title, index) => (
              <ScrollReveal key={title} delay={index * 0.12}>
                <Text variant="small-bold">{title}</Text>
                <Text variant="small" className="mt-4">
                  The people closest to the problem make the decisions, with the
                  responsibility to see the work through.
                </Text>
              </ScrollReveal>
            ),
          )}
        </div>
      </SectionTransition>

      <SectionTransition className="home-section-beat px-page py-major mb-section">
        <ScrollReveal>
          <Text as="h2" variant="h2">
            What we’re building
          </Text>
        </ScrollReveal>
        <div className="mt-major grid grid-cols-1 gap-gutter md:grid-cols-3">
          {projects.map((project, index) => {
            const image = getBoilerImage(index);

            return (
              <ScrollReveal key={project} delay={index * 0.12}>
                <article>
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <Text as="h3" variant="h4" className="mt-4">
                    {project}
                  </Text>
                  <Text variant="small" className="mt-2">
                    Designed around a problem worth solving.
                  </Text>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </SectionTransition>

      <SectionTransition className="section-panel px-page py-section text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
          <ScrollReveal>
            <Text as="h2" variant="h2">
              Need something built?
            </Text>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
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
