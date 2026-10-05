"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Component,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Link from "next/link";
import * as THREE from "three";
import { useScroll, useSpring, type MotionValue } from "motion/react";
import { Text } from "@/components/ui/text";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";
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

function pad(index: number) {
  return String(index).padStart(2, "0");
}

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

function easeInCubic(progress: number) {
  return progress ** 3;
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
          className={`md:col-span-8 ${flipped ? "md:col-start-1 md:row-start-1" : "md:col-start-5"}`}
        >
          <div
            data-service-art
            className="service-art relative aspect-[16/9] overflow-hidden bg-canvas"
          >
            {active ? (
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
    if (!track || prefersReducedMotion) return;
    const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-service-slide]"));
    const art = Array.from(track.querySelectorAll<HTMLElement>("[data-service-art]"));
    const progressEl = progressRef.current;
    if (slides.length === 0) return;

    const fade = MOTION.serviceFadeMs;
    const hold = MOTION.serviceHoldMs;
    const span = 2 * fade + hold;
    const parallaxAmount = Number.parseFloat(MOTION.parallaxY);
    track.classList.add("services-ready");

    let duration = 0;
    const slideStarts = slides.map((_, index) => {
      const start = duration;
      duration += fade + hold;
      if (index < slides.length - 1) duration += fade;
      return start;
    });
    const originalSlideStyles = slides.map((slide) => ({
      opacity: slide.style.opacity,
      transform: slide.style.transform,
    }));
    const originalArtTransforms = art.map((element) => element.style.transform);
    const originalProgressTransform = progressEl?.style.transform;

    const interpolate = (from: number, to: number, progress: number) =>
      THREE.MathUtils.lerp(from, to, THREE.MathUtils.clamp(progress, 0, 1));
    const updateTimeline = (progress: number) => {
      const time = progress * duration;

      slides.forEach((slide, index) => {
        const isLast = index === slides.length - 1;
        const start = slideStarts[index];
        const fadeInProgress = THREE.MathUtils.clamp((time - start) / fade, 0, 1);
        let opacity: number;
        let translateY: number;
        let scale: number;

        if (fadeInProgress < 1) {
          const easedProgress = easeOutCubic(fadeInProgress);
          opacity = easedProgress;
          translateY = interpolate(MOTION.serviceY, 0, easedProgress);
          scale = interpolate(MOTION.serviceScaleFrom, 1, easedProgress);
        } else {
          const fadeOutStart = start + fade + hold;
          if (isLast || time <= fadeOutStart) {
            opacity = 1;
            translateY = 0;
            scale = 1;
          } else {
            const fadeOutProgress = THREE.MathUtils.clamp((time - fadeOutStart) / fade, 0, 1);
            const easedProgress = easeInCubic(fadeOutProgress);
            opacity = 1 - easedProgress;
            translateY = interpolate(0, -MOTION.serviceY, easedProgress);
            scale = interpolate(1, MOTION.serviceScaleFrom, easedProgress);
          }
        }

        slide.style.opacity = String(opacity);
        slide.style.transform = `translateY(${translateY}px) scale(${scale})`;

        const artElement = art[index];
        if (artElement) {
          const artDuration = fade + hold + (isLast ? 0 : fade);
          const artProgress = THREE.MathUtils.clamp((time - start) / artDuration, 0, 1);
          const parallax = interpolate(parallaxAmount, -parallaxAmount, artProgress);
          artElement.style.transform = `translateY(${parallax}%)`;
        }
      });

      if (progressEl) {
        progressEl.style.transform = `scaleX(${THREE.MathUtils.clamp(time / duration, 0, 1)})`;
      }

      const nextActive = Math.min(slides.length - 1, Math.floor(time / span));
      setActive((current) => (current === nextActive ? current : nextActive));
    };

    const unsubscribe = smoothScrollProgress.on("change", updateTimeline);
    updateTimeline(smoothScrollProgress.get());

    return () => {
      track.classList.remove("services-ready");
      unsubscribe();
      slides.forEach((slide, index) => {
        slide.style.opacity = originalSlideStyles[index].opacity;
        slide.style.transform = originalSlideStyles[index].transform;
      });
      art.forEach((element, index) => {
        element.style.transform = originalArtTransforms[index];
      });
      if (progressEl && originalProgressTransform !== undefined) {
        progressEl.style.transform = originalProgressTransform;
      }
    };
  }, [count, prefersReducedMotion, services, smoothScrollProgress]);

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
            scrollProgress={smoothScrollProgress}
            serviceCount={count}
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
