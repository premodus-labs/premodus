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
      {/* HERO — one oversized, left-aligned statement anchored to the bottom */}
      <section
        className="flex min-h-[80svh] flex-col justify-end px-6 pb-major pt-section md:px-page"
        aria-labelledby="about-title"
      >
        <div className="mx-auto w-full max-w-7xl">
          <Text
            as="h1"
            variant="display"
            id="about-title"
            className={`max-w-6xl text-left tracking-tight ${heroStyles.title}`}
            animate={false}
          >
            The gap was never talent. It was standards.
          </Text>
          <div className="mt-major grid grid-cols-1 gap-major border-t border-black/15 pt-6 md:grid-cols-12">
            <Text variant="small-bold" className="md:col-span-4">
              About Premodus
            </Text>
            <Text
              variant="body"
              className={`md:col-span-6 md:col-start-7 ${heroStyles.intro}`}
              animate={false}
            >
              Most software built here has been built to be functional, not good —
              shipped fast, patched later, judged by whether it works today rather
              than whether it will still work in two years.
            </Text>
          </div>
        </div>
      </section>

      {/* STORY — label left, statement right */}
      <section className="px-6 py-section md:px-page">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-major border-t border-black/15 pt-major md:grid-cols-12">
          <Text variant="small-bold" className="md:col-span-4">
            Why we started
          </Text>
          <div className="flex flex-col gap-8 md:col-span-7 md:col-start-6">
            <Text variant="h3">
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
      </section>

      {/* MISSION + VISION — full-bleed black block for contrast */}
      <section className="bg-black px-6 py-section text-white md:px-page">
        <div className="mx-auto flex max-w-7xl flex-col gap-section">
          <div className="grid grid-cols-1 gap-major md:grid-cols-12">
            <Text variant="small-bold" className="md:col-span-4">
              Our mission
            </Text>
            <Text variant="h2" className="md:col-span-8">
              We build technology at a world-class standard to solve the problems
              Malawi’s tech industry has overlooked.
            </Text>
          </div>
          <div className="grid grid-cols-1 gap-major border-t border-white/20 pt-major md:grid-cols-12">
            <Text variant="small-bold" className="md:col-span-4">
              Our vision
            </Text>
            <Text variant="h2" className="md:col-span-8">
              {vision}
            </Text>
          </div>
        </div>
      </section>

      {/* PRINCIPLES — ruled rows: title left, description right */}
      <section className="px-6 py-section md:px-page">
        <div className="mx-auto max-w-7xl">
          <Text as="h2" variant="h2" className="max-w-3xl">
            What we hold ourselves to
          </Text>
          <ul className="mt-major">
            {principles.map(([title, body]) => (
              <li
                key={title}
                className="grid grid-cols-1 gap-4 border-t border-black/15 py-8 last:border-b md:grid-cols-12 md:gap-major"
              >
                <Text as="h3" variant="h4" className="md:col-span-5">
                  {title}
                </Text>
                <Text variant="body" className="md:col-span-6 md:col-start-7">
                  {body}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TEAM — large portraits, grayscale until hovered */}
      <section className="px-6 pb-section md:px-page">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-major border-t border-black/15 pt-major md:grid-cols-12">
            <Text variant="small-bold" className="md:col-span-4">
              Leadership
            </Text>
            <Text as="h2" variant="h2" className="md:col-span-8">
              Three people, no layers between the work and the person doing it.
            </Text>
          </div>
          <div className="mt-major grid grid-cols-1 gap-x-gutter gap-y-major md:grid-cols-3">
            {team.map(([initials, name, role, description, imagePath], index) => (
              <article key={name} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                  <Image
                    src={imagePath ? imagePath : getBoilerImage(index).src}
                    alt={name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover grayscale transition duration-500 group-hover:grayscale-0 motion-reduce:transition-none"
                  />
                  <span className="sr-only">{initials}</span>
                </div>
                <div className="mt-4 border-t border-black/15 pt-4">
                  <Text as="h3" variant="h4">
                    {name}
                  </Text>
                  <Text variant="small-bold" className="mt-1">
                    {role}
                  </Text>
                  <Text variant="small" className="mt-2">
                    {description}
                  </Text>
                </div>
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
