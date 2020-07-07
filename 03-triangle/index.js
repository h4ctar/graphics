import { init, clear, blit, triangle } from "../draw.js";
import { black, randomColor } from "../color.js";

init();

clear(black);

setInterval(() => {
    const x1 = Math.floor(Math.random() * 320);
    const y1 = Math.floor(Math.random() * 200);
    const x2 = Math.floor(Math.random() * 320);
    const y2 = Math.floor(Math.random() * 200);
    const x3 = Math.floor(Math.random() * 320);
    const y3 = Math.floor(Math.random() * 200);
    const color = randomColor();
    triangle(x1, y1, x2, y2, x3, y3, color);
    blit();
}, 16);
