// @ts-check
/**
 * @typedef { import("./math").Point2 } Point2
 * @typedef { import("./color").Color } Color
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
    // @ts-ignore
    canvas = document.getElementById("canvas");

    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");
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
 * @param {Point2} p
 * @param {Color} color
 */
export const pset = (p, color) => {
    const value = colorToValue(color);
    bufRgb[Math.floor(p.y) * canvas.width + Math.floor(p.x)] = value;
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
 * @param {Point2} p1
 * @param {Point2} p2
 * @param {Color} color
 */
export const line = (p1, p2, color) => {
    const value = colorToValue(color);

    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    const step = Math.max(Math.abs(dx), Math.abs(dy));
    dx /= step;
    dy /= step;

    let x = p1.x;
    let y = p1.y;

    for (let i = 1; i <= step; i++) {
        bufRgb[Math.floor(y) * canvas.width + Math.floor(x)] = value;
        x += dx;
        y += dy;
    }
};

/**
 * @param {Point2} p1
 * @param {Point2} p2
 * @param {Point2} p3
 * @param {Color} color
 */
export const triangle = (p1, p2, p3, color) => {
    // Order the points vertically
    if (p1.y > p3.y) {
        [p1, p3] = [p3, p1];
    }
    if (p1.y > p2.y) {
        [p1, p2] = [p2, p1];
    }
    if (p2.y > p3.y) {
        [p2, p3] = [p3, p2];
    }

    // a is edge from 1 to 2
    // b is edge from 1 to 3
    // c is edge from 2 to 3
    const da = (p2.x - p1.x) / (p2.y - p1.y);
    const db = (p3.x - p1.x) / (p3.y - p1.y);
    const dc = (p3.x - p2.x) / (p3.y - p2.y);

    let xa = p1.x;
    let xb = p1.x;
    let xc = p2.x;

    // Scan from 1 to 2
    for (let y = p1.y; y < p2.y; y++) {
        hline(xa, xb, y, color);
        xa += da;
        xb += db;
    }

    // Scan from 2 to 3
    for (let y = p2.y; y <= p3.y; y++) {
        hline(xb, xc, y, color);
        xb += db;
        xc += dc;
    }
};

/**
 * @param {Color} color
 * @returns {number}
 */
const colorToValue = (color) => (255 << 24) | (color.blue << 16) | (color.green << 8) | color.red;
