// @ts-check

import { init, clear, blit, pset } from "../lib/draw.js";
import { black, randomColor } from "../lib/color.js";
import { Point2 } from "../lib/math.js";
import { loop } from "../lib/loop.js";

init();

clear(black);

loop(() => {
    const p = Point2.random();
    const color = randomColor();
    pset(p, color);
    blit();
});
