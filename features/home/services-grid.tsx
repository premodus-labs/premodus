"use client";

import { useSyncExternalStore } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { Text } from "@/components/ui/text";

export type HomeService = {
  label: string;
  title: string;
  description: string;
  video: string;
};

const COMPACT_VIEWPORT = "(max-width: 1023px)";

function subscribeToCompactViewport(onChange: () => void) {
  const mediaQuery = window.matchMedia(COMPACT_VIEWPORT);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getIsCompactViewport() {
  return window.matchMedia(COMPACT_VIEWPORT).matches;
}

function ServiceCard({
  service,
  index,
  progress,
  animate,
  compact,
}: {
  service: HomeService;
  index: number;
  progress: MotionValue<number>;
  animate: boolean;
  compact: boolean;
}) {
  const start = 0.58 + index * 0.18;
  const nextStart = start + 0.18;
  const desktopOpacity = useTransform(progress, [start, start + 0.02], [0, 1]);
  const desktopY = useTransform(progress, [start, start + 0.02], [20, 0]);
  const compactOpacity = useTransform(
    progress,
    [start, start + 0.02, nextStart, nextStart + 0.02],
    [0, 1, 1, index === 2 ? 1 : 0],
  );
  const compactY = useTransform(progress, [start, start + 0.02], [20, 0]);

  return (
    <motion.article
      className={`mx-auto w-full max-w-[450px] min-w-0 lg:mx-0 lg:flex-1 ${
        compact && animate ? "col-start-1 row-start-1" : ""
      }`}
      style={{
        opacity: !animate ? 1 : compact ? compactOpacity : desktopOpacity,
        y: !animate ? 0 : compact ? compactY : desktopY,
      }}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-canvas">
        <video
          src={service.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <Text
          variant="body"
          className="absolute left-5 top-5 z-10 !text-ink-strong text-body-medium capitalize"
        >
          {service.label}
        </Text>
      </div>
      <div className="mt-10">
        <Text as="h4" variant="h4" className="font-bold !text-inverse capitalize">
          {service.title}
        </Text>
        <Text
          variant="body"
          className="mt-2.5 text-[18px] leading-6 !text-inverse capitalize"
        >
          {service.description}
        </Text>
      </div>
    </motion.article>
  );
}

export function ServicesGrid({
  services,
  progress,
  animate = true,
}: {
  services: readonly HomeService[];
  progress: MotionValue<number>;
  animate?: boolean;
}) {
  const compact = useSyncExternalStore(
    subscribeToCompactViewport,
    getIsCompactViewport,
    () => false,
  );

  return (
    <div className="grid w-full grid-cols-1 gap-y-major lg:flex lg:justify-between lg:gap-x-5">
      {services.map((service, index) => (
        <ServiceCard
          key={service.label}
          service={service}
          index={index}
          progress={progress}
          animate={animate}
          compact={compact}
        />
      ))}
    </div>
  );
}
