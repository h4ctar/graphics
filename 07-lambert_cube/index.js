// @ts-check

import { init, clear, blit, triangle } from "../lib/draw.js";
import { black } from "../lib/color.js";
import { clockwise, project, rotate, dot, sub, cross, normalize } from "../lib/math.js";

// http://www.qbasicnews.com/tutorials.php?action=view&id=9
// https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-shading/diffuse-lambertian-shading
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
    { a: 0, b: 1, c: 2 },
    { a: 0, b: 3, c: 1 },
    { a: 6, b: 5, c: 4 },
    { a: 5, b: 7, c: 4 },
    { a: 0, b: 4, c: 7 },
    { a: 0, b: 7, c: 3 },
    { a: 0, b: 2, c: 6 },
    { a: 0, b: 6, c: 4 },
    { a: 6, b: 2, c: 1 },
    { a: 6, b: 1, c: 5 },
    { a: 1, b: 3, c: 7 },
    { a: 1, b: 7, c: 5 },
];

let phi = 0;
let theta = 0;

const ambient = 16;
const incident = 256 - 16;
const light = normalize({
    x: 1,
    y: 1,
    z: 1,
});

init();

const loop = () => {
    clear(black);

    const rotated = poisitions.map((p) => rotate(p, phi, theta));
    const screen = rotated.map((r) => project(r));

    triangles
        .filter((t) => clockwise(screen[t.a], screen[t.b], screen[t.c]))
        .forEach((t) => {
            const ab = sub(rotated[t.a], rotated[t.b]);
            const cb = sub(rotated[t.c], rotated[t.b]);
            const normal = normalize(cross(ab, cb));
            const diffuse = Math.max(incident * dot(normal, light), 0);
            const brightness = diffuse + ambient;
            triangle(screen[t.a], screen[t.b], screen[t.c], { index: Math.floor(brightness) });
        });

    phi += 0.01;
    theta += 0.01;

    blit();

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);

