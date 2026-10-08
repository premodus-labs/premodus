import { ButtonLink } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionTransition } from "@/components/ui/section-transition";
import { Text } from "@/components/ui/text";
import { projects } from "@/lib/constants/projects";
import { HomeHero } from "@/features/home/home-hero";
import { ProjectGrid } from "@/features/work/project-grid";
import { ServicesScroller } from "@/features/home/services-scroller";

const services = [
  {
    label: "Software Development",
    title: "Built to hold up under real use, not just under a demo.",
    description:
      "We write the version that still works when the traffic spikes, the data’s messy, and someone’s using it on a bad connection  not the version that only works in the sales deck.",
    model: "computer",
    fallbackImage: "/images/services/softwaredevelopment.jpg",
  },
  {
    label: "Digital Transformation",
    title: "Change that fits how people actually work, not disruption for its own sake.",
    description:
      "We don’t turn digital transformation projects into a problem no one had. We start with how the institution actually runs today, and build toward something better.",
    model: "wall",
    fallbackImage: "/images/services/digitaltransformation.jpg",
  },
  {
    label: "IT Consulting",
    title: "Advice from people who’ve had to live with the consequences of bad advice.",
    description:
      "We ask what you’re solving before we recommend the next one — because a recommendation that ignores the local context sets up the next problem.",
    model: "paper",
    fallbackImage: "/images/services/itconsulting.jpg",
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

export function HomePage() {
  return (
    <>
      <HomeHero />

      <SectionTransition animateOnView={false} className="pxpage ptsection pbmajor">
        <div className="mxauto maxw5xl">
          <ScrollReveal>
            <div className="wfull">
              <Text as="h2" variant="h2" className="maxwxl">
                Worldclass starts with how we treat each piece of the work.
              </Text>
            </div>
          </ScrollReveal>
          <ServicesScroller services={services} />
        </div>
      </SectionTransition>

      <SectionTransition className="homesectionbeat pxpage pymajor mbsection">
        <div className="mxauto grid wfull maxw5xl gridcols1 gap8 bordert bordersurface pt8 lg:gridcols12 lg:gapgutter">
          <ScrollReveal className="lg:colspan5">
            <Text variant="small-bold">What this means for you</Text>
            <Text variant="h3" className="mt4">
              Early conversations, not sales pitches.
            </Text>
          </ScrollReveal>
          <ScrollReveal className="lg:colspan5 lg:colstart7" delay={0.12}>
            <Text variant="small">
              We’d rather understand the actual problem than lead with a
              proposal. Every engagement starts with the same question: what
              does this look like if it’s built properly, for what you’re
              actually dealing with?
            </Text>
          </ScrollReveal>
        </div>
      </SectionTransition>

      <SectionTransition className="homesectionbeat pxpage pymajor mbsection">
        <ScrollReveal>
          <Text as="h2" variant="h2">
            A small team that moves like one.
          </Text>
        </ScrollReveal>
        <div className="mtmajor grid gridcols1 gapmajor md:gridcols3">
          {[
            {
              title: "Small, fast, high agency",
              description:
                "The people closest to the problem make the decisions, with the responsibility to see the work through.",
            },
            {
              title: "Question the default",
              description:
                "We ask why before we copy what works elsewhere, because Malawi’s networks, budgets and users rarely match the template.",
            },
            {
              title: "Impact before optics",
              description:
                "We judge the work by whether it holds up and helps people, not by how it looks in a pitch deck or a press release.",
            },
          ].map(({ title, description }, index) => (
            <ScrollReveal key={title} delay={index * 0.12}>
              <Text variant="small-bold">{title}</Text>
              <Text variant="small" className="mt4">
                {description}
              </Text>
            </ScrollReveal>
          ))}
        </div>
      </SectionTransition>

      <SectionTransition className="homesectionbeat pxpage pymajor mbsection">
        <ScrollReveal>
          <Text as="h2" variant="h2">
            Work we’ve done
          </Text>
        </ScrollReveal>
        <ProjectGrid projects={projects.slice(0, 3)} />
      </SectionTransition>

      <SectionTransition className="sectionpanel pxpage pysection textcenter">
        <div className="mxauto flex maxwxl flexcol itemscenter gap6">
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
            <div className="flex flexwrap justifycenter gap4">
              <ButtonLink href="/contact">Get in touch</ButtonLink>
            </div>
          </ScrollReveal>
        </div>
      </SectionTransition>
    </>
  );
}
