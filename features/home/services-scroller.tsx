"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { motion, type MotionValue } from "motion/react";
import { cubicBezier, interpolate, motionValue, transformValue } from "motion";
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

const serviceModelProgress = interpolate([0.25, 0.8], [0, 1], {
  ease: cubicBezier(...EASE),
});
const serviceOpacity = interpolate([0, 0.82, 1], [1, 1, 0]);
const serviceY = interpolate([0, 0.82, 1], [0, 0, -24]);

function useServiceMotionValues(
  trackProgress: MotionValue<number>,
  index: number,
  count: number,
): ServiceMotionValues {
  return useMemo(() => {
    const local = transformValue(() => trackProgress.get() * count - index);
    const progress = transformValue(() => {
      const value = local.get();
      if (value <= 0) return 0;
      if (value >= 1) return 1;
      return serviceModelProgress(value);
    });
    const opacity = transformValue(() => {
      const value = local.get();
      if (value < 0 || value > 1) return 0;
      return serviceOpacity(value);
    });
    const y = transformValue(() => {
      const value = local.get();
      if (value < 0 || value > 1) return 24;
      return serviceY(value);
    });
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
  const count = services.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;

    if (prefersReducedMotion) {
      track.classList.remove("services-ready");
      return;
    }

    track.classList.remove("services-ready");
  }, [count, prefersReducedMotion, trackProgress]);

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
            active={true}
            reducedMotion={prefersReducedMotion}
            trackProgress={trackProgress}
          />
        ))}
      </div>
    </div>
  );
}
