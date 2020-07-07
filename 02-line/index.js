import { init, clear, blit, line } from "../draw.js";
import { black, randomColor } from "../color.js";

init();

clear(black);

setInterval(() => {
    const x1 = Math.floor(Math.random() * 320);
    const y1 = Math.floor(Math.random() * 200);
    const x2 = Math.floor(Math.random() * 320);
    const y2 = Math.floor(Math.random() * 200);
    const color = randomColor();
    line(x1, y1, x2, y2, color);
    blit();
}, 16);
