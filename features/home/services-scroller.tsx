"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import {
  cubicBezier,
  interpolate,
  motionValue,
  scroll,
  transformValue,
} from "motion";
import { Text } from "@/components/ui/text";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";
import { EASE } from "@/lib/design/motion";

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

type ServiceMotionValues = {
  progress: MotionValue<number>;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const serviceModelProgress = interpolate([0.25, 0.8], [0, 1], {
  ease: cubicBezier(...EASE),
});
const serviceOpacity = interpolate([0, 0.15, 0.9, 1], [0, 1, 1, 0]);
const serviceY = interpolate([0, 0.15, 0.9, 1], [24, 0, 0, -24]);

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function useServiceMotionValues(
  trackProgress: MotionValue<number>,
  index: number,
  count: number,
): ServiceMotionValues {
  return useMemo(() => {
    const local = transformValue(() =>
      clamp(trackProgress.get() * count - index),
    );
    const progress = transformValue(() => {
      return serviceModelProgress(local.get());
    });
    const opacity = transformValue(() => serviceOpacity(local.get()));
    const y = transformValue(() => serviceY(local.get()));
    const scale = transformValue(() => 0.97 + opacity.get() * 0.03);

    return { progress, opacity, y, scale };
  }, [count, index, trackProgress]);
}

function ServiceSlide({
  service,
  index,
  count,
  active,
  reducedMotion,
  trackProgress,
}: {
  service: HomeService;
  index: number;
  count: number;
  active: boolean;
  reducedMotion: boolean;
  trackProgress: MotionValue<number>;
}) {
  const values = useServiceMotionValues(trackProgress, index, count);
  const assembledProgress = useMemo(() => motionValue(1), []);
  const modelVisible = active || reducedMotion;

  return (
    <motion.article
      data-service-slide
      aria-hidden={!active && !reducedMotion}
      inert={!active && !reducedMotion}
      className="service-slide grid w-full grid-cols-1 items-center gap-3 md:grid-cols-12 md:gap-gutter"
      style={{
        opacity: reducedMotion ? 1 : values.opacity,
        y: reducedMotion ? 0 : values.y,
        scale: reducedMotion ? 1 : values.scale,
      }}
    >
      <div
        className="service-copy md:col-span-8 md:col-start-3"
      >
        <div className="service-art relative aspect-[16/9] overflow-hidden bg-canvas">
          {modelVisible ? (
            <div className="absolute inset-0">
              <ExplodedModel
                model={service.model}
                progress={reducedMotion ? assembledProgress : values.progress}
                fallbackImage={service.fallbackImage}
                label={service.label}
                className="h-full w-full"
              />
            </div>
          ) : null}
        </div>
        <Text as="h3" variant="h4" className="service-title mt-4">
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
    </motion.article>
  );
}

export function ServicesScroller({ services }: { services: readonly HomeService[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const trackProgress = useMemo(() => motionValue(0), []);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const count = services.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion || count === 0) return;

    const stopScroll = scroll((value) => trackProgress.set(value), {
      target: track,
      offset: ["start start", "end end"],
    });
    track.classList.add("services-ready");

    return () => {
      stopScroll();
      track.classList.remove("services-ready");
    };
  }, [count, prefersReducedMotion, trackProgress]);

  useMotionValueEvent(trackProgress, "change", (value) => {
    if (prefersReducedMotion || count === 0) return;
    const next = Math.min(count - 1, Math.floor(clamp(value) * count));
    if (activeRef.current === next) return;
    activeRef.current = next;
    setActive(next);
  });

  return (
    <div
      ref={trackRef}
      data-services-track
      style={{ "--service-count": count } as CSSProperties}
      className="services-track relative mt-major"
    >
      <div data-services-stage className="services-stage">
        {services.map((service, index) => (
          <ServiceSlide
            key={service.label}
            service={service}
            index={index}
            count={count}
            active={index === active}
            reducedMotion={prefersReducedMotion}
            trackProgress={trackProgress}
          />
        ))}
        {!prefersReducedMotion ? (
          <div className="services-progress pointer-events-none absolute inset-x-0 bottom-8 flex items-center gap-4">
            <Text variant="tiny" className="shrink-0 tabular-nums">
              {pad(active + 1)} / {pad(count)}
            </Text>
            <div className="h-px flex-1 overflow-hidden bg-surface/20">
              <motion.div
                className="h-px w-full origin-left bg-surface"
                style={{ scaleX: trackProgress }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
