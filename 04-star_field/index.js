// @ts-check

import { init, clear, blit, pset } from "../draw.js";
import { black, white } from "../color.js";

// http://freespace.virgin.net/hugo.elias/graphics/x_stars.htm
const poisitions = Array.from({ length: 64 }, () => ({
    x: Math.random() * 1000 - 500,
    y: Math.random() * 1000 - 500,
    z: Math.random() * 900 + 100
}));

init();

setInterval(() => {
    clear(black);

    poisitions.forEach((p) => {
        p.z -= 5;

        const screen = {
            x: p.x / p.z * 100 + 160,
            y: p.y / p.z * 100 + 100,
        };

        if (screen.x < 0 || screen.x >= 320 || screen.y < 0 || screen.y >= 200) {
            p.x = Math.random() * 1000 - 500;
            p.y = Math.random() * 1000 - 500;
            p.z = Math.random() * 900 + 100;
        }

        pset(screen, white);
    });

    blit();
}, 16);
