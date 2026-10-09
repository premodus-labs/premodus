import Image from "next/image";
import { CallToAction } from "@/components/ui/call-to-action";
import { Text } from "@/components/ui/text";
import { getBoilerImage } from "@/lib/constants/boiler-images";

const vision =
  "A Malawi that runs on its own ideas — productive, efficient, and self-sustaining, powered by technology built at home.";

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
        className="px-6 pb-section pt-header-t md:px-page"
        aria-labelledby="about-title"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-major md:grid-cols-12">
          <Text
            as="h1"
            variant="h2"
            id="about-title"
            className="max-w-xl md:col-span-5"
          >
            The gap was never talent.
            <br />
            It was standards.
          </Text>
          <div className="flex flex-col gap-4 md:col-span-5 md:col-start-6 md:pt-major">
            <Text variant="small">
              Most software built here has been built to be functional, not good —
              shipped fast, patched later, judged by whether it works today rather
              than whether it will still work in two years. That’s not a talent gap.
              It’s what happens when nobody’s asked for better, and nobody’s stopped
              to ask why.
            </Text>
            <Text variant="small">
              We started Premodus to test a different assumption: that Malawian
              developers, held to an international standard and given a fair chance,
              could build things that compete anywhere — and that the country’s most
              overlooked problems are exactly where that standard is needed most,
              not despite being unglamorous, but because of it.
            </Text>
            <Text variant="small-bold">
              We’re three co-founders who’d rather prove that slowly and correctly
              than claim it before we have.
            </Text>
          </div>
        </div>
      </section>

      <section className="px-6 pb-major md:px-page">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-major md:grid-cols-12">
          <div className="md:col-span-5">
            <Text variant="small-bold">
              Our mission
            </Text>
            <Text
              variant="body-bold"
              className="mt-4 max-w-md"
            >
              We build technology at a world-class standard to solve the problems
              Malawi’s tech industry has overlooked.
            </Text>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:mt-major">
            <Text variant="small-bold">Our vision</Text>
            <Text variant="h3" className="mt-4 max-w-2xl">
              {vision}
            </Text>
          </div>
        </div>
      </section>

      <section className="px-6 pb-section pt-major md:px-page">
        <div className="mx-auto max-w-7xl">
          <Text as="h2" variant="h3" className="max-w-2xl">
            Three people, no layers between the work and the person doing it.
          </Text>
          <div className="mt-6 grid grid-cols-1 gap-gutter md:grid-cols-3">
            {team.map(([initials, name, role, description, imagePath], index) => (
              <article key={name}>
                <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                  <Image
                    src={imagePath ? imagePath : getBoilerImage(index).src}
                    alt={name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover grayscale transition duration-500 group-hover:grayscale-0 motion-reduce:transition-none"
                  />
                  <span className="sr-only">{initials}</span>
                </div>
                <Text as="h3" variant="small-bold" className="mt-3">
                  {name}
                </Text>
                <Text variant="tiny" className="mt-1">
                  {role}
                </Text>
                <Text variant="tiny" className="mt-2">
                  {description}
                </Text>
                <div className="mt-2 flex items-center gap-2 text-ink-strong" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="size-4 fill-current">
                    <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.7 2.62 1.21 3.26.92.1-.72.39-1.21.71-1.49-2.47-.28-5.06-1.24-5.06-5.5 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.56 0c2.12-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3 0 4.27-2.6 5.21-5.08 5.49.4.35.76 1.02.76 2.06V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z" />
                  </svg>
                  <svg viewBox="0 0 24 24" className="size-4 fill-current">
                    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.34 18H5.67V9.4h2.67ZM7 8.22a1.55 1.55 0 1 1 .02-3.1A1.55 1.55 0 0 1 7 8.22ZM18.33 18h-2.66v-4.18c0-1-.02-2.29-1.4-2.29-1.4 0-1.61 1.1-1.61 2.22V18H10V9.4h2.55v1.17h.04a2.8 2.8 0 0 1 2.52-1.39c2.7 0 3.22 1.78 3.22 4.1Z" />
                  </svg>
                  <svg viewBox="0 0 24 24" className="size-4 fill-current">
                    <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-5-7.3L5.5 22H2.3l7.3-8.4L1.8 2h6.4l4.5 6.7L18.9 2Zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20Z" />
                  </svg>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CallToAction
        title="Want to know more about what we’re building?"
        description="Get in touch, or take a look at the work."
        secondaryHref="/services"
        secondaryLabel="See our services"
      />
    </>
  );
}
