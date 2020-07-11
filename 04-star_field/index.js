// @ts-check
/**
 * http://freespace.virgin.net/hugo.elias/graphics/x_stars.htm
 */

import { init, blit, clear, wu } from "../lib/draw.js";
import { white, gradient, black } from "../lib/color.js";
import { project } from "../lib/math.js";
import { loop } from "../lib/loop.js";

const stars = Array.from({ length: 128 }, () => ({
    x: Math.random() * 1000 - 500,
    y: Math.random() * 1000 - 500,
    z: Math.random() * 900 + 100,
    v: Math.random() * 5 + 0.5,
}));

const { buf8 } = init();
gradient(white);
clear(black);

loop(() => {
    // dim the old pixels to give motion blur effect
    for (let i = 0; i < 320 * 200 * 4; i += 4) {
        buf8[i] = Math.floor(buf8[i] * 0.8);
        buf8[i + 1] = Math.floor(buf8[i + 1] * 0.8);
        buf8[i + 2] = Math.floor(buf8[i + 2] * 0.8);
    }

    stars.forEach((star) => {
        star.z -= star.v;

        const screen = project(star);

        // reset the star if it goes off screen
        if (screen.x < 0 || screen.x >= 320 || screen.y < 0 || screen.y >= 200) {
            star.x = Math.random() * 1000 - 500;
            star.y = Math.random() * 1000 - 500;
            star.z = Math.random() * 900 + 100;
            star.v = Math.random() * 5 + 0.5;
        }

        // stars get brighter as they get closer
        let brightness = Math.floor(255 - (star.z * (255 / 1000)));
        brightness = Math.max(brightness, 0);
        brightness = Math.min(brightness, 255);

        // draw the star
        wu(screen, brightness);
    });

    blit();
});
