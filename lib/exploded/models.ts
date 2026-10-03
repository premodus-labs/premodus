import * as THREE from "three";

export type ExplodedModelName = "computer" | "wall" | "paper" | "shield";

export type ExplodedMesh = [
  THREE.BufferGeometry,
  number?,
  number?,
  number?,
  number?,
  number?,
  number?,
];

export type ExplodedPart = [
  string,
  ExplodedMesh[],
  [number, number, number],
];

export const B = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
export const Cy = (a: number, b: number, h: number, s = 16) =>
  new THREE.CylinderGeometry(a, b, h, s);
export const Sp = (r: number, w = 14, h = 10) => new THREE.SphereGeometry(r, w, h);
const mesh = (
  geometry: THREE.BufferGeometry,
  x = 0,
  y = 0,
  z = 0,
  rx = 0,
  ry = 0,
  rz = 0,
): ExplodedMesh => [geometry, x, y, z, rx, ry, rz];

export const so = <T extends THREE.Shape | THREE.Path>(p: T, k: number): T => {
  const y = (v: number) => v * k - 0.35 * (1 - k);
  const x = (v: number) => v * k;

  p.moveTo(x(-1), y(1.2));
  p.lineTo(x(1), y(1.2));
  p.lineTo(x(1), y(0));
  p.bezierCurveTo(x(1), y(-0.9), x(0.4), y(-1.5), 0, y(-1.9));
  p.bezierCurveTo(x(-0.4), y(-1.5), x(-1), y(-0.9), x(-1), y(0));
  p.closePath();
  return p;
};

export const ex = (s: THREE.Shape, d: number) => {
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 10 });
  g.translate(0, 0, -d / 2);
  return g;
};

export const ring = () => {
  const outer = so(new THREE.Shape(), 1);
  const inner = so(new THREE.Path(), 0.82);
  outer.holes.push(inner as unknown as THREE.Path);
  return ex(outer, 0.14);
};

