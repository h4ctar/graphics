// @ts-check

import { init, clear, blit, affineTriangle } from "../lib/draw.js";
import { black } from "../lib/color.js";
import { clockwise, project, rotate } from "../lib/math.js";
import { loop } from "../lib/loop.js";

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

const texture = new ImageData(64, 64);
const textureImage = new Image();
textureImage.src = "../texture/crate.png";
textureImage.onload = () => {
    const offscreenCanvas = new OffscreenCanvas(64, 64);
    const offscreenContext = offscreenCanvas.getContext("2d");
    offscreenContext.drawImage(textureImage, 0, 0);
    const imageData = offscreenContext.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    texture.data.set(imageData.data);
};

init();

loop(() => {
    clear(black);

    const rotated = poisitions.map((p) => rotate(p, phi, theta));
    const screen = rotated.map((r) => project(r));

    triangles
        .filter((t) => clockwise(screen[t.a], screen[t.b], screen[t.c]))
        .forEach((t) => affineTriangle(screen[t.a], t.ta, screen[t.b], t.tb, screen[t.c], t.tc, texture));

    phi += 0.01;
    theta += 0.01;

    blit();
});
