import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Text } from "@/components/ui/text";
import { getBoilerImage } from "@/lib/constants/boiler-images";
import { DURATION } from "@/lib/design/motion";
import type { Project } from "@/lib/constants/projects";

const REVEAL_DURATION = DURATION.slow / 2;

function projectLink(project: Project) {
  return {
    href: project.url ?? "/work",
    target: project.url ? "_blank" : undefined,
    rel: project.url ? "noopener noreferrer" : undefined,
  };
}

function projectImage(project: Project, index: number) {
  return project.image
    ? { src: project.image, alt: `${project.name} website` }
    : getBoilerImage(index);
}

export function FeaturedWork({ projects }: { projects: Project[] }) {
  const featuredProjects = projects.slice(0, 3);

  if (featuredProjects.length === 0) return null;

  return (
    <div className="bg-surface px-page py-[90px] text-inverse">
      <div className="w-full">
        <ScrollReveal delay={0.05} duration={REVEAL_DURATION}>
          <Text
            as="h2"
            variant="h2"
            className="font-semibold leading-[48px] !text-inverse capitalize"
          >
            Our work
          </Text>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-3 lg:gap-y-0">
          {featuredProjects.map((project, index) => {
            const image = projectImage(project, index);
            const link = projectLink(project);

            return (
              <ScrollReveal
                key={project.slug}
                as="article"
                delay={0.9 + index * 0.875}
                duration={REVEAL_DURATION}
                className="min-w-0"
              >
                <Link
                  href={link.href}
                  target={link.target}
                  rel={link.rel}
                  className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-inverse"
                >
                  <div className="relative aspect-[89/61.5] overflow-hidden rounded-md">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) calc((100vw - 120px) / 3), (min-width: 640px) calc((100vw - 180px) / 2), calc(100vw - 160px)"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                </Link>
                <div className="mt-5">
                  <Text as="h4" variant="h4" className="leading-8 !text-inverse">
                    {project.name}
                  </Text>
                  <Text variant="small" className="!text-inverse">
                    {project.summary}
                  </Text>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
        <ScrollReveal
          as="div"
          delay={3.525}
          duration={REVEAL_DURATION}
          className="mt-10"
        >
          <ButtonLink
            href="/work"
            className="!rounded !bg-inverse !text-surface capitalize"
          >
            See all projects
          </ButtonLink>
        </ScrollReveal>
      </div>
    </div>
  );
}
