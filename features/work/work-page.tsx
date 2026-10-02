import Image from "next/image";
import { CallToAction } from "@/components/ui/call-to-action";
import { SectionTransition } from "@/components/ui/section-transition";
import { Text } from "@/components/ui/text";
import { getBoilerImage } from "@/lib/constants/boiler-images";

const projects = [
  {
    name: "OpenData Malawi",
    description: "Malawi’s data, made findable — and usable by the people who need it.",
    label: "Data infrastructure",
  },
  {
    name: "E-Pay",
    description: "Making payment at the point of sale simpler and more reliable.",
    label: "Digital payments",
  },
  {
    name: "Z.AI",
    description: "Agents for AI-assisted learning.",
    label: "Learning systems",
  },
  {
    name: "Field systems",
    description: "Tools designed around the conditions people actually work in.",
    label: "Operations",
  },
  {
    name: "Product discovery",
    description: "From the first useful question to a product people can use.",
    label: "Strategy",
  },
] as const;

export function WorkPage() {
  return (
    <>
      <SectionTransition className="px-page pt-16 pb-section">
        <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <Text as="h1" variant="h1">
            The work
          </Text>
          <Text variant="h3" className="mt-4">
            A running record of what we’ve built, who it’s for, and what it solved.
          </Text>
        </div>
        <div className="mt-major grid grid-cols-1 gap-x-gutter gap-y-major md:grid-cols-12">
          {projects.map((project, index) => (
            <article
              key={project.name}
              className={index < 2 ? "md:col-span-6" : "md:col-span-4"}
            >
              <div
                className={`relative flex items-end overflow-hidden border border-surface bg-surface p-6 text-inverse ${index < 2 ? "aspect-[4/3]" : "aspect-[4/5]"}`}
              >
                <Image
                  src={getBoilerImage(index).src}
                  alt={getBoilerImage(index).alt}
                  fill
                  sizes={index < 2 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                  className="object-cover"
                />
                <Text variant="tiny-bold" className="relative text-inverse">{project.label}</Text>
              </div>
              <Text as="h2" variant="h3" className="mt-4">
                {project.name}
              </Text>
              <Text variant="small" className="mt-1 max-w-md">
                {project.description}
              </Text>
            </article>
          ))}
        </div>
        </div>
      </SectionTransition>
      <CallToAction
        title="Start with a conversation, not a commitment."
        description="Let us know what you need built."
        secondaryHref="/services"
       
      />
    </>
  );
}
