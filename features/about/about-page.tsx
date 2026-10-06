import Image from "next/image";
import { CallToAction } from "@/components/ui/call-to-action";
import { SectionTransition } from "@/components/ui/section-transition";
import { Text } from "@/components/ui/text";
import { getBoilerImage } from "@/lib/constants/boiler-images";

const team = [
  ["PG", "Perani Gondwe", "Managing Director", "Leads how the work gets built."],
  ["TM", "Tanthwe Mtema", "Head of Business Operations", "Leads how the business runs."],
  ["AN", "Albert Ngonda", "Technical Director", "Leads how the work stays secure.", "/images/founders/bert.jpg"],
] as const;

export function AboutPage() {
  return (
    <>
      <SectionTransition className="px-page pt-16 pb-section">
        <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-major md:grid-cols-12">
          <Text as="h1" variant="h1" className="md:col-span-5">
            The gap was never talent. It was standards.
          </Text>
          <div className="flex flex-col gap-6 md:col-span-5 md:col-start-7">
            <Text variant="body">
              Most software built here has been built to be functional, not good —
              shipped fast, patched later, judged by whether it works today rather than
              whether it will still work in two years.
            </Text>
            <Text variant="body">
              We started Premodus to set a different assumption: that Malawian
              developers, held to an international standard and given a fair chance,
              could build things that compete anywhere.
            </Text>
            <Text variant="body-bold">
              We’re three co-founders who’d rather prove that slowly and correctly
              than claim it before we have.
            </Text>
          </div>
        </div>
        <div className="mt-section grid grid-cols-1 gap-major md:grid-cols-12">
          <div className="md:col-span-5">
            <Text variant="small-bold">Our mission</Text>
            <Text variant="h3" className="mt-4">
              We build technology at a world-class standard to solve the problems
              Malawi’s tech industry has overlooked.
            </Text>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Text variant="small-bold">Our vision</Text>
            <Text variant="h2" className="mt-4">
              A Malawi that runs on its own ideas — productive, efficient, and
              self-sustaining, powered by technology built at home.
            </Text>
          </div>
        </div>
        </div>
      </SectionTransition>
      <SectionTransition className="px-page pb-section">
        <div className="mx-auto max-w-7xl">
        <Text as="h2" variant="h2" className="max-w-3xl">
          Three people, no layers between the work and the person doing it.
        </Text>
        <div className="mt-major grid grid-cols-1 gap-gutter md:grid-cols-3">
          {team.map(([initials, name, role, description, imagePath], index) => (
            <article key={name}>
              <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                <Image
                  src={imagePath ? imagePath : getBoilerImage(index).src}
                  alt={name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
                <span className="sr-only">{initials}</span>
              </div>
              <Text as="h3" variant="h4" className="mt-4">
                {name}
              </Text>
              <Text variant="small-bold" className="mt-1">
                {role}
              </Text>
              <Text variant="small" className="mt-2">
                {description}
              </Text>
            </article>
          ))}
        </div>
        </div>
      </SectionTransition>
      <CallToAction
        title="Want to know more about what we’re building?"
        description="Get in touch, or take a look at the work."
        secondaryHref="/work"
        
      />
    </>
  );
}
