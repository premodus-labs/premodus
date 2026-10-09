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

const iconProps = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const icons = {
  mission: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" />
    </svg>
  ),
  vision: (
    <svg {...iconProps}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  lasting: (
    <svg {...iconProps}>
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <path d="M7 7h.01M7 17h.01" />
    </svg>
  ),
  secure: (
    <svg {...iconProps}>
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  standard: (
    <svg {...iconProps}>
      <path d="M5 20V10M12 20V4M19 20v-7" />
    </svg>
  ),
} as const;

// Cards for the black section. span = columns on a 6-col desktop grid.
const cards = [
  { icon: icons.mission, title: "Our mission", body: "We build technology at a world-class standard to solve the problems Malawi’s tech industry has overlooked.", span: "md:col-span-3" },
  { icon: icons.vision, title: "Our vision", body: vision, span: "md:col-span-3" },
  { icon: icons.lasting, title: principles[0][0], body: principles[0][1], span: "md:col-span-2" },
  { icon: icons.secure, title: principles[1][0], body: principles[1][1], span: "md:col-span-2" },
  { icon: icons.standard, title: principles[2][0], body: principles[2][1], span: "md:col-span-2" },
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

      {/* WHAT DRIVES US — inset black panel with icon cards */}
      <section className="px-2 py-2">
        <div className="mx-auto max-w-[1600px] rounded-3xl bg-black px-6 py-section md:px-page">
          <div className="mx-auto max-w-7xl">
            <Text
              as="h2"
              variant="h2"
              className="!text-white"
              animate={false}
            >
              What drives us
            </Text>
            <div className="mt-major grid grid-cols-1 gap-3 md:grid-cols-6">
              {cards.map(({ icon, title, body, span }) => (
                <article
                  key={title}
                  className={`flex flex-col rounded-3xl bg-[#222] p-8 md:p-10 ${span}`}
                >
                  <div className="flex size-20 items-center justify-center rounded-2xl bg-white/10 text-white/80">
                    {icon}
                  </div>
                  <Text
                    as="h3"
                    variant="h4"
                    className="mt-12 !text-white"
                    animate={false}
                  >
                    {title}
                  </Text>
                  <Text
                    variant="body"
                    className="mt-4 !text-white/80"
                    animate={false}
                  >
                    {body}
                  </Text>
                </article>
              ))}
            </div>
          </div>
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
