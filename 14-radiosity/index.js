// @ts-check
/**
 * @typedef {{ pos: Point3, u: number, v: number }} Patch
 * @typedef { import("../lib/draw").Texel } Texel
 * @typedef { import("../lib/color").Rgb } Rgb
 * @typedef { import("../lib/color").Color } Color
 */

import { init, clear, blit, correctTriangle, clipPolygon } from "../lib/draw.js";
import { black } from "../lib/color.js";
import { loop } from "../lib/loop.js";
import { project, clockwise, Point3 } from "../lib/math.js";
import { Matrix4 } from "../lib/matrix.js";
import { Camera } from "./camera.js";

const patchSize = 20;

/** @type {{
 *   pos: Point3,
 *   phi: number,
 *   theta: number,
 *   width: number,
 *   height: number,
 *   polygon: { point: Point3, texel: Texel }[],
 *   patches: { pos: Point3, texel: Texel }[]
 *   texture: ImageData,
 *   reflectance: Rgb,
 *   emission: Rgb,
 * }[]} */
const quads = [{
    pos: new Point3([-50, -50, -50]),
    phi: 0,
    theta: 0,
    width: 100,
    height: 100,
    polygon: [],
    patches: [],
    texture: new ImageData(100 / patchSize, 100 / patchSize),
    reflectance: { red: 1, green: 0, blue: 0 },
    emission: { red: 128, green: 0, blue: 0 },
},
{
    pos: new Point3([50, -50, 50]),
    phi: Math.PI,
    theta: 0,
    width: 100,
    height: 100,
    polygon: [],
    patches: [],
    texture: new ImageData(100 / patchSize, 100 / patchSize),
    reflectance: { red: 1, green: 0, blue: 0 },
    emission: { red: 0, green: 128, blue: 0 },
},
{
    pos: new Point3([10, -10, 40]),
    phi: Math.PI,
    theta: 0,
    width: 20,
    height: 20,
    polygon: [],
    patches: [],
    texture: new ImageData(20 / patchSize, 20 / patchSize),
    reflectance: { red: 0, green: 0, blue: 0 },
    emission: { red: 255, green: 255, blue: 255 },
}];

quads.forEach((quad) => {
    const matrix = Matrix4.yRotation(quad.phi);

    // precompute the corners of the quad
    quad.polygon = [
        { point: quad.pos, texel: { u: 0, v: 0 } },
        { point: quad.pos.add(matrix.transform({ x: quad.width, y: 0, z: 0 })), texel: { u: 1, v: 0 } },
        { point: quad.pos.add(matrix.transform({ x: quad.width, y: quad.height, z: 0 })), texel: { u: 1, v: 0 } },
        { point: quad.pos.add(matrix.transform({ x: 0, y: quad.height, z: 0 })), texel: { u: 1, v: 0 } },
    ];

    // precompute the positions of the patches in the quad
    for (let v = 0; v < quad.height / patchSize; v++) {
        for (let u = 0; u < quad.width / patchSize; u++) {
            const pos = quad.pos.add(matrix.transform({
                x: patchSize / 2 + u * patchSize,
                y: patchSize / 2 + v * patchSize,
                z: 0,
            }));
            quad.patches.push({
                pos,
                texel: { u, v },
            });
        }
    }

    // for (let i = 0; i < quad.texture.width * quad.texture.height * 4; i += 4) {
    //     quad.texture.data[i] = Math.random() * 255;
    //     quad.texture.data[i + 1] = Math.random() * 255;
    //     quad.texture.data[i + 2] = Math.random() * 255;
    // }
});

const camera = new Camera(new Point3([0, 0, -256]), 0, 0);

window.addEventListener("keypress", (event) => {
    switch (event.key) {
        case "w": {
            camera.pos.x += 10 * Math.sin(camera.phi);
            camera.pos.z += 10 * Math.cos(camera.phi);
            break;
        }
        case "s": {
            camera.pos.x -= 10 * Math.sin(camera.phi);
            camera.pos.z -= 10 * Math.cos(camera.phi);
            break;
        }
        case "a": {
            camera.phi -= 0.1;
            break;
        }
        case "d": {
            camera.phi += 0.1;
            break;
        }
        case "q": {
            camera.theta -= 0.1;
            break;
        }
        case "e": {
            camera.theta += 0.1;
            break;
        }
    }
});

const { buf8 } = init();

loop(() => {
    quads.forEach((quad) => {
        for (const patch of quad.patches) {
            // clear(black);
            // const patchCamera = new Camera(patch.pos, quad.phi, quad.theta);
            // drawScene(patchCamera);
            // blit();

            const textureIndex = (patch.texel.u + patch.texel.v * quad.texture.width) * 4;
            quad.texture.data[textureIndex] = quad.emission.red;
            quad.texture.data[textureIndex + 1] = quad.emission.green;
            quad.texture.data[textureIndex + 2] = quad.emission.blue;
        }
    });

    clear(black);
    drawScene(camera);
    blit();
});

/**
 * @param {Camera} cam 
 */
const drawScene = (cam) => {
    quads.forEach((quad) => {
        const viewPolygon = quad.polygon.map((foo) => ({ point: cam.matrix.transform(foo.point), texel: foo.texel }));
        const clippedPolygon = clipPolygon(viewPolygon, cam.nearPlane);
        const screen = clippedPolygon.map((foo) => ({ point: project(foo.point, 160, 100, 0), texel: foo.texel }));

        for (let i = 1; i < screen.length - 1; i++) {
            if (clockwise(screen[0].point, screen[i].point, screen[i + 1].point)) {
                correctTriangle(screen[0], screen[i], screen[i + 1], quad.texture);
            }
        }
    });
};

// const incident = () => {
//     const red = 0;
//     const green = 0;
//     const blue = 0;
//     for (let i = 0; i < buf8.length; i += 4) {
//         red += buf8[i];
//         green += buf8[i + 1];
//         blue += buf8[i + 2];
//     }

//     return
// }
