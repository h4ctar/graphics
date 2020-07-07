/**
 * @typedef {{ red: number, green: number, blue: number }} Color
 */

/** @type HTMLCanvasElement */
let canvas;

/** @type CanvasRenderingContext2D */
let ctx;

/** @type ImageData */
let imageData;

/** @type Uint8ClampedArray */
let buf8;

/** @type Uint32Array */
let bufRgb;

/**
 * @param {number} width 
 * @param {number} height 
 */
export const init = (width = 320, height = 200) => {
    canvas = document.getElementById('canvas');

    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext('2d');
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const buf = new ArrayBuffer(imageData.data.length);
    buf8 = new Uint8ClampedArray(buf);
    bufRgb = new Uint32Array(buf);
};

/**
 * @param {Color} color
 */
export const clear = (color) => {
    const value = colorToValue(color);
    bufRgb.fill(value);
};

export const blit = () => {
    imageData.data.set(buf8);
    ctx.putImageData(imageData, 0, 0);
};

/**
 * @param {number} x 
 * @param {number} y 
 * @param {Color} color
 */
export const pset = (x, y, color) => {
    const value = colorToValue(color);
    bufRgb[y * canvas.width + x] = value;
};

/**
 * @param {number} x1 
 * @param {number} x2 
 * @param {number} y
 * @param {Color} color
 */
export const hline = (x1, x2, y, color) => {
    const value = colorToValue(color);
    const start = y * canvas.width + Math.min(x1, x2);
    const end = start + Math.abs(x1 - x2);
    bufRgb.fill(value, start, end);
};

/**
 * @param {number} x1 
 * @param {number} y1
 * @param {number} x2 
 * @param {number} y2
 * @param {Color} color
 */
export const line = (x1, y1, x2, y2, color) => {
    const value = colorToValue(color);

    let dx = x2 - x1;
    let dy = y2 - y1;
    const step = Math.max(Math.abs(dx), Math.abs(dy));
    dx = dx / step;
    dy = dy / step;

    let x = x1;
    let y = y1;

    for (let i = 1; i <= step; i++) {
        bufRgb[Math.round(y) * canvas.width + x] = value;
        x = x + dx;
        y = y + dy;
    }
};

/**
 * @param {number} x1 
 * @param {number} y1
 * @param {number} x2 
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 * @param {Color} color
 */
export const triangle = (x1, y1, x2, y2, x3, y3, color) => {
    // Order the points vertically
    if (y1 > y3) {
        [x1, x3] = [x3, x1];
        [y1, y3] = [y3, y1];
    }
    if (y1 > y2) {
        [x1, x2] = [x2, x1];
        [y1, y2] = [y2, y1];
    }
    if (y2 > y3) {
        [x2, x3] = [x3, x2];
        [y2, y3] = [y3, y2];
    }

    // a is edge from 1 to 2
    // b is edge from 1 to 3
    // c is edge from 2 to 3
    const da = (x2 - x1) / (y2 - y1);
    const db = (x3 - x1) / (y3 - y1);
    const dc = (x3 - x2) / (y3 - y2);

    let xa = x1;
    let xb = x1;
    let xc = x2;

    // Scan from 1 to 2
    for (let y = y1; y < y2; y++) {
        hline(xa, xb, y, color);
        xa += da;
        xb += db;
    }

    // Scan from 2 to 3
    for (let y = y2; y <= y3; y++) {
        hline(xb, xc, y, color);
        xb += db;
        xc += dc;
    }
};

/**
 * @param {Color} color
 * @returns {number}
 */
const colorToValue = (color) => {
    return (255 << 24) | (color.blue << 16) | (color.green << 8) | color.red;
};
