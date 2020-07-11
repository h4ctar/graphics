// @ts-check
/**
 * https://permadi.com/1996/05/ray-casting-tutorial-table-of-contents/
 */

import { init, blit, line, clear } from "../lib/draw.js";
import { black, red, blue } from "../lib/color.js";
import { loop } from "../lib/loop.js";

init();

const mapSize = 8;
const cellSize = 16;

const map = [
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 1, 0, 0, 0, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 1,
    1, 0, 1, 0, 0, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
];

const player = {
    x: 64,
    y: 32,
    theta: 0
};

window.addEventListener("keypress", (event) => {
    switch (event.key) {
        case "w": {
            player.x += Math.cos(player.theta);
            player.y += Math.sin(player.theta);
            break;
        }
        case "s": {
            player.x -= Math.cos(player.theta);
            player.y -= Math.sin(player.theta);
            break;
        }
        case "a": {
            player.theta -= 0.1;
            break;
        }
        case "d": {
            player.theta += 0.1;
            break;
        }
    }
});

loop(() => {
    clear(black);

    // cast the rays
    for (let x = 0; x < 320; x++) {
        const theta = (x / 320 - 0.5) * Math.PI / 3;
        const { t, color } = castRay(player.theta + theta);
        const height = Math.min(cellSize * 200 / (t * Math.cos(theta)), 200);
        line({ x, y: 100 - height / 2 }, { x, y: 99 + height / 2 }, color);
    }

    blit();
});

/**
 * @param {number} theta 
 */
const castRay = (theta) => {
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    let minT = Number.MAX_VALUE;
    let color;

    // each vertical edge
    for (let x = cellSize; x < mapSize * cellSize; x += cellSize) {
        const t = (x - player.x) / cosTheta;
        const y = player.y + t * sinTheta;
        if (t > 0 && t < minT && y > 0 && y < mapSize * cellSize) {
            const mapX = cosTheta > 0 ? x / cellSize : x / cellSize - 1;
            const mapY = y / cellSize;
            if (map[Math.floor(mapX) + Math.floor(mapY) * mapSize]) {
                minT = t;
                color = red;
            }
        }
    }

    // each horizontal edge
    for (let y = cellSize; y < mapSize * cellSize; y += cellSize) {
        const t = (y - player.y) / sinTheta;
        const x = player.x + t * cosTheta;
        if (t > 0 && t < minT && x > 0 && x < mapSize * cellSize) {
            const mapX = x / cellSize;
            const mapY = sinTheta > 0 ? y / cellSize : y / cellSize - 1;
            if (map[Math.floor(mapX) + Math.floor(mapY) * mapSize]) {
                minT = t;
                color = blue;
            }
        }
    }

    return { t: minT, color };
};
