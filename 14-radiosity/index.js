// @ts-check
/**
 * @typedef {{ x: number, y: number, z: number }} Point3
 * @typedef {{ pos: Point3, u: number, v: number }} Patch
 * @typedef { import("../lib/draw").Texel } Texel
 * @typedef { import("../lib/color").Color } Color
 */

import { init, clear, blit, pset, correctTriangle, clipPolygon } from "../lib/draw.js";
import { black, white } from "../lib/color.js";
import { loop } from "../lib/loop.js";
import { add, project } from "../lib/math.js";
import { yRotationMatrix, transformVertex, xRotationMatrix, multiplyMatrix, translationMatrix, identityMatrix } from "../lib/matrix.js";

const patchSize = 20;

/** @type {{
 *   pos: Point3,
 *   phi: number,
 *   theta: number,
 *   width: number,
 *   height: number,
 *   polygon: { point: Point3, texel: Texel }[],
 *   patches: { pos: Point3, texel: Texel }[]
 *   texture: ImageData
 * }[]} */
const quads = [{
    pos: { x: -50, y: -50, z: -50 },
    phi: 0,
    theta: 0,
    width: 100,
    height: 100,
    polygon: [],
    patches: [],
    texture: new ImageData(100 / patchSize, 100 / patchSize),
},
{
    pos: { x: 50, y: -50, z: 50 },
    phi: Math.PI,
    theta: 0,
    width: 100,
    height: 100,
    polygon: [],
    patches: [],
    texture: new ImageData(100 / patchSize, 100 / patchSize),
}];

quads.forEach((quad) => {
    const matrix = yRotationMatrix(quad.phi);

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
            quad.patches.push({
                pos,
                texel: { u, v },
            });
        }
    }

    for (let i = 0; i < quad.texture.width * quad.texture.height * 4; i += 4) {
        quad.texture.data[i] = Math.random() * 255;
        quad.texture.data[i + 1] = Math.random() * 255;
        quad.texture.data[i + 2] = Math.random() * 255;
    }
});

const updateCameraMatrix = () => {
    camera.matrix = xRotationMatrix(-camera.theta);
    camera.matrix = multiplyMatrix(camera.matrix, yRotationMatrix(-camera.phi));
    camera.matrix = multiplyMatrix(camera.matrix, translationMatrix({ x: -camera.pos.x, y: -camera.pos.y, z: -camera.pos.z }));
};

const camera = {
    pos: { x: 0, y: 0, z: -256 },
    phi: 0,   // rotation around y axis
    theta: 0, // rotation around z axis
    matrix: identityMatrix(),
    nearPlane: {
        normal: { x: 0, y: 0, z: 1 },
        distance: 1
    },
};
updateCameraMatrix();

window.addEventListener("keypress", (event) => {
    switch (event.key) {
        case "w": {
            camera.pos.x += 10 * Math.sin(camera.phi);
            camera.pos.z += 10 * Math.cos(camera.phi);
            updateCameraMatrix();
            break;
        }
        case "s": {
            camera.pos.x -= 10 * Math.sin(camera.phi);
            camera.pos.z -= 10 * Math.cos(camera.phi);
            updateCameraMatrix();
            break;
        }
        case "a": {
            camera.phi -= 0.1;
            updateCameraMatrix();
            break;
        }
        case "d": {
            camera.phi += 0.1;
            updateCameraMatrix();
            break;
        }
        case "q": {
            camera.theta -= 0.1;
            updateCameraMatrix();
            break;
        }
        case "e": {
            camera.theta += 0.1;
            updateCameraMatrix();
            break;
        }
    }
});

init();

loop(() => {
    clear(black);

    quads.forEach((quad) => {
        for (const patch of quad.patches) {
            const view = transformVertex(patch.pos, camera.matrix);

            // place camera at patch
            // draw scene
            // calculate brightness
            // write it to the texture
            if (view.z > 0) {
                const screen = project(view, 160, 100, 0);
                pset(screen, white);
            }
        }
    });

    drawScene();

    blit();
});

const drawScene = () => {
    quads.forEach((quad) => {
        const viewPolygon = quad.polygon.map((foo) => ({ point: transformVertex(foo.point, camera.matrix), texel: foo.texel }));
        const clippedPolygon = clipPolygon(viewPolygon, camera.nearPlane);
        const screen = clippedPolygon.map((foo) => ({ point: project(foo.point, 160, 100, 0), texel: foo.texel }));

        for (let i = 1; i < screen.length - 1; i++) {
            correctTriangle(screen[0], screen[i], screen[i + 1], quad.texture);
        }
    });
};
