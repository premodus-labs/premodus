"use client";

import { useEffect, useSyncExternalStore } from "react";
import { motion, useAnimationControls } from "motion/react";
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
  started,
  animate,
  compact,
}: {
  service: HomeService;
  index: number;
  started: boolean;
  animate: boolean;
  compact: boolean;
}) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (!animate || !started) return;

    controls.start({
      opacity: compact ? [0, 1, 1, index === 2 ? 1 : 0] : 1,
      y: compact ? [20, 0, 0, 0] : 0,
      transition: compact
        ? { duration: 0.5, delay: index * 1.1, times: [0, 0.15, 0.8, 1] }
        : { duration: 0.3, delay: index * 1.1 },
    });
  }, [animate, compact, controls, index, started]);

  return (
    <motion.article
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? controls : undefined}
      className={`mx-auto w-full max-w-[450px] min-w-0 lg:mx-0 lg:flex-1 ${
        compact && animate ? "col-start-1 row-start-1" : ""
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-canvas sm:aspect-[3/4]">
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
      <div className="mt-4 sm:mt-10">
        <Text as="h4" variant="h4" className="font-bold !text-inverse capitalize">
          {service.title}
        </Text>
        <Text
          variant="body"
          className="mt-2.5 text-small sm:text-[18px] sm:leading-6 !text-inverse capitalize"
        >
          {service.description}
        </Text>
      </div>
    </motion.article>
  );
}

export function ServicesGrid({
  services,
  started,
  animate = true,
}: {
  services: readonly HomeService[];
  started: boolean;
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
          started={started}
          animate={animate}
          compact={compact}
        />
      ))}
    </div>
  );
}
