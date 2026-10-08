"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  animate,
  cancelFrame,
  frame,
  inView,
  interpolate,
  cubicBezier,
  springValue,
  transformValue,
} from "motion";
import { threeEffect } from "motion/three";
import type { MotionValue } from "motion/react";
import {
  SUB,
  type ExplodedMesh,
  type ExplodedModelName,
  type ExplodedPart,
} from "@/lib/exploded/models";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";
import { EASE, MOTION } from "@/lib/design/motion";

animate.addEffect(threeEffect);

export type ExplodedModelProps = {
  model: ExplodedModelName;
  progress: MotionValue<number>;
  fallbackImage: string;
  label?: string;
  className?: string;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const mix = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;
const ease = interpolate([0, 1], [0, 1], { ease: cubicBezier(...EASE) });

const modelDescriptions: Record<ExplodedModelName, string> = {
  computer: "a computer",
  wall: "a wall",
  paper: "paper sheets and a pen",
  shield: "a shield",
};

export function ExplodedModel({
  model,
  progress,
  fallbackImage,
  label = "Service model",
  className = "",
}: ExplodedModelProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let renderer: THREE.WebGLRenderer | undefined;
    let fillMaterial: THREE.MeshBasicMaterial | undefined;
    let lineMaterial: THREE.LineBasicMaterial | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let stopInView: (() => void) | undefined;
    let smoothProgress: MotionValue<number> | undefined;
    let render = () => {};
    const effectCleanups: Array<() => void> = [];
    const groups: Array<{
      group: THREE.Group;
      explodedPosition: THREE.Vector3;
      bounds: THREE.Box3;
    }> = [];

    const cleanup = () => {
      if (disposed) return;
      disposed = true;
      stopInView?.();
      cancelFrame(render);
      resizeObserver?.disconnect();
      effectCleanups.forEach((stop) => stop());
      smoothProgress?.destroy();
      host.replaceChildren();

      groups.forEach(({ group }) => {
        group.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
            object.geometry.dispose();
          }
          if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];
            materials.forEach((material) => {
              if ("map" in material && material.map instanceof THREE.Texture) {
                material.map.dispose();
              }
            });
          }
        });
      });
      fillMaterial?.dispose();
      lineMaterial?.dispose();
      renderer?.dispose();
      renderer?.forceContextLoss();
    };

    try {
      const canvas = document.createElement("canvas");
      const compactViewport = window.matchMedia("(max-width: 767px)").matches;
      const maxPixelRatio = compactViewport ? 1 : 1.5;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: compactViewport ? "low-power" : "high-performance",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -200, 200);
      camera.position.set(0, 0, 20);
      const pitch = new THREE.Group();
      const yaw = new THREE.Group();
      const content = new THREE.Group();
      pitch.rotation.x = 0.58;
      yaw.rotation.y = -0.7;
      scene.add(pitch);
      pitch.add(yaw);
      yaw.add(content);

      fillMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ffffff"),
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });
      lineMaterial = new THREE.LineBasicMaterial({ color: new THREE.Color("#000000") });

      smoothProgress = springValue(progress, {
        stiffness: MOTION.modelScrollStiffness,
        damping: MOTION.modelScrollDamping,
        mass: MOTION.modelScrollMass,
      });
      const definitions = SUB[model]();
      definitions.forEach((part: ExplodedPart, index) => {
        const [, meshes, explodeVector] = part;
        const group = new THREE.Group();
        const explodedPosition = new THREE.Vector3(...explodeVector);
        const bounds = new THREE.Box3();
        groups.push({ group, explodedPosition, bounds });

        meshes.forEach((mesh: ExplodedMesh) => {
          const [geometry, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0] = mesh;
          const fill = new THREE.Mesh(geometry, fillMaterial);
          fill.position.set(x, y, z);
          fill.rotation.set(rx, ry, rz);
          group.add(fill);

          const edge = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry, 8),
            lineMaterial,
          );
          edge.position.set(x, y, z);
          edge.rotation.set(rx, ry, rz);
          group.add(edge);
        });

        bounds.setFromObject(group);
        group.position.copy(explodedPosition);
        content.add(group);

        const start = definitions.length > 1
          ? (index / (definitions.length - 1)) * MOTION.modelPartStagger
          : 0;
        const end = Math.min(1, start + MOTION.modelPartAssemblyWindow);
        const partProgress = transformValue(() => {
          const normalized = clamp((smoothProgress!.get() - start) / (end - start));
          return ease(normalized);
        });
        const bind = threeEffect(group, {
          x: transformValue(() =>
            mix(explodedPosition.x, 0, partProgress.get()),
          ),
          y: transformValue(() =>
            mix(explodedPosition.y, 0, partProgress.get()),
          ),
          z: transformValue(() =>
            mix(explodedPosition.z, 0, partProgress.get()),
          ),
          rotateX: transformValue(() =>
            mix(((index % 3) - 1) * 12, 0, partProgress.get()),
          ),
          rotateY: transformValue(() =>
            mix((index % 2 === 0 ? 1 : -1) * 14, 0, partProgress.get()),
          ),
          rotateZ: transformValue(() =>
            mix(((index % 4) - 1.5) * 8, 0, partProgress.get()),
          ),
        });
        effectCleanups.push(bind);
      });

      const modelBounds = new THREE.Box3();
      groups.forEach(({ bounds, explodedPosition }) => {
        modelBounds.union(bounds);
        modelBounds.union(bounds.clone().translate(explodedPosition));
      });
      modelBounds.getCenter(content.position).multiplyScalar(-1);

      const projectedBounds = new THREE.Box3();
      const modelRotation = new THREE.Matrix4()
        .makeRotationX(0.58)
        .multiply(new THREE.Matrix4().makeRotationY(-0.7));
      for (const x of [modelBounds.min.x, modelBounds.max.x]) {
        for (const y of [modelBounds.min.y, modelBounds.max.y]) {
          for (const z of [modelBounds.min.z, modelBounds.max.z]) {
            projectedBounds.expandByPoint(
              new THREE.Vector3(x, y, z).applyMatrix4(modelRotation),
            );
          }
        }
      }
      const projectedSize = projectedBounds.getSize(new THREE.Vector3());

      render = () => {
        if (!disposed && renderer) renderer.render(scene, camera);
      };
      const resize = () => {
        if (!renderer || disposed) return;
        const width = host.clientWidth || 1;
        const height = host.clientHeight || 1;
        const aspect = width / height;
        const halfHeight =
          Math.max(projectedSize.y / 2, projectedSize.x / (2 * aspect)) * 1.06;
        camera.left = -halfHeight * aspect;
        camera.right = halfHeight * aspect;
        camera.top = halfHeight;
        camera.bottom = -halfHeight;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
        renderer.setSize(width, height, false);
        frame.render(render);
      };

      host.replaceChildren(canvas);
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();
      stopInView = inView(
        host,
        () => {
          setReady(true);
          frame.render(render, true);
          return () => cancelFrame(render);
        },
        { amount: 0.05 },
      );

      return cleanup;
    } catch (error) {
      cleanup();
      console.error("Unable to initialize the exploded model renderer.", error);
      return undefined;
    }
  }, [model, prefersReducedMotion, progress]);

  return (
    <div
      className={`relative h-full w-full ${className}`}
      role="img"
      aria-label={`${label}: exploded wireframe of ${modelDescriptions[model]} assembling`}
    >
      {!ready || prefersReducedMotion ? (
        <Image
          src={fallbackImage}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      ) : null}
      <div
        ref={hostRef}
        aria-hidden="true"
        className="absolute inset-0"
        style={{ opacity: ready && !prefersReducedMotion ? 1 : 0 }}
      />
    </div>
  );
}
