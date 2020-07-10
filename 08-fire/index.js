// @ts-check
/**
 * http://www.petesqbsite.com/sections/tutorials/tutorials/fire.txt
 * https://www.ssaurel.com/fireeffect/fireeffect.htm
 */

import { init, blit, spliceRgb } from "../lib/draw.js";
import { colorToRgb, flame } from "../lib/color.js";

init();
flame();

const fire = new Array(320 * 200);
fire.fill(0);

let wind = 0.5;

const loop = () => {
    // embers
    for (let x = 1; x < 319; x++) {
        const index = x + 199 * 320;
        // average out the pixels either side
        fire[index] = (fire[index - 1] + fire[index] + fire[index + 1]) / 3;
        // add some random
        fire[index] += (Math.random() - 0.5) * 20;
        // clip
        fire[index] = Math.max(fire[index], 0);
        fire[index] = Math.min(fire[index], 255);
    }

    wind += (Math.random() - 0.5) * 0.05;
    wind = Math.max(wind, 0);
    wind = Math.min(wind, 1);

    // rising heat
    for (let y = 0; y < 199; y++) {
        const indexRowBelow = (y + 1) * 320;
        for (let x = 1; x < 319; x++) {

            let sum = 0;
            sum += fire[indexRowBelow + x - 1] * (0.5 + wind);
            sum += fire[indexRowBelow + x];
            sum += fire[indexRowBelow + x + 1] * (1.5 - wind);
            const avg = sum / 3;

            // decay it a bit
            fire[x + y * 320] = avg * 0.99;
        }
    }

    for (let i = 0; i < 320 * 200; i++) {
        const rgb = colorToRgb({ index: fire[i] });
        if (rgb) spliceRgb(i, rgb);
    }

    blit();

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
