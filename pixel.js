import { init, clear, blit, pset, hline, line, triangle } from "./draw.js";
import { red, green, blue, black } from "./color.js";

init();

clear(black);

pset(50, 10, red);
hline(10, 100, 100, blue);
line(80, 80, 160, 100, red);
triangle(200, 50, 250, 100, 150, 150, green);

blit();
