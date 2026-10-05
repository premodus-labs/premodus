"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Component,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useScroll, useSpring, type MotionValue } from "motion/react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Text } from "@/components/ui/text";
import { MOTION } from "@/lib/design/motion";

const ExplodedModel = dynamic(
  () => import("@/components/ui/exploded-model").then((mod) => mod.ExplodedModel),
  { ssr: false },
);

export type HomeService = {
  label: string;
  title: string;
  description: string;
  model: "computer" | "wall" | "paper" | "shield";
  fallbackImage: string;
};

class ModelFallbackBoundary extends Component<
  { children: ReactNode; fallbackImage: string; label: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="img"
          aria-label={`Static illustration of ${this.props.label.toLowerCase()}`}
          className="relative h-full w-full"
        >
          <Image
            src={this.props.fallbackImage}
            alt={this.props.label}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      );
    }
    return this.props.children;
  }
}

function ServiceSlide({
  service,
  index,
  active,
  scrollProgress,
  serviceCount,
}: {
  service: HomeService;
  index: number;
  active: boolean;
  scrollProgress: MotionValue<number>;
  serviceCount: number;
}) {
  const flipped = index % 2 === 1;

  return (
    <ScrollReveal
      as="article"
      className="service-slide grid w-full grid-cols-1 items-center gap-3 md:grid-cols-12 md:gap-gutter"
      delay={index * 0.08}
    >
      <div
        className={`md:col-span-4 ${flipped ? "md:col-start-9 md:row-start-1" : ""}`}
      >
        <Text variant="tiny" className="tracking-[0.16em]">
          {service.label}
        </Text>
      </div>
      <div
        className={`md:col-span-8 ${flipped ? "md:col-start-1 md:row-start-1" : "md:col-start-5"}`}
      >
        <div className="service-art relative aspect-[16/9] overflow-hidden bg-canvas">
          <Image
            src={service.fallbackImage}
            alt={active ? "" : service.label}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          {active ? (
            <div className="absolute inset-0">
              <ModelFallbackBoundary
                key={service.model}
                fallbackImage={service.fallbackImage}
                label={service.label}
              >
                <ExplodedModel
                  model={service.model}
                  scrollProgress={scrollProgress}
                  serviceIndex={index}
                  serviceCount={serviceCount}
                  fallbackImage={service.fallbackImage}
                  label={service.label}
                  className="h-full w-full"
                />
              </ModelFallbackBoundary>
            </div>
          ) : null}
        </div>
        <Text as="h3" variant="h4" className="mt-4">
          {service.title}
        </Text>
        <Text variant="small" className="mt-3">
          {service.description}
        </Text>
        <Link
          href="/services"
          className="mt-4 inline-block text-tiny-bold text-ink-strong underline underline-offset-4 transition-colors duration-200 hover:text-ink-medium"
        >
          Learn more
        </Link>
      </div>
    </ScrollReveal>
  );
}

export function ServicesScroller({ services }: { services: readonly HomeService[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = services.length;
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: MOTION.modelScrollStiffness,
    damping: MOTION.modelScrollDamping,
    mass: MOTION.modelScrollMass,
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver === "undefined") return;

    const slides = Array.from(track.querySelectorAll<HTMLElement>(".service-slide"));
    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        const mostVisible = slides.reduce<HTMLElement | null>((current, slide) => {
          const currentRatio = current ? ratios.get(current) ?? 0 : -1;
          if ((ratios.get(slide) ?? 0) > currentRatio) {
            return slide;
          }
          return current;
        }, null);
        const nextIndex = mostVisible ? slides.indexOf(mostVisible) : -1;
        if (nextIndex >= 0 && mostVisible && (ratios.get(mostVisible) ?? 0) > 0) {
          setActive(nextIndex);
        }
      },
      { threshold: [0, 0.15, 0.35, 0.6], rootMargin: "-15% 0px -15% 0px" },
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [count]);

  return (
    <div ref={trackRef} data-services-track className="services-track mt-major">
      <div data-services-stage className="services-stage">
        {services.map((service, index) => (
          <ServiceSlide
            key={service.label}
            service={service}
            index={index}
            active={index === active}
            scrollProgress={smoothScrollProgress}
            serviceCount={count}
          />
        ))}
      </div>
    </div>
  );
}
