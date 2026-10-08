"use client";

import { useCallback, useEffect, useRef } from "react";
import Script from "next/script";
import { ButtonLink } from "@/components/ui/button";
import { SectionTransition } from "@/components/ui/section-transition";
import { spaceMono } from "@/lib/design/fonts";
import styles from "./home-hero.module.css";

type AsciiShaderController = {
  destroy: () => void;
};

type AsciiShaderOptions = {
  source: string;
  poster: string;
  effect: "bulge";
  strength: number;
  radius: number;
  cellSize: number;
  gap: number;
  contrast: number;
  fg: string;
  bg: string;
  accent: string;
  maxFps: number;
  maxDpr: number;
  fontFamily: string;
  respectReducedMotion: boolean;
};

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
  const controllerRef = useRef<AsciiShaderController | null>(null);

  const initializeShader = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!window.AsciiShader) {
      console.error("[home-hero] ascii-shader.js did not expose AsciiShader.");
      return;
    }

    controllerRef.current?.destroy();
    controllerRef.current = window.AsciiShader.create(canvas, {
      // Replace these paths when your hero media is ready.
      source: "/media/hero.mp4",
      poster: "/media/hero-poster.jpg",
      effect: "bulge",
      strength: 0.4,
      radius: 110,
      cellSize: 10,
      gap: 0.3,
      contrast: 1.5,
      fg: "#FFFFFF",
      bg: "#1A1A1A",
      accent: "#298372",
      maxFps: 30,
      maxDpr: 2,
      fontFamily: spaceMono.style.fontFamily,
      respectReducedMotion: true,
      // For cross-origin media, add crossOrigin: "anonymous" and enable CORS on its host.
    });
  }, []);

  const reportScriptError = useCallback((error: Error) => {
    console.error("[home-hero] Failed to load ascii-shader.js.", error);
  }, []);

  useEffect(
    () => () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    },
    [],
  );

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
          <h1 id="home-hero-title" className={`text-display ${styles.title}`}>
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
        onReady={initializeShader}
        onError={reportScriptError}
      />
    </SectionTransition>
  );
}
