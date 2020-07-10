// @ts-check
/**
 * https://en.wikipedia.org/wiki/Mandelbrot_set
 */

import { init, blit, pset } from "../lib/draw.js";
import { palette, gradient, white } from "../lib/color.js";

init();
gradient(white);

for (let Py = 0; Py < 200; Py++) {
    for (let Px = 0; Px < 320; Px++) {
        const x0 = Px / 320 * 3.5 - 2.5;
        const y0 = Py / 200 * 2 - 1;
        let x = 0;
        let y = 0;
        let iteration = 0;
        const maxIteration = 32;
        while (x * x + y * y <= 2 * 2 && iteration < maxIteration) {
            const xtemp = x * x - y * y + x0;
            y = 2 * x * y + y0;
            x = xtemp;
            iteration = iteration + 1;
        }

        const color = palette[Math.floor(iteration / maxIteration * 255)];
        pset({ x: Px, y: Py }, color);
    }
}

blit();
