import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Text } from "@/components/ui/text";

export type HomeService = {
  label: string;
  title: string;
  description: string;
  video: string;
};

export function ServicesGrid({
  services,
}: {
  services: readonly HomeService[];
}) {
  return (
    <div className="grid w-full grid-cols-1 gap-x-[20px] gap-y-major md:grid-cols-2 lg:grid-cols-3 lg:gap-y-0">
      {services.map((service, index) => (
        <ScrollReveal
          key={service.label}
          as="article"
          delay={0.2 + index * 0.2}
          className="mx-auto w-full max-w-[450px] min-w-0"
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
            <Text
              as="h4"
              variant="h4"
              className="font-bold !text-inverse capitalize"
            >
              {service.title}
            </Text>
            <Text
              variant="body"
              className="mt-2.5 text-[18px] leading-6 !text-inverse capitalize"
            >
              {service.description}
            </Text>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
