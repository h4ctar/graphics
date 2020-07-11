// @ts-check
/**
 * https://en.wikipedia.org/wiki/Mandelbrot_set
 * http://warp.povusers.org/Mandelbrot/
 */

import { init, blit, pset } from "../lib/draw.js";
import { gradient, white } from "../lib/color.js";
import { loop } from "../lib/loop.js";

init();
gradient(white);

let phi = 0;

loop(() => {
    // precompute sin and cos, this makes a huge difference
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    for (let Py = 0; Py < 200; Py++) {
        for (let Px = 0; Px < 320; Px++) {
            const cReal = Px / 320 * 3 - 2;
            const cImaginary = Py / 200 * 2 - 1;

            let zReal = 0;
            let zImaginary = 0;
            let iteration = 0;
            const maxIteration = 16;
            while (zReal * zReal + zImaginary * zImaginary <= 2 * 2 && iteration < maxIteration) {
                // [zReal, zImaginary] = [
                //     zReal * zReal - zImaginary * zImaginary + cReal,
                //     2 * zReal * zImaginary + cImaginary
                // ];

                // https://www.youtube.com/watch?v=2fdvHFrPoak
                [zReal, zImaginary] = [
                    zReal * zReal - zImaginary * zImaginary + cReal,
                    sinPhi * 2 * zReal * zImaginary + cosPhi * Math.abs(zReal) * zImaginary + cImaginary
                ];
                iteration++;
            }

            const brightness = iteration / maxIteration * 255;
            pset({ x: Px, y: Py }, { index: brightness });
        }
    }

    blit();

    phi += 0.01;
});
