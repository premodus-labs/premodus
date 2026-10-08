"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { ButtonLink } from "@/components/ui/button";
import { SectionTransition } from "@/components/ui/section-transition";
import { spaceMono } from "@/lib/design/fonts";
import styles from "./home-hero.module.css";

// ── Tweak this ──────────────────────────────────────────────
const HERO_IMAGE = "/media/image.png";
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

export function HomeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!scriptReady) return;
    const canvas = canvasRef.current;
    if (!canvas || !window.AsciiShader) return;

    let controller: AsciiShaderController | null = null;
    const compactViewport = window.matchMedia("(max-width: 767px)").matches;

    controller = window.AsciiShader.create(canvas, {
      source: HERO_IMAGE,
      effect: "bulge",
      strength: 0.4,
      radius: 110,
      cellSize: 10,
      gap: 0.3,
      // Tune between 1.2 and 1.7 if the subject needs more or less definition.
      contrast: 1.7,
      // Invert luminance so dark glyphs describe dark parts of the image.
      invert: true,
      fg: "#1A1A1A",
      bg: "#FFFFFF",
      accent: "#298372",
      ramp: " .:-=+*#%@", // glyphs Space Mono actually has
      // Mobile keeps the same CSS-size grid while rendering fewer GPU pixels per frame.
      maxFps: compactViewport ? 20 : 30,
      maxDpr: compactViewport ? 1 : 2,
      fontFamily: spaceMono.style.fontFamily,
      respectReducedMotion: true,
      onError: (err: unknown) => console.error("[home-hero] shader error", err),
    });

    return () => {
      controller?.destroy();
    };
  }, [scriptReady]);

  return (
    <SectionTransition
      animateOnView={false}
      className={styles.hero}
      aria-labelledby="home-hero-title"
    >
      <canvas
        id="hero-ascii"
        ref={canvasRef}
        className={styles.canvas}
        aria-hidden="true"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.copy}>
        <div className={styles.copyInner}>
          <h1 id="home-hero-title" className={`text-heading-2 ${styles.title}`}>
            World-class technology for Malawi’s overlooked problems.
          </h1>
          <p className={`text-body ${styles.subhead}`}>
            We build technology at a world-class standard to solve the problems
            Malawi’s tech industry has overlooked.
          </p>
          <ButtonLink href="/contact" className={styles.cta}>
            Get in touch
          </ButtonLink>
        </div>
      </div>
      <Script
        src="/scripts/ascii-shader.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={(e) => console.error("[home-hero] ascii-shader.js failed", e)}
      />
    </SectionTransition>
  );
}
