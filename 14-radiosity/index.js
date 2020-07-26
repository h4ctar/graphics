// @ts-check
/**
 * @typedef { import("../lib/math").Point3 } Point3
 * @typedef { import("../lib/matrix").Matrix } Matrix
 * @typedef { import("../lib/draw").Texel } Texel
 * @typedef { import("../lib/color").Color } Color
 * @typedef { import("../lib/color").Rgb } Rgb
 */

import { init, clear, blit, correctTriangle, clipPolygon } from "../lib/draw.js";
import { black } from "../lib/color.js";
import { loop } from "../lib/loop.js";
import { add, project, clockwise } from "../lib/math.js";
import { yRotationMatrix, transformVertex, xRotationMatrix, multiplyMatrix, translationMatrix } from "../lib/matrix.js";

const patchSize = 10;

/**
 * @type {{
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
 * }[]}
 */
const quads = [
    // left quad
    {
        pos: { x: -50, y: -50, z: -50 },
        phi: 0,
        theta: 0,
        width: 100,
        height: 100,
        polygon: [],
        patches: [],
        texture: new ImageData(100 / patchSize, 100 / patchSize),
        reflectance: { red: 1, green: 0, blue: 0 },
        emission: { red: 0, green: 0, blue: 0 },
    },
    // right quad
    {
        pos: { x: 50, y: -50, z: 50 },
        phi: Math.PI,
        theta: 0,
        width: 100,
        height: 100,
        polygon: [],
        patches: [],
        texture: new ImageData(100 / patchSize, 100 / patchSize),
        reflectance: { red: 0, green: 1, blue: 0 },
        emission: { red: 0, green: 0, blue: 0 },
    },
    // floor quad
    {
        pos: { x: -50, y: 50, z: -50 },
        phi: 0,
        theta: Math.PI / 2,
        width: 100,
        height: 100,
        polygon: [],
        patches: [],
        texture: new ImageData(100 / patchSize, 100 / patchSize),
        reflectance: { red: 1, green: 1, blue: 1 },
        emission: { red: 0, green: 0, blue: 0 },
    },
    // light quad
    {
        pos: { x: 10, y: -10, z: 40 },
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
    const matrix = multiplyMatrix(xRotationMatrix(quad.theta), yRotationMatrix(quad.phi));

    // precompute the corners of the quad
    quad.polygon = [
        { point: quad.pos, texel: { u: 0, v: 0 } },
        { point: add(quad.pos, transformVertex({ x: quad.width, y: 0, z: 0 }, matrix)), texel: { u: 1, v: 0 } },
        { point: add(quad.pos, transformVertex({ x: quad.width, y: quad.height, z: 0 }, matrix)), texel: { u: 1, v: 1 } },
        { point: add(quad.pos, transformVertex({ x: 0, y: quad.height, z: 0 }, matrix)), texel: { u: 0, v: 1 } },
    ];

    // precompute the positions of the patches in the quad
    for (let v = 0; v < quad.height / patchSize; v++) {
        for (let u = 0; u < quad.width / patchSize; u++) {
            const pos = add(quad.pos, transformVertex({
                x: patchSize / 2 + u * patchSize,
                y: patchSize / 2 + v * patchSize,
                z: 0,
            }, matrix));

            const patch = {
                pos,
                texel: { u, v },
            };

            const textureIndex = (patch.texel.u + patch.texel.v * quad.texture.width) * 4;
            quad.texture.data[textureIndex] = quad.emission.red;
            quad.texture.data[textureIndex + 1] = quad.emission.green;
            quad.texture.data[textureIndex + 2] = quad.emission.blue;

            quad.patches.push(patch);
        }
    }
});

const camera = {
    pos: { x: -150, y: 0, z: 0 },
    phi: Math.PI / 2,   // rotation around y axis
    theta: 0,           // rotation around z axis
};

const { context, buf8 } = init();

let quadIndex = 0;
let patchIndex = 0;

loop(() => {
    const quad = quads[quadIndex];
    const patch = quad.patches[patchIndex];
    processPatch(quad, patch);
    patchIndex++;
    if (patchIndex >= quad.patches.length) {
        patchIndex = 0;
        quadIndex++;
        if (quadIndex >= quads.length) {
            quadIndex = 0;
        }
    }

    let viewMatrix = multiplyMatrix(xRotationMatrix(-camera.theta), yRotationMatrix(-camera.phi));
    viewMatrix = multiplyMatrix(viewMatrix, translationMatrix({ x: -camera.pos.x, y: -camera.pos.y, z: -camera.pos.z }));
    clear(black);
    drawScene(viewMatrix, true);
    blit();
});

const processPatch = (quad, patch) => {
    let viewMatrix = multiplyMatrix(xRotationMatrix(-quad.theta), yRotationMatrix(-quad.phi));
    viewMatrix = multiplyMatrix(viewMatrix, translationMatrix({ x: -patch.pos.x, y: -patch.pos.y, z: -patch.pos.z }));
    clear(black);
    drawScene(viewMatrix, false);

    // calculate brightness
    const incident = { red: 0, green: 0, blue: 0 };
    for (let i = 0; i < buf8.length; i += 4) {
        incident.red += buf8[i];
        incident.green += buf8[i + 1];
        incident.blue += buf8[i + 2];
    }
    incident.red /= buf8.length / 4;
    incident.green /= buf8.length / 4;
    incident.blue /= buf8.length / 4;

    const excident = {
        red: incident.red * quad.reflectance.red + quad.emission.red,
        green: incident.green * quad.reflectance.green + quad.emission.green,
        blue: incident.blue * quad.reflectance.blue + quad.emission.blue,
    };

    // write it to the texture
    const textureIndex = (patch.texel.u + patch.texel.v * quad.texture.width) * 4;
    quad.texture.data[textureIndex] = excident.red;
    quad.texture.data[textureIndex + 1] = excident.green;
    quad.texture.data[textureIndex + 2] = excident.blue;
};

/**
 * @param {Matrix} viewMatrix 
 * @param {boolean} exposure
 */
const drawScene = (viewMatrix, exposure) => {
    const nearPlane = {
        normal: { x: 0, y: 0, z: 1 },
        distance: 20
    };

    quads.forEach((quad) => {
        let texture = quad.texture;
        if (exposure) {
            texture = context.createImageData(quad.texture.width, quad.texture.height);
            for (let i = 0; i < quad.texture.data.length; i += 4) {
                texture.data[i] = 255 * (1 - Math.exp(-quad.texture.data[i]));
                texture.data[i + 1] = 255 * (1 - Math.exp(-quad.texture.data[i + 1]));
                texture.data[i + 2] = 255 * (1 - Math.exp(-quad.texture.data[i + 2]));
            }
        }

        const viewPolygon = quad.polygon.map((foo) => ({ point: transformVertex(foo.point, viewMatrix), texel: foo.texel }));
        const clippedPolygon = clipPolygon(viewPolygon, nearPlane);
        const screen = clippedPolygon.map((foo) => ({ point: project(foo.point, 160, 100, 0), texel: foo.texel }));

        for (let i = 1; i < screen.length - 1; i++) {
            if (clockwise(screen[0].point, screen[i].point, screen[i + 1].point)) {
                correctTriangle(screen[0], screen[i], screen[i + 1], texture);
            }
        }
    });
};

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
