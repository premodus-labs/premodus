"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  SUB,
  type ExplodedMesh,
  type ExplodedModelName,
  type ExplodedPart,
} from "@/lib/exploded/models";
import { MOTION } from "@/lib/design/motion";

export type ExplodedModelProps = {
  model: ExplodedModelName;
  getProgress: () => number;
  fallbackImage?: string;
  label?: string;
  className?: string;
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const modelDescriptions: Record<ExplodedModelName, string> = {
  computer: "a computer",
  wall: "a wall",
  paper: "paper sheets and a pen",
  shield: "a shield",
};

export function ExplodedModel({
  model,
  getProgress,
  fallbackImage,
  label = "Service model",
  className = "",
}: ExplodedModelProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [supportsWebGL] = useState(() =>
    typeof window !== "undefined" && "WebGLRenderingContext" in window,
  );
  const [webglFailed, setWebglFailed] = useState(false);
  const fallbackVisible = !supportsWebGL || webglFailed;

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !supportsWebGL) return;

    let frameId = 0;
    let disposed = false;
    let renderer: THREE.WebGLRenderer | undefined;
    let fillMaterial: THREE.MeshBasicMaterial | undefined;
    let lineMaterial: THREE.LineBasicMaterial | undefined;
    let parts: Array<{
      group: THREE.Group;
      explodeVector: THREE.Vector3;
      box: THREE.Box3;
    }> = [];
    let resizeObserver: ResizeObserver | undefined;
    let visibilityObserver: IntersectionObserver | undefined;
    let themeObserver: MutationObserver | undefined;
    let onColorSchemeChange: (() => void) | undefined;
    let colorScheme: MediaQueryList | undefined;
    let isVisible = false;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      const canvas = document.createElement("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      host.replaceChildren(canvas);

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -200, 200);
      camera.position.set(0, 0, 20);

      const pitch = new THREE.Group();
      const yaw = new THREE.Group();
      const scn = new THREE.Group();
      pitch.rotation.x = 0.58;
      yaw.rotation.y = -0.7;
      scene.add(pitch);
      pitch.add(yaw);
      yaw.add(scn);

      fillMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ffffff"),
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });
      lineMaterial = new THREE.LineBasicMaterial({ color: new THREE.Color("#000000") });

      parts = SUB[model]().map((part: ExplodedPart) => {
        const [, meshes, explodeVector] = part;
        const group = new THREE.Group();

        meshes.forEach((mesh: ExplodedMesh) => {
          const [geometry, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0] = mesh;
          const fill = new THREE.Mesh(geometry, fillMaterial);
          const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 8), lineMaterial);
          fill.position.set(x, y, z);
          fill.rotation.set(rx, ry, rz);
          edge.position.set(x, y, z);
          edge.rotation.set(rx, ry, rz);
          group.add(fill, edge);
        });

        const box = new THREE.Box3().setFromObject(group);
        scn.add(group);

        return { group, explodeVector: new THREE.Vector3(...explodeVector), box };
      });

      const explodedBounds = new THREE.Box3();
      parts.forEach((part) => {
        explodedBounds.union(part.box.clone().translate(part.explodeVector));
      });
      const explodedSize = explodedBounds.getSize(new THREE.Vector3());
      let currentProgress = 0;

      const setCameraSize = () => {
        if (!renderer || disposed) return;
        const width = host.clientWidth || 1;
        const height = host.clientHeight || 1;
        const aspect = width / height;
        const halfHeight =
          Math.max(explodedSize.y / 2, explodedSize.x / (2 * aspect), explodedSize.length() / 3) *
          1.12;
        camera.left = -halfHeight * aspect;
        camera.right = halfHeight * aspect;
        camera.top = halfHeight;
        camera.bottom = -halfHeight;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height, false);
      };

      const syncTheme = () => {
        if (!fillMaterial || !lineMaterial || disposed) return;
        const current = getComputedStyle(document.documentElement);
        fillMaterial.color.set(current.getPropertyValue("--canvas").trim() || "#ffffff");
        lineMaterial.color.set(current.getPropertyValue("--surface").trim() || "#000000");
      };

      const bounds = new THREE.Box3();
      const center = new THREE.Vector3();
      const render = () => {
        if (disposed || !renderer) return;
        const targetProgress = prefersReducedMotion ? 1 : clamp(getProgress());
        currentProgress = prefersReducedMotion
          ? 1
          : currentProgress + (targetProgress - currentProgress) * 0.08;

        parts.forEach((part, index) => {
            const maxStagger = Math.max(0, (parts.length - 1) * MOTION.modelPartStagger);
          const staggeredProgress = clamp(
              (currentProgress - index * MOTION.modelPartStagger) /
                Math.max(0.01, 1 - maxStagger),
          );
          const easedProgress =
            staggeredProgress < 0.5
              ? 4 * staggeredProgress ** 3
              : 1 - ((-2 * staggeredProgress + 2) ** 3) / 2;
          const explodedAmount = 1 - easedProgress;
          part.group.position.copy(part.explodeVector).multiplyScalar(explodedAmount);
        });

        bounds.makeEmpty();
        parts.forEach((part) => {
          const partBounds = part.box.clone();
          partBounds.translate(part.group.position);
          bounds.union(partBounds);
        });
        if (!bounds.isEmpty()) {
          bounds.getCenter(center);
          scn.position.copy(center).multiplyScalar(-1);
        }

        renderer.render(scene, camera);
        if (!prefersReducedMotion) frameId = window.requestAnimationFrame(render);
      };

      const startRender = () => {
        if (frameId || disposed) return;
        if (prefersReducedMotion) render();
        else frameId = window.requestAnimationFrame(render);
      };
      const stopRender = () => {
        if (!frameId) return;
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      };

      resizeObserver = new ResizeObserver(() => {
        setCameraSize();
        if (prefersReducedMotion && isVisible) render();
      });
      resizeObserver.observe(host);

      visibilityObserver = new IntersectionObserver(
        (entries) => {
          isVisible = entries.some((entry) => entry.isIntersecting);
          if (isVisible) startRender();
          else stopRender();
        },
        { threshold: 0.05 },
      );
      visibilityObserver.observe(host);

      themeObserver = new MutationObserver(syncTheme);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "class"],
      });
      colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
      onColorSchemeChange = syncTheme;
      colorScheme.addEventListener("change", onColorSchemeChange);

      syncTheme();
      setCameraSize();
      if (isVisible) startRender();

      return () => {
        disposed = true;
        stopRender();
        resizeObserver?.disconnect();
        visibilityObserver?.disconnect();
        themeObserver?.disconnect();
        if (onColorSchemeChange) colorScheme?.removeEventListener("change", onColorSchemeChange);
        host.replaceChildren();
        parts.forEach(({ group }) => {
          group.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
              child.geometry.dispose();
            }
          });
        });
        fillMaterial?.dispose();
        lineMaterial?.dispose();
        renderer?.dispose();
        renderer?.forceContextLoss();
      };
    } catch (error) {
      console.error("Unable to initialize the exploded model renderer.", error);
      disposed = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      themeObserver?.disconnect();
      if (onColorSchemeChange) colorScheme?.removeEventListener("change", onColorSchemeChange);
      host.replaceChildren();
      parts.forEach(({ group }) => {
        group.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
            child.geometry.dispose();
          }
        });
      });
      fillMaterial?.dispose();
      lineMaterial?.dispose();
      renderer?.dispose();
      renderer?.forceContextLoss();
      window.queueMicrotask(() => setWebglFailed(true));
    }
  }, [getProgress, model, supportsWebGL]);

  if (fallbackVisible) {
    return (
      <div
        role="img"
        aria-label={label}
        className={`relative h-full w-full ${className}`}
      >
        {fallbackImage ? (
          <Image
            src={fallbackImage}
            alt={label}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label={`Exploded wireframe of ${modelDescriptions[model]} assembling`}
      className={`relative h-full w-full ${className}`}
    />
  );
}
