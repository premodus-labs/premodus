"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Link from "next/link";
import { createTimeline } from "animejs";
import { Text } from "@/components/ui/text";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";
import { MOTION } from "@/lib/design/motion";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

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

function pad(index: number) {
  return String(index).padStart(2, "0");
}

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
  modelProgress,
  reducedMotion,
}: {
  service: HomeService;
  index: number;
  active: boolean;
  modelProgress: React.RefObject<number[]>;
  reducedMotion: boolean;
}) {
  const flipped = index % 2 === 1;
  const getProgress = useCallback(
    () => (reducedMotion ? 1 : modelProgress.current[index] ?? 0),
    [index, modelProgress, reducedMotion],
  );

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
            className="relative aspect-[16/9] max-h-[28svh] overflow-hidden bg-canvas md:max-h-[42svh]"
          >
            {active ? (
              <ModelFallbackBoundary
                key={service.model}
                fallbackImage={service.fallbackImage}
                label={service.label}
              >
                <ExplodedModel
                  model={service.model}
                  getProgress={getProgress}
                  fallbackImage={service.fallbackImage}
                  label={service.label}
                  className="h-full w-full"
                />
              </ModelFallbackBoundary>
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
            tabIndex={active ? undefined : -1}
            className="mt-4 inline-block text-tiny-bold text-ink-strong underline underline-offset-4 transition-colors duration-200 hover:text-ink-medium"
          >
            Learn more
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ServicesScroller({ services }: { services: readonly HomeService[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const modelProgress = useRef<number[]>(services.map(() => 0));
  const count = services.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion) return;
    const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-service-slide]"));
    const art = Array.from(track.querySelectorAll<HTMLElement>("[data-service-art]"));
    const progressEl = progressRef.current;
    if (slides.length === 0) return;

    const fade = MOTION.serviceFadeMs;
    const hold = MOTION.serviceHoldMs;
    const span = 2 * fade + hold;
    let cursor = 0;
    track.classList.add("services-ready");

    const timeline = createTimeline({ defaults: { ease: "linear" } });

    slides.forEach((slide, index) => {
      const isLast = index === slides.length - 1;
      timeline.add(
        slide,
        {
          opacity: [0, 1],
          translateY: [MOTION.serviceY, 0],
          scale: [MOTION.serviceScaleFrom, 1],
          duration: fade,
          ease: MOTION.easeOutSoft,
        },
        cursor,
      );

      if (art[index]) {
        timeline.add(
          art[index],
          {
            translateY: [MOTION.parallaxY, `-${MOTION.parallaxY}`],
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
            translateY: -MOTION.serviceY,
            scale: MOTION.serviceScaleFrom,
            duration: fade,
            ease: MOTION.easeIn,
          },
          cursor,
        );
        cursor += fade;
      }
    });

    if (progressEl) {
      timeline.add(
        progressEl,
        {
          scaleX: [0, 1],
          ease: "linear",
          duration: timeline.duration,
        },
        0,
      );
    }

    const updateTimeline = () => {
      const stage = track.querySelector<HTMLElement>("[data-services-stage]");
      if (!stage) return;
      const tail =
        Number.parseFloat(getComputedStyle(track).getPropertyValue("--service-tail")) || 0;
      const stickyDistance =
        track.offsetHeight - stage.offsetHeight - tail;
      const progress = clamp(
        -track.getBoundingClientRect().top / Math.max(1, stickyDistance),
      );
      const time = progress * timeline.duration;

      timeline.seek(time);
      const nextActive = Math.min(slides.length - 1, Math.floor(time / span));
      setActive((current) => (current === nextActive ? current : nextActive));
      modelProgress.current = slides.map((_, index) =>
        clamp((time - index * span - fade) / hold),
      );
    };

    document.addEventListener("scroll", updateTimeline, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", updateTimeline);
    const frame = requestAnimationFrame(updateTimeline);

    return () => {
      track.classList.remove("services-ready");
      cancelAnimationFrame(frame);
      document.removeEventListener("scroll", updateTimeline, true);
      window.removeEventListener("resize", updateTimeline);
      timeline.pause();
      timeline.revert();
    };
  }, [count, prefersReducedMotion, services]);

  return (
    <div
      ref={trackRef}
      data-services-track
      style={{
        "--service-count": count,
      } as CSSProperties}
      className="services-track relative mt-major"
    >
      <div data-services-stage className="services-stage box-border">
        {services.map((service, index) => (
          <ServiceSlide
            key={service.label}
            service={service}
            index={index}
            active={prefersReducedMotion || index === active}
            modelProgress={modelProgress}
            reducedMotion={prefersReducedMotion}
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
