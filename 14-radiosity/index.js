// @ts-check
/**
 * @typedef {{ x: number, y: number, z: number }} Point3
 * @typedef {{ pos: Point3, u: number, v: number }} Patch
 * @typedef { import("../lib/draw").Texel } Texel
 * @typedef { import("../lib/color").Color } Color
 */

import { init, clear, blit, line, pset } from "../lib/draw.js";
import { black, white } from "../lib/color.js";
import { loop } from "../lib/loop.js";
import { add, rotate, project, yRotationMatrix, multiplyMatrix, identityMatrix, translationMatrix, xRotationMatrix, transformVertex } from "../lib/math.js";

const patchSize = 20;

/** @type {{
 *   pos: Point3,
 *   phi: number,
 *   theta: number,
 *   width: number,
 *   height: number,
 *   corners: Point3[],
 *   patches: { pos: Point3, texel: Texel }[]
 * }[]} */
const quads = [{
    pos: { x: -500, y: -50, z: -500 },
    phi: 0,
    theta: 0,
    width: 1000,
    height: 200,
    corners: [],
    patches: [],
},
{
    pos: { x: 500, y: -50, z: 500 },
    phi: Math.PI,
    theta: 0,
    width: 1000,
    height: 200,
    corners: [],
    patches: [],
}];

// precompute the corners
quads.forEach((quad) => {
    quad.corners = [
        quad.pos,
        add(quad.pos, rotate({ x: quad.width, y: 0, z: 0 }, quad.phi, quad.theta)),
        add(quad.pos, rotate({ x: quad.width, y: quad.height, z: 0 }, quad.phi, quad.theta)),
        add(quad.pos, rotate({ x: 0, y: quad.height, z: 0 }, quad.phi, quad.theta)),
    ];
});

// precompute the patches
quads.forEach((quad) => {
    for (let v = 0; v < quad.height / patchSize; v++) {
        for (let u = 0; u < quad.width / patchSize; u++) {
            const pos = add(quad.pos, rotate({
                x: patchSize / 2 + u * patchSize,
                y: patchSize / 2 + v * patchSize,
                z: 0,
            }, quad.phi, quad.theta));
            quad.patches.push({
                pos,
                texel: { u, v },
            });
        }
    }
});

const updateCameraMatrix = () => {
    camera.matrix = xRotationMatrix(-camera.theta);
    camera.matrix = multiplyMatrix(camera.matrix, yRotationMatrix(-camera.phi));
    camera.matrix = multiplyMatrix(camera.matrix, translationMatrix({ x: -camera.pos.x, y: -camera.pos.y, z: -camera.pos.z }));
};

const camera = {
    pos: { x: 0, y: 0, z: -256 },
    phi: 0, // rotation around y axis
    theta: 0, // rotation around z axis
    matrix: identityMatrix(),
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
        const view = quad.corners.map((pos) => transformVertex(pos, camera.matrix));
        const screen = view.map((r) => project(r, 160, 100, 0));

        line(screen[0], screen[1], white);
        line(screen[1], screen[2], white);
        line(screen[2], screen[3], white);
        line(screen[3], screen[0], white);
    });
};
