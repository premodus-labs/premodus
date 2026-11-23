import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { getBoilerImage } from "@/lib/constants/boiler-images";
import type { Project } from "@/lib/constants/projects";

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
  const [featured, ...supporting] = projects;

  if (!featured) return null;

  const featuredImage = projectImage(featured, 0);
  const featuredLink = projectLink(featured);

  return (
    <div className="bg-surface px-page py-[90px] text-inverse">
      <div className="w-full">
        <Text
          as="h2"
          variant="h2"
          className="font-semibold leading-[48px] !text-inverse capitalize"
        >
          Our work
        </Text>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-5">
          <div className="min-w-0">
            <Link
              href={featuredLink.href}
              target={featuredLink.target}
              rel={featuredLink.rel}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-inverse"
            >
              <div className="relative aspect-[91/80] overflow-hidden rounded-md">
                <Image
                  src={featuredImage.src}
                  alt={featuredImage.alt}
                  fill
                  sizes="(min-width: 1024px) calc((100vw - 180px) / 2), calc(100vw - 160px)"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
              </div>
            </Link>
            <div className="mt-5">
              <Text as="h4" variant="h4" className="leading-8 !text-inverse">
                {featured.name}
              </Text>
              <Text variant="small" className="!text-inverse ">
                {featured.summary}
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-2 lg:gap-x-5 lg:self-start">
            {supporting.slice(0, 2).map((project, index) => {
              const image = projectImage(project, index + 1);
              const link = projectLink(project);

              return (
                <article
                  key={project.slug}
                  className="min-w-0 self-start justify-self-start"
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
                        sizes="(min-width: 1024px) calc((100vw - 220px) / 4), (min-width: 640px) calc((100vw - 180px) / 2), calc(100vw - 160px)"
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
                </article>
              );
            })}

            <div className="sm:col-span-2">
              <ButtonLink
                href="/work"
                className="!rounded !bg-inverse !text-surface capitalize"
              >
                See all projects
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
