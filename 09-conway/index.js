// @ts-check
/**
 * https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
 */

import { init, blit, spliceRgb } from "../lib/draw.js";
import { black, white } from "../lib/color.js";
import { loop } from "../lib/loop.js";

init();

let cells = new Array(320 * 200);
let cellsNext = new Array(320 * 200);
cells.fill(false);

for (let i = 0; i < 20000; i++) {
    const x = Math.floor(Math.random() * 318 + 1);
    const y = Math.floor(Math.random() * 198 + 1);
    cells[x + y * 320] = true;
}

loop(() => {
    // draw the cells
    for (let i = 0; i < 320 * 200; i++) {
        const rgb = cells[i] ? white : black;
        if (rgb) spliceRgb(i, rgb);
    }

    // simulate
    for (let y = 1; y < 199; y++) {
        for (let x = 1; x < 319; x++) {
            let neighbours = 0;

            cells[x - 1 + (y - 1) * 320] && neighbours++;
            cells[x + (y - 1) * 320] && neighbours++;
            cells[x + 1 + (y - 1) * 320] && neighbours++;

            cells[x - 1 + y * 320] && neighbours++;
            cells[x + 1 + y * 320] && neighbours++;

            cells[x - 1 + (y + 1) * 320] && neighbours++;
            cells[x + (y + 1) * 320] && neighbours++;
            cells[x + 1 + (y + 1) * 320] && neighbours++;

            const index = x + y * 320;

            // Any live cell
            if (cells[index]) {
                // with fewer than two live neighbours dies, as if by underpopulation.
                if (neighbours < 2) {
                    cellsNext[index] = false;
                }
                // with two or three live neighbours lives on to the next generation.
                else if (neighbours === 2 || neighbours === 3) {
                    cellsNext[index] = true;
                }
                // with more than three live neighbours dies, as if by overpopulation.
                else {
                    cellsNext[index] = false;
                }
            }
            // Any dead cell
            else {
                // with exactly three live neighbours becomes a live cell, as if by reproduction.
                if (neighbours === 3) {
                    cellsNext[index] = true;
                } else {
                    cellsNext[index] = false;
                }
            }
        }
    }

    blit();

    // swap
    [cells, cellsNext] = [cellsNext, cells];
});
