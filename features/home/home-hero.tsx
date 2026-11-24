"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";
import { spaceMono } from "@/lib/design/fonts";
import { ServicesGrid, type HomeService } from "@/features/home/services-grid";
import styles from "./home-hero.module.css";

// ── Tweak this ──────────────────────────────────────────────
const HERO_IMAGE = "/media/typing.mp4";
const HERO_FALLBACK_IMAGE = "/media/image.png";
// ────────────────────────────────────────────────────────────

type AsciiShaderController = { destroy: () => void };
type AsciiShaderOptions = Record<string, unknown>;

declare global {
  interface Window {
    AsciiShader?: {
      create: (
        canvas: HTMLCanvasElement,
        options: AsciiShaderOptions,
      ) => AsciiShaderController;
    };
  }
}

function webglSupported() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HomeHero({ services }: { services: readonly HomeService[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollTrackRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [useShader, setUseShader] = useState(false);
  const [serviceCardsStarted, setServiceCardsStarted] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<string>("16 / 9");
  const [fillTransform, setFillTransform] = useState({ scale: 1, y: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: scrollTrackRef,
    offset: ["start start", "end end"],
  });
  const timelineProgress = useTransform(scrollYProgress, [0, 1], [0, 0.75]);
  const copyY = useTransform(timelineProgress, [0.05, 0.28], [0, -240]);
  const copyOpacity = useTransform(timelineProgress, [0.05, 0.25], [1, 0]);
  const mediaScale = useTransform(
    timelineProgress,
    [0.3, 0.42],
    [1, fillTransform.scale],
  );
  const mediaY = useTransform(
    timelineProgress,
    [0.3, 0.42],
    [0, fillTransform.y],
  );
  const mediaRadius = useTransform(timelineProgress, [0.3, 0.42], [8, 0]);
  const inkOpacity = useTransform(timelineProgress, [0.42, 0.46], [0, 1]);
  const stageBackground = useTransform(
    timelineProgress,
    [0.42, 0.46],
    ["#F2F1E8", "#1A1B18"],
  );
  const servicesOpacity = useTransform(
    timelineProgress,
    [0.46, 0.5],
    [0, 1],
  );
  const servicesHeadingOpacity = useTransform(
    timelineProgress,
    [0.46, 0.5],
    [0, 1],
  );

  useMotionValueEvent(inkOpacity, "change", (progress) => {
    if (prefersReducedMotion) return;

    const root = document.documentElement;
    root.style.setProperty(
      "--home-hero-ink-progress",
      `${progress * 100}%`,
    );
    root.style.setProperty("--home-hero-ink-logo-opacity", `${1 - progress}`);
    root.style.setProperty("--home-hero-paper-logo-opacity", `${progress}`);
  });
  useMotionValueEvent(servicesOpacity, "change", (progress) => {
    if (prefersReducedMotion) return;
    document.documentElement.style.setProperty(
      "--home-services-progress",
      `${progress}`,
    );
  });
  useMotionValueEvent(servicesHeadingOpacity, "change", (progress) => {
    if (!prefersReducedMotion && progress > 0) setServiceCardsStarted(true);
  });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setUseShader(webglSupported());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isVideo = /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(HERO_IMAGE);
    if (isVideo) {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => {
        if (v.videoWidth && v.videoHeight) {
          setAspectRatio(`${v.videoWidth} / ${v.videoHeight}`);
        }
      };
      v.src = HERO_IMAGE;
    } else {
      const img = new window.Image();
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          setAspectRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
        }
      };
      img.src = HERO_IMAGE;
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const updateFillTransform = () => {
      const stage = stageRef.current;
      const media = mediaRef.current;
      if (!stage || !media) return;

      const width = media.offsetWidth;
      const height = media.offsetHeight;
      if (!width || !height) return;

      setFillTransform({
        scale: Math.max(stage.clientWidth / width, stage.clientHeight / height),
        y: stage.clientHeight / 2 - media.offsetTop - height / 2,
      });
    };

    updateFillTransform();
    const resizeObserver = new ResizeObserver(updateFillTransform);
    if (stageRef.current) resizeObserver.observe(stageRef.current);
    if (mediaRef.current) resizeObserver.observe(mediaRef.current);
    window.addEventListener("resize", updateFillTransform);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateFillTransform);
    };
  }, [aspectRatio, prefersReducedMotion]);

  useEffect(() => {
    const root = document.documentElement;
    const progress = prefersReducedMotion ? 0 : inkOpacity.get();
    root.style.setProperty("--home-hero-ink-progress", `${progress * 100}%`);
    root.style.setProperty("--home-hero-ink-logo-opacity", `${1 - progress}`);
    root.style.setProperty("--home-hero-paper-logo-opacity", `${progress}`);
    root.style.setProperty(
      "--home-services-progress",
      `${prefersReducedMotion ? 0 : servicesOpacity.get()}`,
    );

    return () => {
      root.style.removeProperty("--home-hero-ink-progress");
      root.style.removeProperty("--home-hero-ink-logo-opacity");
      root.style.removeProperty("--home-hero-paper-logo-opacity");
      root.style.removeProperty("--home-services-progress");
    };
  }, [inkOpacity, prefersReducedMotion, servicesOpacity]);

  useEffect(() => {
    if (!useShader || !scriptReady) return;
    const canvas = canvasRef.current;
    if (!canvas || !window.AsciiShader) return;

    let controller: AsciiShaderController | null = null;
    const compactViewport = window.matchMedia("(max-width: 767px)").matches;

    controller = window.AsciiShader.create(canvas, {
      source: HERO_IMAGE,
      effect: "bulge",
      strength: 0.4,
      radius: 110,
      cellSize: 5,
      gap: 0.3,
      // Tune between 1.2 and 1.7 if the subject needs more or less definition.
      contrast: 1.3,
      // Invert luminance so dark glyphs describe dark parts of the image.
      invert: false,
      fg: "#F2F1E8",
      bg: "#1A1B18",
      accent: "#298372",
      // Mobile keeps the same CSS-size grid while rendering fewer GPU pixels per frame.
      maxFps: compactViewport ? 20 : 30,
      maxDpr: compactViewport ? 1 : 2,
      fontFamily: spaceMono.style.fontFamily,
      respectReducedMotion: false,
      onError: (err: unknown) => console.error("[home-hero] shader error", err),
    });

    return () => {
      controller?.destroy();
    };
  }, [scriptReady, useShader]);

  return (
    <section
      ref={scrollTrackRef}
      aria-labelledby="home-hero-title"
      className={
        prefersReducedMotion ? styles.scrollTrackReduced : styles.scrollTrack
      }
    >
      <motion.div
        ref={stageRef}
        className={`${styles.hero} ${prefersReducedMotion ? styles.heroReduced : ""}`}
        style={
          prefersReducedMotion ? undefined : { backgroundColor: stageBackground }
        }
      >
        <motion.div
          className={styles.copy}
          style={
            prefersReducedMotion
              ? undefined
              : { y: copyY, opacity: copyOpacity }
          }
        >
          <div className={styles.copyInner}>
            <h1
              id="home-hero-title"
              className={`text-heading-2 sm:text-display md:text-heading-1 ${styles.title}`}
            >
              Premodus Labs is a technology company based in Malawi, building
              software and securing it for organizations anywhere.
            </h1>
            <ButtonLink href="/work" className={styles.cta}>
              See our work
            </ButtonLink>
          </div>
        </motion.div>
        <motion.div
          ref={mediaRef}
          className={`${styles.canvasContainer} rounded-lg`}
          style={{
            aspectRatio,
            ...(prefersReducedMotion
              ? {}
              : { y: mediaY, scale: mediaScale, borderRadius: mediaRadius }),
          }}
        >
          {useShader ? (
            <canvas
              id="hero-ascii"
              ref={canvasRef}
              className={styles.canvas}
              aria-hidden="true"
            />
          ) : (
            <Image
              src={HERO_FALLBACK_IMAGE}
              alt=""
              fill
              priority
              sizes="calc(100vw - 160px)"
              className={styles.fallback}
            />
          )}
          <motion.div
            aria-hidden="true"
            className={styles.inkOverlay}
            style={{ opacity: prefersReducedMotion ? 0 : inkOpacity }}
          />
        </motion.div>
        <motion.div
          className={
            prefersReducedMotion ? styles.servicesReduced : styles.servicesOverlay
          }
          style={{ opacity: prefersReducedMotion ? 1 : servicesOpacity }}
        >
          <div className={styles.servicesContent}>
            <motion.div
              style={{
                opacity: prefersReducedMotion ? 1 : servicesHeadingOpacity,
              }}
            >
              <h2 className="text-heading-3 sm:text-heading-2 font-semibold !text-inverse mb-4 sm:mb-10">
                World-class starts with how we treat each piece of the work.
              </h2>
            </motion.div>
            <div className="mt-4">
              <ServicesGrid
                services={services}
                started={serviceCardsStarted}
                animate={!prefersReducedMotion}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
      {useShader ? (
        <Script
          src="/scripts/ascii-shader.js"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
          onError={(e) => console.error("[home-hero] ascii-shader.js failed", e)}
        />
      ) : null}
    </section>
  );
}