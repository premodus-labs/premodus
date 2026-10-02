"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { createTimeline } from "animejs";
import { Text } from "@/components/ui/text";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";
import { motion } from "@/lib/design/motion";

export type HomeService = {
  label: string;
  title: string;
  description: string;
  image: string;
};

function pad(index: number) {
  return String(index).padStart(2, "0");
}

function ServiceSlide({
  service,
  index,
  active,
}: {
  service: HomeService;
  index: number;
  active: boolean;
}) {
  const flipped = index % 2 === 1;

  return (
    <article
      data-service-slide
      aria-hidden={!active}
      inert={!active}
      className="service-slide flex w-full items-center"
    >
      <div className="grid w-full grid-cols-1 items-center gap-3 md:grid-cols-12 md:gap-gutter">
        <div
          className={`md:col-span-4 ${flipped ? "md:col-start-9 md:row-start-1" : ""}`}
        >
          <Text variant="tiny" className="tracking-[0.16em]">
            {service.label}
          </Text>
        </div>
        <div
          className={`md:col-span-6 ${flipped ? "md:col-start-1 md:row-start-1" : "md:col-start-7"}`}
        >
          <div
            data-service-art
            className="relative aspect-[16/9] max-h-[28svh] overflow-hidden bg-surface md:max-h-[42svh]"
          >
            <Image
              src={service.image}
              alt={service.label}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <Text as="h3" variant="h4" className="mt-4">
            {service.title}
          </Text>
          <Text variant="small" className="mt-3">
            {service.description}
          </Text>
          <Link
            href="/services"
            tabIndex={active ? undefined : -1}
            className="mt-4 inline-block text-tiny-bold text-ink-strong underline underline-offset-4"
          >
            Learn more
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ServicesScroller({ services }: { services: readonly HomeService[] }) {
export function ServicesScroller({ services }: { services: readonly HomeService[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);
  const count = services.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion) return;
    setEnhanced(true);

    const slides = Array.from(
      track.querySelectorAll<HTMLElement>("[data-service-slide]"),
    );
    const art = Array.from(
      track.querySelectorAll<HTMLElement>("[data-service-art]"),
    );
    const progress = progressRef.current;
    if (slides.length === 0) return;

    const fade = motion.serviceFadeMs;
    const hold = motion.serviceHoldMs;
    let cursor = 0;
    track.classList.add("services-ready");

    const timeline = createTimeline({
      defaults: { ease: "linear" },
      onUpdate: (self) => {
        // Match the interactive slide to the timeline's actual entrance times,
        // so a slide never becomes focusable during the previous slide's hold.
        let next = 0;
        let elapsed = 0;
        for (let index = 1; index < count; index += 1) {
          elapsed += fade + hold + fade;
          if (self.currentTime >= elapsed) next = index;
        }
        setActive((current) => (current === next ? current : next));
      },
    });

    slides.forEach((slide, index) => {
      const isLast = index === slides.length - 1;

      timeline.add(
        slide,
        {
          opacity: [0, 1],
          translateY: [motion.serviceY, 0],
          scale: [motion.serviceScaleFrom, 1],
          duration: fade,
          ease: motion.easeOutSoft,
        },
        cursor,
      );

      if (art[index]) {
        timeline.add(
          art[index],
          {
            translateY: [motion.parallaxY, `-${motion.parallaxY}`],
            duration: fade + hold + (isLast ? 0 : fade),
            ease: "linear",
          },
          cursor,
        );
      }

      cursor += fade;
      timeline.add({ duration: hold }, cursor);
      cursor += hold;

      if (!isLast) {
        timeline.add(
          slide,
          {
            opacity: 0,
            translateY: -motion.serviceY,
            scale: motion.serviceScaleFrom,
            duration: fade,
            ease: motion.easeIn,
          },
          cursor,
        );
        cursor += fade;
      }
    });

    if (progress) {
      timeline.add(
        progress,
        {
          scaleX: [0, 1],
          ease: "linear",
          duration: timeline.duration,
        },
        0,
      );
    }

    const updateTimeline = () => {
      const progress = Math.min(
        1,
        Math.max(0, -track.getBoundingClientRect().top / track.offsetHeight),
      );
      timeline.seek(timeline.duration * progress);
    };
    window.addEventListener("scroll", updateTimeline, { passive: true });
    window.addEventListener("resize", updateTimeline);
    const frame = requestAnimationFrame(updateTimeline);

    return () => {
      track.classList.remove("services-ready");
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateTimeline);
      window.removeEventListener("resize", updateTimeline);
      timeline.pause();
      timeline.revert();
    };
  }, [count, prefersReducedMotion]);

  return (
    <div
      ref={trackRef}
      data-services-track
      style={{ "--service-count": count } as CSSProperties}
      className="services-track relative mt-major"
    >
      <div data-services-stage className="services-stage box-border">
        {services.map((service, index) => (
          <ServiceSlide
            key={service.label}
            service={service}
            index={index}
            active={prefersReducedMotion || !enhanced || index === active}
          />
        ))}
        <div
          data-services-progress
          className="services-progress pointer-events-none absolute inset-x-0 bottom-8 flex items-center gap-4"
        >
          <Text variant="tiny" className="shrink-0 tabular-nums">
            {pad(active + 1)} / {pad(count)}
          </Text>
          <div className="h-px flex-1 overflow-hidden bg-surface/20">
            <div
              ref={progressRef}
              className="h-px w-full origin-left scale-x-0 bg-surface"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
