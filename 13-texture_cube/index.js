// @ts-check

import { init, clear, blit, correctTriangle } from "../lib/draw.js";
import { black } from "../lib/color.js";
import { clockwise, project, rotate } from "../lib/math.js";
import { loop } from "../lib/loop.js";
import { loadTexture } from "../lib/texture.js";

const poisitions = [
    { x: 50, y: 50, z: -50 },
    { x: -50, y: -50, z: -50 },
    { x: -50, y: 50, z: -50 },
    { x: 50, y: -50, z: -50 },
    { x: 50, y: 50, z: 50 },
    { x: -50, y: -50, z: 50 },
    { x: -50, y: 50, z: 50 },
    { x: 50, y: -50, z: 50 },
];

const triangles = [
    { a: 0, b: 1, c: 2, ta: { u: 1, v: 0 }, tb: { u: 0, v: 1 }, tc: { u: 0, v: 0 } },
    { a: 0, b: 3, c: 1, ta: { u: 1, v: 0 }, tb: { u: 1, v: 1 }, tc: { u: 0, v: 1 } },
    { a: 6, b: 5, c: 4, ta: { u: 1, v: 0 }, tb: { u: 1, v: 1 }, tc: { u: 0, v: 0 } },
    { a: 5, b: 7, c: 4, ta: { u: 1, v: 1 }, tb: { u: 0, v: 1 }, tc: { u: 0, v: 0 } },
    { a: 0, b: 4, c: 7, ta: { u: 0, v: 0 }, tb: { u: 1, v: 0 }, tc: { u: 1, v: 1 } },
    { a: 0, b: 7, c: 3, ta: { u: 0, v: 0 }, tb: { u: 1, v: 1 }, tc: { u: 0, v: 1 } },
    { a: 0, b: 2, c: 6, ta: { u: 1, v: 1 }, tb: { u: 0, v: 1 }, tc: { u: 0, v: 0 } },
    { a: 0, b: 6, c: 4, ta: { u: 1, v: 1 }, tb: { u: 0, v: 0 }, tc: { u: 1, v: 0 } },
    { a: 6, b: 2, c: 1, ta: { u: 0, v: 0 }, tb: { u: 1, v: 0 }, tc: { u: 1, v: 1 } },
    { a: 6, b: 1, c: 5, ta: { u: 0, v: 0 }, tb: { u: 1, v: 1 }, tc: { u: 0, v: 1 } },
    { a: 1, b: 3, c: 7, ta: { u: 0, v: 0 }, tb: { u: 1, v: 0 }, tc: { u: 1, v: 1 } },
    { a: 1, b: 7, c: 5, ta: { u: 0, v: 0 }, tb: { u: 1, v: 1 }, tc: { u: 0, v: 1 } },
];

let phi = 0;
let theta = 0;

const texture = loadTexture("../texture/crate.png");

init();

loop(() => {
    clear(black);

    const rotated = poisitions.map((p) => rotate(p, phi, theta));
    const screen = rotated.map((r) => project(r));

    triangles
        .filter((t) => clockwise(screen[t.a], screen[t.b], screen[t.c]))
        .forEach((t) => {
            const pa = { ...screen[t.a], z: rotated[t.a].z + 256 };
            const pb = { ...screen[t.b], z: rotated[t.b].z + 256 };
            const pc = { ...screen[t.c], z: rotated[t.c].z + 256 };
            correctTriangle(
                { point: pa, texel: t.ta },
                { point: pb, texel: t.tb },
                { point: pc, texel: t.tc },
                texture
            );
        });

    phi += 0.01;
    theta += 0.01;

    blit();
});
