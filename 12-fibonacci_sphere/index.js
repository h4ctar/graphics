// @ts-check
/**
 * https://www.openprocessing.org/sketch/41142
 * @typedef { import("../lib/math").Point3 } Point3
 */

import { init, clear, blit, wu } from "../lib/draw.js";
import { black } from "../lib/color.js";
import { rotate, project } from "../lib/math.js";
import { loop } from "../lib/loop.js";

init();

const radius = 0.8 * 200 / 2;

const goldenRatio = Math.sqrt(5) / 2 - 0.5;
const goldenAngle = goldenRatio * 2 * Math.PI;

const nbrPoints = 1000;

let phi = 0;
let theta = 0;

/** @type { Point3[] } */
const points = new Array(nbrPoints);

for (let i = 0; i < points.length; i++) {
    const lat = Math.asin(2 * i / nbrPoints - 1);
    const lon = goldenAngle * i;
    points[i] = rotate({ x: radius, y: 0, z: 0 }, lon, lat);
}

loop(() => {
    clear(black);

    for (const point of points) {
        const rotated = rotate(point, phi, theta);
        const screen = project(rotated);

        wu(screen, 255);
    }

    phi += 0.01;
    theta += 0.01;

    blit();
});
