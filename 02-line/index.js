// @ts-check

import { init, clear, blit, line } from "../lib/draw.js";
import { black, randomColor } from "../lib/color.js";
import { randomPoint2 } from "../lib/math.js";
import { loop } from "../lib/loop.js";

init();

clear(black);

loop(() => {
    const p1 = randomPoint2();
    const p2 = randomPoint2();
    const color = randomColor();
    line(p1, p2, color);
    blit();
});
