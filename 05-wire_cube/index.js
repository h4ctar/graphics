// @ts-check

import { init, clear, blit, line } from "../draw.js";
import { black, white } from "../color.js";
import { rotate, project } from "../math.js";

// http://www.qbasicnews.com/tutorials.php?action=view&id=9
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

const loop = () => {
    clear(black);

    const rotated = poisitions.map((p) => rotate(p, phi, theta));
    const screen = rotated.map((r) => project(r));

    lines.forEach((l) => line(screen[l.a], screen[l.b], white));

    phi += 0.01;
    theta += 0.01;

    blit();

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);