"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { getBoilerImage } from "@/lib/constants/boiler-images";
import type { Project } from "@/lib/constants/projects";

const DURATION = 300;

export function ProjectGrid({
  projects,
  inverse = false,
}: {
  projects: Project[];
  inverse?: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const openProject = (index: number) => {
    setActive(index);
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  };

  const close = useCallback(() => {
    setOpen(false);
    setTimeout(() => setActive(null), DURATION);
  }, []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close]);

  const project = active !== null ? projects[active] : null;
  const imageFor = (p: Project, i: number) =>
    p.image ? { src: p.image, alt: `${p.name} website` } : getBoilerImage(i);

  return (
    <>
      <div className="mt-[40px] grid grid-cols-2 items-start gap-x-[20px] gap-y-major">
        {projects.map((p, index) => {
          const image = imageFor(p, index);
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => openProject(index)}
              className="group w-full self-start cursor-pointer text-left"
              aria-haspopup="dialog"
            >
              <div
                className={`relative flex aspect-[3/2] w-full items-end overflow-hidden rounded-lg p-6 ${
                  p.slug === "rugare-mental-health" ? "bg-white" : "bg-surface"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <Text variant="tiny-bold" className="relative text-inverse">
                  {p.label}
                </Text>
              </div>
              <Text as="h2" variant="h3" className={`mt-5 ${inverse ? "!text-inverse" : ""}`}>
                {p.name}
              </Text>
              <Text variant="body" className={`mt-1 ${inverse ? "!text-inverse/75" : ""}`}>
                {p.summary}
              </Text>
              <Text
                variant="small-bold"
                className={`mt-3 transition-transform group-hover:translate-x-1 ${
                  inverse ? "!text-inverse" : ""
                }`}
              >
                View project →
              </Text>
            </button>
          );
        })}
      </div>

      {project && active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={project.name}
          className="fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:p-8"
        >
          <div
            onClick={close}
            className={`absolute inset-0 bg-black/60 transition-opacity ease-out ${open ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDuration: `${DURATION}ms` }}
          />
          <div
            className={`relative max-h-[90vh] w-full max-w-4xl overflow-y-auto ${
              inverse ? "bg-surface text-inverse" : "bg-canvas"
            } transition-all ease-out ${
              open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDuration: `${DURATION}ms` }}
          >
            <div
              className={`relative aspect-[16/9] w-full ${
                project.slug === "rugare-mental-health" ? "bg-white" : "bg-surface"
              }`}
            >
              <Image
                src={imageFor(project, active).src}
                alt={imageFor(project, active).alt}
                fill
                sizes="(min-width: 768px) 900px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 md:p-8">
              <Text variant="tiny-bold" className={inverse ? "!text-inverse/75" : ""}>
                {project.label}
              </Text>
              <Text as="h2" variant="h2" className={`mt-2 ${inverse ? "!text-inverse" : ""}`}>
                {project.name}
              </Text>
              <Text variant="body" className={`mt-4 ${inverse ? "!text-inverse/75" : ""}`}>
                {project.description}
              </Text>

              {project.highlights && project.highlights.length > 0 && (
                <dl className="mt-8 grid grid-cols-1 gap-4 border-y border-rule/25 py-6 md:grid-cols-3">
                  {project.highlights.map((h) => (
                    <div key={h.label}>
                      <dt className="sr-only">{h.label}</dt>
                      <dd>
                        <Text variant="h3" className={inverse ? "!text-inverse" : ""}>
                          {h.value}
                        </Text>
                        <Text variant="small" className={inverse ? "!text-inverse/75" : ""}>
                          {h.label}
                        </Text>
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {project.audience && (
                <div className="mt-8">
                  <Text variant="small-bold" className={inverse ? "!text-inverse" : ""}>
                    Who it’s for
                  </Text>
                  <Text variant="small" className={`mt-2 ${inverse ? "!text-inverse/75" : ""}`}>
                    {project.audience}
                  </Text>
                </div>
              )}

              {project.features && project.features.length > 0 && (
                <div className="mt-8">
                  <Text variant="small-bold" className={inverse ? "!text-inverse" : ""}>
                    What the system does
                  </Text>
                  <ul className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {project.features.map((f) => (
                      <li key={f.title}>
                        <Text variant="small-bold" className={inverse ? "!text-inverse" : ""}>
                          {f.title}
                        </Text>
                        <Text variant="small" className={`mt-1 ${inverse ? "!text-inverse/75" : ""}`}>
                          {f.text}
                        </Text>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.role && (
                <div className="mt-8">
                  <Text variant="small-bold" className={inverse ? "!text-inverse" : ""}>
                    Our role
                  </Text>
                  <Text variant="small" className={`mt-2 ${inverse ? "!text-inverse/75" : ""}`}>
                    {project.role}
                  </Text>
                </div>
              )}

              {project.stack && project.stack.length > 0 && (
                <div className="mt-8">
                  <Text variant="small-bold" className={inverse ? "!text-inverse" : ""}>
                    Built with
                  </Text>
                  <Text variant="small" className={`mt-2 ${inverse ? "!text-inverse/75" : ""}`}>
                    {project.stack.join(" · ")}
                  </Text>
                </div>
              )}

              <div className="mt-10 flex flex-wrap items-center gap-4">
                {project.url && (
                  <ButtonLink
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={inverse ? "!bg-inverse !text-surface" : ""}
                  >
                    Visit live site ↗
                  </ButtonLink>
                )}
                <button type="button" onClick={close} className="px-4 py-2 text-small underline">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
