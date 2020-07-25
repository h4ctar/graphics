// @ts-check

import { init, clear, blit, triangle } from "../lib/draw.js";
import { black, randomColor } from "../lib/color.js";
import { Point2 } from "../lib/math.js";
import { loop } from "../lib/loop.js";

init();

clear(black);

loop(() => {
    const p1 = Point2.random();
    const p2 = Point2.random();
    const p3 = Point2.random();
    const color = randomColor();
    triangle(p1, p2, p3, color);
    blit();
});
