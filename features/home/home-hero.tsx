"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { ButtonLink } from "@/components/ui/button";
import { SectionTransition } from "@/components/ui/section-transition";
import { spaceMono } from "@/lib/design/fonts";
import type { RegionName } from "@/lib/constants/geo";
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

export function HomeHero({ region }: { region: RegionName }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [useShader, setUseShader] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<string>("16 / 9");

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
      fg: "#FFFFFF",
      bg: "#1A1A1A",
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
    <SectionTransition
      animateOnView={false}
      className={styles.hero}
      aria-labelledby="home-hero-title"
    >
      <div className={styles.canvasContainer} style={{ aspectRatio }}>
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
            sizes="(max-width: 767px) 100vw, 60vw"
            className={styles.fallback}
          />
        )}
      </div>
      <div className={styles.copy}>
        <div className={styles.copyInner}>
          <h1 id="home-hero-title" className={`text-display md:text-heading-1 ${styles.title}`}>
            World-class technology for {region}’s overlooked problems.
          </h1>
          <ButtonLink href="/contact" className={styles.cta}>
            Get in touch
          </ButtonLink>
        </div>
      </div>
      {useShader ? (
        <Script
          src="/scripts/ascii-shader.js"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
          onError={(e) => console.error("[home-hero] ascii-shader.js failed", e)}
        />
      ) : null}
    </SectionTransition>
  );
}