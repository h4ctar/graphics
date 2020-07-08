// @ts-check

import { init, clear, blit, line } from "../draw.js";
import { black, white } from "../color.js";

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

let phi = 0;
let theta = 0;

init();

setInterval(() => {
    clear(black);

    const rotated = poisitions.map((p) => ({
        x: -p.x * Math.sin(theta) + p.y * Math.cos(theta),
        y: -p.x * Math.cos(theta) * Math.sin(phi) - p.y * Math.sin(theta) * Math.sin(phi) - p.z * Math.cos(phi),
        z: -p.x * Math.cos(theta) * Math.cos(phi) - p.y * Math.sin(theta) * Math.cos(phi) + p.z * Math.sin(phi),
    }));

    const screen = rotated.map((r) => ({
        x: 256 * r.x / (r.z + 256) + 160,
        y: 256 * r.y / (r.z + 256) + 100,
    }));

    line(screen[0], screen[2], white);
    line(screen[0], screen[3], white);
    line(screen[0], screen[4], white);

    line(screen[1], screen[2], white);
    line(screen[1], screen[3], white);
    line(screen[1], screen[5], white);

    line(screen[6], screen[5], white);
    line(screen[6], screen[2], white);
    line(screen[6], screen[4], white);

    line(screen[7], screen[4], white);
    line(screen[7], screen[3], white);
    line(screen[7], screen[5], white);

    phi += 0.01;
    theta += 0.01;

    blit();
}, 16);
