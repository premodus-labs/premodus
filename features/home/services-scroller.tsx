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

function ServiceSlide({ service }: { service: HomeService }) {
  return (
    <article
      data-service-slide
      className="service-slide grid w-full grid-cols-1 gap-3 md:grid-cols-12 md:gap-gutter"
    >
      <div className="service-art relative col-span-full aspect-[16/9] overflow-hidden bg-canvas">
        <ExplodedModel
          model={service.model}
          label={service.label}
          className="h-full w-full"
        />
      </div>
      <div className="service-copy md:col-span-8 md:col-start-3">
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
    </article>
  );
}

export function ServicesScroller({
  services,
}: {
  services: readonly HomeService[];
}) {
  return (
    <div data-services-track className="services-track relative mt-major">
      <div data-services-stage className="services-stage">
        {services.map((service) => (
          <ServiceSlide key={service.label} service={service} />
        ))}
      </div>
    </div>
  );
}
