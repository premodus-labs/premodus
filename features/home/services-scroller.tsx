"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Text } from "@/components/ui/text";

const ExplodedModel = dynamic(
  () => import("@/components/ui/exploded-model").then((mod) => mod.ExplodedModel),
  { ssr: false },
);

export type HomeService = {
  label: string;
  title: string;
  description: string;
  model: "computer" | "wall" | "paper" | "shield";
};

function ServiceSlide({
  service,
  index,
}: {
  service: HomeService;
  index: number;
}) {
  const isReversed = index % 2 === 1;

  return (
    <article
      data-service-slide
      className="service-slide grid w-full grid-cols-1 gap-2 md:grid-cols-12 md:gap-gutter"
    >
      <Text
        variant="tiny-bold"
        className={`order-1 md:col-span-5 md:pt-1 ${
          isReversed ? "md:col-start-8" : "md:col-start-1"
        }`}
      >
        {service.label}
      </Text>
      <div
        className={`service-copy order-2 ${
          isReversed ? "md:col-span-5 md:col-start-1" : "md:col-span-5 md:col-start-8"
        }`}
      >
        <div className="service-art relative aspect-[16/9] overflow-hidden bg-canvas">
          <ExplodedModel
            model={service.model}
            label={service.label}
            className="h-full w-full"
          />
        </div>
        <Text as="h3" variant="h4" className="service-title mt-3">
          {service.title}
        </Text>
        <Text variant="small" className="mt-2">
          {service.description}
        </Text>
        <Link
          href="/services"
          className="mt-3 inline-block text-tiny-bold text-ink-strong underline underline-offset-4 transition-colors duration-200 hover:text-ink-medium"
        >
          Learn more
        </Link>
      </div>
    </article>
  );
}

export function ServicesScroller({
  services,
}: {
  services: readonly HomeService[];
}) {
  return (
    <div data-services-track className="services-track relative mt-8 md:mt-major">
      <div data-services-stage className="services-stage">
        {services.map((service, index) => (
          <ServiceSlide key={service.label} service={service} index={index} />
        ))}
      </div>
    </div>
  );
}
