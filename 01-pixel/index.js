import { init, clear, blit, pset } from "../draw.js";
import { black, randomColor } from "../color.js";
import { randomPoint2 } from "../math.js";

init();

clear(black);

setInterval(() => {
    const p = randomPoint2();
    const color = randomColor();
    pset(p, color);
    blit();
}, 16);
