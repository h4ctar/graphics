import { init, clear, blit, triangle } from "../draw.js";
// @ts-check

import { black, randomColor } from "../color.js";
import { randomPoint2 } from "../math.js";

init();

clear(black);

const loop = () => {
    const p1 = randomPoint2();
    const p2 = randomPoint2();
    const p3 = randomPoint2();
    const color = randomColor();
    triangle(p1, p2, p3, color);
    blit();

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
