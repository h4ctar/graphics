// @ts-check

import { init, clear, blit, triangle } from "../draw.js";
import { black, blue, green, red, yellow, magenta, cyan } from "../color.js";
import { clockwise, project, rotate } from "../math.js";

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

const triangles = [
    { a: 0, b: 1, c: 2, color: red },
    { a: 0, b: 3, c: 1, color: green },
    { a: 6, b: 5, c: 4, color: blue },
    { a: 5, b: 7, c: 4, color: yellow },
    { a: 0, b: 4, c: 7, color: magenta },
    { a: 0, b: 7, c: 3, color: cyan },
    { a: 0, b: 2, c: 6, color: red },
    { a: 0, b: 6, c: 4, color: green },
    { a: 6, b: 2, c: 1, color: blue },
    { a: 6, b: 1, c: 5, color: yellow },
    { a: 1, b: 3, c: 7, color: magenta },
    { a: 1, b: 7, c: 5, color: cyan },
];

let phi = 0;
let theta = 0;

init();

const loop = () => {
    clear(black);

    const rotated = poisitions.map((p) => rotate(p, phi, theta));
    const screen = rotated.map((r) => project(r));

    triangles
        .filter((t) => clockwise(screen[t.a], screen[t.b], screen[t.c]))
        .forEach((t) => triangle(screen[t.a], screen[t.b], screen[t.c], t.color));

    phi += 0.01;
    theta += 0.01;

    blit();

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);

