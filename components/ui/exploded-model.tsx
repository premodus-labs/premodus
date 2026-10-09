"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { animate } from "motion";
import {
  SUB,
  type ExplodedMesh,
  type ExplodedModelName,
  type ExplodedPart,
} from "@/lib/exploded/models";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";
import { EASE } from "@/lib/design/motion";

export type ExplodedModelProps = {
  model: ExplodedModelName;
  label?: string;
  className?: string;
};

const mix = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

const modelDescriptions: Record<ExplodedModelName, string> = {
  computer: "a computer",
  wall: "a wall",
  paper: "paper sheets and a pen",
  shield: "a shield",
};

export function ExplodedModel({
  model,
  label = "Service model",
  className = "",
}: ExplodedModelProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let renderer: THREE.WebGLRenderer | undefined;
    let fillMaterial: THREE.MeshBasicMaterial | undefined;
    let lineMaterial: THREE.LineBasicMaterial | undefined;
    let resizeObserver: ResizeObserver | undefined;
    const observerCleanup: { current: (() => void) | undefined } = {
      current: undefined,
    };
    const animations: Array<() => void> = [];
    const geometries = new Set<THREE.BufferGeometry>();
    const groups: Array<{
      group: THREE.Group;
      explodedPosition: THREE.Vector3;
      explodedRotation: THREE.Euler;
      bounds: THREE.Box3;
    }> = [];

    const cleanup = () => {
      if (disposed) return;
      disposed = true;
      observerCleanup.current?.();
      resizeObserver?.disconnect();
      animations.forEach((stop) => stop());
      host.replaceChildren();

      geometries.forEach((geometry) => geometry.dispose());
      fillMaterial?.dispose();
      lineMaterial?.dispose();
      renderer?.dispose();
      renderer?.forceContextLoss();
    };

    const initialize = () => {
      if (disposed || renderer) return;

      try {
        const canvas = document.createElement("canvas");
        const compactViewport = window.matchMedia("(max-width: 767px)").matches;
        const maxPixelRatio = compactViewport ? 1.5 : 2;
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
        lineMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color("#000000"),
        });

        const definitions = SUB[model]();
        definitions.forEach((part: ExplodedPart, index) => {
          const [, meshes, explodeVector] = part;
          const group = new THREE.Group();
          const explodedPosition = new THREE.Vector3(...explodeVector);
          const explodedRotation = new THREE.Euler(
            (((index % 3) - 1) * 12 * Math.PI) / 180,
            ((index % 2 === 0 ? 1 : -1) * 14 * Math.PI) / 180,
            (((index % 4) - 1.5) * 8 * Math.PI) / 180,
          );

          meshes.forEach((mesh: ExplodedMesh) => {
            const [geometry, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0] = mesh;
            geometries.add(geometry);
            const fill = new THREE.Mesh(geometry, fillMaterial);
            fill.position.set(x, y, z);
            fill.rotation.set(rx, ry, rz);
            group.add(fill);

            const edges = new THREE.EdgesGeometry(geometry, 8);
            geometries.add(edges);
            const edge = new THREE.LineSegments(edges, lineMaterial);
            edge.position.set(x, y, z);
            edge.rotation.set(rx, ry, rz);
            group.add(edge);
          });

          const bounds = new THREE.Box3().setFromObject(group);
          groups.push({ group, explodedPosition, explodedRotation, bounds });
          group.position.copy(explodedPosition);
          group.rotation.copy(explodedRotation);
          content.add(group);
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
        const render = () => {
          if (!disposed) renderer?.render(scene, camera);
        };
        const resize = () => {
          if (disposed || !renderer) return;
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
          render();
        };

        host.replaceChildren(canvas);
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        resize();

        if (prefersReducedMotion) {
          groups.forEach(({ group }) => {
            group.position.set(0, 0, 0);
            group.rotation.set(0, 0, 0);
          });
          render();
          return;
        }

        groups.forEach(({ group, explodedPosition, explodedRotation }, index) => {
          const animation = animate(0, 1, {
            duration: 1,
            delay: index * 0.035,
            ease: EASE,
            onUpdate: (progress) => {
              group.position.set(
                mix(explodedPosition.x, 0, progress),
                mix(explodedPosition.y, 0, progress),
                mix(explodedPosition.z, 0, progress),
              );
              group.rotation.set(
                mix(explodedRotation.x, 0, progress),
                mix(explodedRotation.y, 0, progress),
                mix(explodedRotation.z, 0, progress),
              );
              render();
            },
          });
          animations.push(() => animation.stop());
        });
      } catch (error) {
        cleanup();
        console.error("Unable to initialize the exploded model renderer.", error);
      }
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        intersectionObserver.disconnect();
        initialize();
      },
      { threshold: 0.05 },
    );
    observerCleanup.current = () => intersectionObserver.disconnect();
    intersectionObserver.observe(host);

    return cleanup;
  }, [model, prefersReducedMotion]);

  return (
    <div
      className={`relative h-full w-full ${className}`}
      role="img"
      aria-label={`${label}: exploded wireframe of ${modelDescriptions[model]}`}
    >
      <div ref={hostRef} aria-hidden="true" className="absolute inset-0" />
    </div>
  );
}
