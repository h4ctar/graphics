import { init, clear, blit, pset } from "../draw.js";
import { black, randomColor } from "../color.js";

init();

clear(black);

setInterval(() => {
    const x = Math.floor(Math.random() * 320);
    const y = Math.floor(Math.random() * 200);
    const color = randomColor();
    pset(x, y, color);
    blit();
}, 16);
