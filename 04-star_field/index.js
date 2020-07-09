// @ts-check

import { init, clear, blit, pset } from "../lib/draw.js";
import { black, white } from "../lib/color.js";
import { project } from "../lib/math.js";

// http://freespace.virgin.net/hugo.elias/graphics/x_stars.htm
const poisitions = Array.from({ length: 64 }, () => ({
    x: Math.random() * 1000 - 500,
    y: Math.random() * 1000 - 500,
    z: Math.random() * 900 + 100
}));

init();

const loop = () => {
    clear(black);

    poisitions.forEach((p) => {
        p.z -= 5;

        const screen = project(p);

        if (screen.x < 0 || screen.x >= 320 || screen.y < 0 || screen.y >= 200) {
            p.x = Math.random() * 1000 - 500;
            p.y = Math.random() * 1000 - 500;
            p.z = Math.random() * 900 + 100;
        }

        pset(screen, white);
    });

    blit();

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
