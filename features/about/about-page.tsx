import Image from "next/image";
import { CallToAction } from "@/components/ui/call-to-action";
import { Text } from "@/components/ui/text";
import { getBoilerImage } from "@/lib/constants/boiler-images";
import heroStyles from "./about-hero.module.css";

const vision =
  "A Malawi that runs on its own ideas — productive, efficient, and self-sustaining, powered by technology built at home.";

// DRAFT COPY: derived from the existing About text. Confirm before launch.
const principles = [
  [
    "Built to last",
    "Judged by whether it will still work in two years, not whether it works today.",
  ],
  [
    "Secure from the start",
    "Security is led at director level and built in, not patched on afterwards.",
  ],
  [
    "Held to an international standard",
    "Malawian developers, given a fair chance, building things that compete anywhere.",
  ],
] as const;

const team = [
  ["PG", "Perani Gondwe", "Managing Director", "Leads how the work gets built."],
  ["TM", "Tanthwe Mtema", "Head of Business Operations", "Leads how the business runs."],
  ["AN", "Albert Ngonda", "Technical Director", "Leads how the work stays secure.", "/images/founders/bert.jpg"],
] as const;

export function AboutPage() {
  return (
    <>
      <section
        className="flex min-h-[65svh] flex-col items-center justify-center px-6 py-major text-center md:px-page"
        aria-labelledby="about-title"
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <Text
            as="p"
            variant="small-bold"
            className={heroStyles.label}
            animate={false}
          >
            About
          </Text>
          <Text
            as="h1"
            variant="display"
            id="about-title"
            className={`mt-6 ${heroStyles.title}`}
            animate={false}
          >
            The gap was never talent. It was standards.
          </Text>
          <Text
            variant="body"
            className={`mt-major max-w-3xl ${heroStyles.intro}`}
            animate={false}
          >
            Most software built here has been built to be functional, not good —
            shipped fast, patched later, judged by whether it works today rather than
            whether it will still work in two years.
          </Text>
        </div>
      </section>

      <section className="px-6 py-section md:px-page">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-major md:grid-cols-12">
          <div className="md:col-span-5 md:col-start-7">
            <div className="flex flex-col gap-6">
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
        </div>
      </section>

      <section className="px-6 py-section md:px-page">
        <div className="mx-auto max-w-7xl border-t border-black/15 pt-major">
          <div className="grid grid-cols-1 gap-major md:grid-cols-12">
            <Text variant="small-bold">
              Our mission
            </Text>
            <Text
              variant="h3"
              className="md:col-span-7 md:col-start-6"
            >
              We build technology at a world-class standard to solve the problems
              Malawi’s tech industry has overlooked.
            </Text>
          </div>
        </div>
      </section>

      <section className="px-6 py-section md:px-page">
        <div className="mx-auto max-w-7xl border-t border-black/15 pt-major">
          <Text variant="small-bold">
            Our vision
          </Text>
          <Text variant="h2" className="mt-4 max-w-5xl">
            {vision}
          </Text>
        </div>
      </section>

      <section className="px-6 py-section md:px-page">
        <div className="mx-auto max-w-7xl">
          <Text variant="small-bold">
            What we hold ourselves to
          </Text>
          <div className="mt-major grid grid-cols-1 gap-gutter md:grid-cols-3">
            {principles.map(([title, body]) => (
              <article key={title} className="border-t border-black/15 pt-6">
                <Text as="h3" variant="h4">
                  {title}
                </Text>
                <Text variant="body" className="mt-3">
                  {body}
                </Text>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-section md:px-page">
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
      </section>
      <CallToAction
        title="Want to know more about what we’re building?"
        description="Get in touch, or take a look at the work."
        secondaryHref="/work"
      />
    </>
  );
}
