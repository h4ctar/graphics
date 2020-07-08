// @ts-check

import { init, clear, blit, line } from "../draw.js";
import { black, randomColor } from "../color.js";
import { randomPoint2 } from "../math.js";

init();

clear(black);

const loop = () => {
    const p1 = randomPoint2();
    const p2 = randomPoint2();
    const color = randomColor();
    line(p1, p2, color);
    blit();

    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
