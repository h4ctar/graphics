// @ts-check
/**
 * http://www.qbasicnews.com/tutorials.php?action=view&id=9
 */

import { init, clear, blit, line } from "../lib/draw.js";
import { black, white } from "../lib/color.js";
import { rotate, project } from "../lib/math.js";
import { loop } from "../lib/loop.js";

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

const lines = [
    { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 },
    { a: 1, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 5 },
    { a: 6, b: 5 }, { a: 6, b: 2 }, { a: 6, b: 4 },
    { a: 7, b: 4 }, { a: 7, b: 3 }, { a: 7, b: 5 },
];

let phi = 0;
let theta = 0;

init();

loop(() => {
    clear(black);

    const rotated = poisitions.map((p) => rotate(p, phi, theta));
    const screen = rotated.map((r) => project(r));

    lines.forEach((l) => line(screen[l.a], screen[l.b], white));

    phi += 0.01;
    theta += 0.01;

    blit();
});