export const SUB: Record<ExplodedModelName, () => ExplodedPart[]> = {
  computer: () => {
    const X = 1.8;
    const M = -1.9;
    const keys: ExplodedMesh[] = [0, 1, 2].map(
      (r): ExplodedMesh => mesh(B(1.9, 0.04, 0.12), -0.1, 0.095, 1.75 + r * 0.17),
    );
    const ms = Sp(0.22, 10, 8);
    ms.scale(1, 0.5, 1.4);

    const items: ExplodedPart[] = [
      ["monitor base", [[B(1.2, 0.06, 0.8), M, 0.03, 0]], [0, 0, 0]],
      ["stand", [[Cy(0.1, 0.1, 0.9, 10), M, 0.5, -0.05]], [0, 0.6, 0]],
      ["frame", [[B(2.4, 1.5, 0.1), M, 1.9, 0]], [0, 1.3, 0]],
      ["screen", [[B(2.15, 1.25, 0.04), M, 1.9, 0.07], [Sp(0.04, 6, 5), M, 2.55, 0.05]], [0, 1.3, 0.7]],
      ["power supply", [[B(1.4, 0.45, 1.4), X, 0.225, 0]], [0, 0, 0]],
      ["drives", [[B(1.1, 0.22, 0.9), X, 0.6, 0], [B(1.1, 0.22, 0.9), X, 0.88, 0]], [0, 0.5, 0]],
      ["motherboard", [[B(1.5, 0.05, 1.5), X, 1.05, 0], [B(0.3, 0.15, 0.5), X - 0.6, 1.15, -0.5]], [0, 1.1, 0]],
      [
        "cpu cooler",
        [
          mesh(Cy(0.3, 0.3, 0.3, 14), X, 1.25, 0),
          ...[0, 1, 2].map((i): ExplodedMesh => mesh(Cy(0.36, 0.36, 0.03, 14), X, 1.4 + i * 0.08, 0)),
        ],
        [0, 1.7, 0],
      ],
      [
        "memory",
        [0, 1].map((i): ExplodedMesh => mesh(B(0.08, 0.45, 0.8), X + 0.5 + i * 0.14, 1.3, 0.2)),
        [0, 2.3, 0],
      ],
      [
        "fan",
        [
          mesh(Cy(0.6, 0.6, 0.15, 20), X, 1.8, 0),
          mesh(Cy(0.18, 0.18, 0.2, 12), X, 1.8, 0),
          ...[0, 1, 2].map((i): ExplodedMesh => mesh(B(0.8, 0.04, 0.16), X, 1.8, 0, 0, 0, i * 1.047)),
        ],
        [0, 2.9, 0],
      ],
      ["cover", [[B(1.5, 0.12, 1.5), X, 2.0, 0]], [0, 3.5, 0]],
      ["keyboard", [[B(2, 0.07, 0.65), -0.1, 0.035, 1.9], ...keys], [0, 0, 1.2]],
      ["mouse", [[ms, 1.5, 0.1, 1.9]], [1.2, 0, 0.8]],
    ];

    return items;
  },
  shield: () => {
    const rivets: ExplodedMesh[] = [[-0.82, 1.0], [0.82, 1.0], [-0.82, 0.1], [0.82, 0.1], [-0.5, -0.9], [0.5, -0.9]].map(
      ([x, y]) => [Cy(0.06, 0.06, 0.08, 8), x, y, 0.2, Math.PI / 2],
    );

    return [
      ["strap", [[B(0.22, 1.5, 0.08), 0, 0.3, -0.3], [B(1.2, 0.2, 0.08), 0, 0.95, -0.3]], [0, 0, -1.1]],
      ["backing", [[ex(so(new THREE.Shape(), 1), 0.1), 0, 0, 0]], [0, 0, 0]],
      ["rim", [[ring(), 0, 0, 0.12]], [0, 0, 0.8]],
      ["rivets", rivets, [0, 0, 1.4]],
      ["face plate", [[ex(so(new THREE.Shape(), 0.8), 0.08), 0, 0, 0.2]], [0, 0, 1.8]],
      ["emblem", [[B(0.2, 1.4, 0.08), 0, -0.1, 0.3], [B(1.1, 0.2, 0.08), 0, 0.15, 0.3]], [0, 0, 2.5]],
      ["boss", [[Sp(0.32), 0, 0.15, 0.45]], [0, 0, 3.2]],
    ] as ExplodedPart[];
  },
  wall: () => {
    const rows: ExplodedPart[] = [0, 1, 2, 3].map((r) => {
      const meshes: ExplodedMesh[] = [];
      const y = 0.65 + 0.5 * r;

      if (r % 2 === 0) {
        for (let i = 0; i < 4; i += 1) meshes.push([B(1.2, 0.46, 1), (i - 1.5) * 1.27, y, 0]);
      } else {
        for (let i = 0; i < 3; i += 1) meshes.push([B(1.2, 0.46, 1), (i - 1) * 1.27, y, 0]);
        [-1, 1].forEach((s) => meshes.push([B(0.6, 0.46, 1), s * 2.2, y, 0]));
      }

      return ["row " + (r + 1), meshes, [0, 0.7 * (r + 1), 0]] as ExplodedPart;
    });

    return [
      ["foundation", [[B(5.2, 0.4, 1.3), 0, 0.2, 0]], [0, 0, 0]],
      ...rows,
      ["cap", [[B(5.2, 0.2, 1.3), 0, 2.55, 0]], [0, 3.6, 0]],
    ] as ExplodedPart[];
  },
  paper: () => {
    const PX = 2.7;
    const lines: ExplodedMesh[] = [0, 1, 2, 3, 4, 5, 6, 7].map(
      (i) => [B(2.2, 0.012, 0.04), 0, 0.19, -1.4 + i * 0.35],
    );

    return [
      ["board", [[B(3, 0.08, 4), 0, 0.04, 0]], [0, 0, 0]],
      ["sheet 1", [[B(2.8, 0.02, 3.8), 0, 0.11, 0]], [0, 0.5, 0]],
      ["sheet 2", [[B(2.8, 0.02, 3.8), 0, 0.14, 0]], [0, 1, 0]],
      ["sheet 3", [[B(2.8, 0.02, 3.8), 0, 0.17, 0]], [0, 1.5, 0]],
      ["handwriting", lines, [0, 2, 0]],
      ["binder clip", [[B(0.7, 0.3, 0.3), 0, 0.3, -1.9]], [0, 2.4, -0.4]],
      ["pen nib", [[Cy(0.08, 0, 0.35, 10), PX, 0.18, 0]], [0, 0, 0]],
      ["pen grip", [[Cy(0.11, 0.08, 0.5, 12), PX, 0.6, 0]], [0, 0.5, 0]],
      ["pen barrel", [[Cy(0.12, 0.12, 1.6, 12), PX, 1.65, 0]], [0, 1.1, 0]],
      ["pen clip", [[B(0.04, 0.9, 0.07), PX + 0.14, 2.1, 0]], [0.6, 1.5, 0]],
      ["pen cap", [[Cy(0.12, 0.12, 0.5, 12), PX, 2.7, 0]], [0, 1.9, 0]],
      ["click button", [[Sp(0.1, 8, 6), PX, 3, 0]], [0, 2.6, 0]],
    ] as ExplodedPart[];
  },
};
