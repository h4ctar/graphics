// @ts-check

import { init, clear, blit, line } from "../lib/draw.js";
import { black, randomColor } from "../lib/color.js";
import { Point2 } from "../lib/math.js";
import { loop } from "../lib/loop.js";

init();

clear(black);

loop(() => {
    const p1 = Point2.random();
    const p2 = Point2.random();
    const color = randomColor();
    line(p1, p2, color);
    blit();
});
