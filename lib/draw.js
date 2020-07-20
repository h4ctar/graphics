// @ts-check
/**
 * @typedef { import("./math").Point2 } Point2
 * @typedef { import("./math").Point3 } Point3
 * @typedef { import("./color").Rgb } Rgb
 * @typedef { import("./color").Color } Color
 * @typedef { { u: number, v: number } } Texel
 */

import { gradient, colorToRgb } from "./color.js";

/** @type HTMLCanvasElement */
let canvas;

/** @type CanvasRenderingContext2D */
let context;

/** @type ImageData */
let imageData;

/** @type Uint8ClampedArray */
let buf8;

/**
 * @param {number} width
 * @param {number} height
 */
export const init = (width = 320, height = 200) => {
    // @ts-ignore
    canvas = document.getElementById("canvas");

    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext("2d");
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const buf = new ArrayBuffer(imageData.data.length);
    buf8 = new Uint8ClampedArray(buf);

    gradient({ red: 255, green: 128, blue: 50 });

    return {
        buf8,
    };
};

/**
 * @param {Color} color
 */
export const clear = (color) => {
    const rgb = colorToRgb(color);
    for (let i = 0; i < 320 * 200; i++) {
        spliceRgb(i, rgb);
    }
};

export const blit = () => {
    imageData.data.set(buf8);
    context.putImageData(imageData, 0, 0);
};

/**
 * @param {Point2} p
 * @param {Color} color
 */
export const pset = (p, color) => {
    if (p.x < 0 || p.x >= canvas.width) return;
    if (p.y < 0 || p.y >= canvas.height) return;
    const index = (Math.floor(p.x) + Math.floor(p.y) * canvas.width);
    const rgb = colorToRgb(color);
    spliceRgb(index, rgb);
};

/**
 * Plot a wu pixel.
 * http://freespace.virgin.net/hugo.elias/graphics/x_wupixl.htm
 * @param {Point2} wu 
 * @param {number} brightness 
 */
export const wu = (wu, brightness) => {
    const x = Math.floor(wu.x);
    const y = Math.floor(wu.y);
    const fx = wu.x - x;
    const fy = wu.y - y;

    const btl = (1 - fx) * (1 - fy) * brightness;
    const btr = (fx) * (1 - fy) * brightness;
    const bbl = (1 - fx) * (fy) * brightness;
    const bbr = (fx) * (fy) * brightness;

    pset({ x, y }, { index: btl });
    pset({ x: x + 1, y }, { index: btr });
    pset({ x, y: y + 1 }, { index: bbl });
    pset({ x: x + 1, y: y + 1 }, { index: bbr });
};

/**
 * @param {number} x1
 * @param {number} x2
 * @param {number} y
 * @param {Color} color
 */
export const hline = (x1, x2, y, color) => {
    if (x1 > x2) {
        [x1, x2] = [x2, x1];
    }

    x1 = Math.max(x1, 0);
    x2 = Math.min(x2, canvas.width);

    y = Math.max(y, 0);
    y = Math.min(y, canvas.height);

    const rgb = colorToRgb(color);
    const start = x1 + Math.floor(y) * canvas.width;
    const end = x2 + Math.floor(y) * canvas.width;
    for (let index = Math.floor(start); index < Math.floor(end); index++) {
        spliceRgb(index, rgb);
    }
};

/**
 * @param {number} x1
 * @param {Texel} t1
 * @param {number} x2
 * @param {Texel} t2
 * @param {number} y
 * @param {ImageData} texture
 */
export const affineHline = (x1, t1, x2, t2, y, texture) => {
    if (x1 > x2) {
        [x1, x2] = [x2, x1];
        [t1, t2] = [t2, t1];
    }

    const du = (t2.u - t1.u) / (x2 - x1);
    const dv = (t2.v - t1.v) / (x2 - x1);

    const t = { ...t1 };

    const startIndex = (Math.floor(x1) + Math.floor(y) * canvas.width) * 4;
    const endIndex = (Math.floor(x2) + Math.floor(y) * canvas.width) * 4;

    for (let index = startIndex; index < endIndex; index += 4) {
        t.u += du;
        t.v += dv;

        const textureIndex = (Math.floor(t.u * texture.width) + Math.floor(t.v * texture.height) * texture.width) * 4;

        buf8[index] = texture.data[textureIndex];
        buf8[index + 1] = texture.data[textureIndex + 1];
        buf8[index + 2] = texture.data[textureIndex + 2];
        buf8[index + 3] = 255;
    }
};

/**
 * @param {number} x1
 * @param {number} z1
 * @param {Texel} t1
 * @param {number} x2
 * @param {number} z2
 * @param {Texel} t2
 * @param {number} y
 * @param {ImageData} texture
 */
export const correctHline = (x1, z1, t1, x2, z2, t2, y, texture) => {
    if (x1 > x2) {
        [x1, x2] = [x2, x1];
        [z1, z2] = [z2, z1];
        [t1, t2] = [t2, t1];
    }

    const dz = (z2 - z1) / (x2 - x1);
    const du = (t2.u - t1.u) / (x2 - x1);
    const dv = (t2.v - t1.v) / (x2 - x1);

    let z = z1;
    const t = { ...t1 };

    const startIndex = (Math.floor(x1) + Math.floor(y) * canvas.width) * 4;
    const endIndex = (Math.floor(x2) + Math.floor(y) * canvas.width) * 4;

    for (let index = startIndex; index < endIndex; index += 4) {
        z += dz;
        t.u += du;
        t.v += dv;

        const uCorrect = t.u / z;
        const vCorrect = t.v / z;

        const textureIndex = (Math.floor(uCorrect * texture.width) + Math.floor(vCorrect * texture.height) * texture.width) * 4;

        buf8[index] = texture.data[textureIndex];
        buf8[index + 1] = texture.data[textureIndex + 1];
        buf8[index + 2] = texture.data[textureIndex + 2];
        buf8[index + 3] = 255;
    }
};

/**
 * @param {Point2} p1
 * @param {Point2} p2
 * @param {Color} color
 */
export const line = (p1, p2, color) => {
    const rgb = colorToRgb(color);

    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    const step = Math.max(Math.abs(dx), Math.abs(dy));
    dx /= step;
    dy /= step;

    let x = p1.x;
    let y = p1.y;

    for (let i = 0; i <= step; i++) {
        const index = (Math.floor(x) + Math.floor(y) * canvas.width);
        spliceRgb(index, rgb);
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
    let y = p1.y;

    // Scan from 1 to 2
    for (y; y < p2.y; y++) {
        hline(xa, xb, y, color);
        xa += da;
        xb += db;
    }

    // Scan from 2 to 3
    for (y; y <= p3.y; y++) {
        hline(xb, xc, y, color);
        xb += db;
        xc += dc;
    }
};

/**
 * @param {Point2} p1
 * @param {Texel} t1
 * @param {Point2} p2
 * @param {Texel} t2
 * @param {Point2} p3
 * @param {Texel} t3
 * @param {ImageData} texture
 */
export const affineTriangle = (p1, t1, p2, t2, p3, t3, texture) => {
    // Order the points vertically
    if (p1.y > p3.y) {
        [p1, p3] = [p3, p1];
        [t1, t3] = [t3, t1];
    }
    if (p1.y > p2.y) {
        [p1, p2] = [p2, p1];
        [t1, t2] = [t2, t1];
    }
    if (p2.y > p3.y) {
        [p2, p3] = [p3, p2];
        [t2, t3] = [t3, t2];
    }

    // a is edge from 1 to 2
    // b is edge from 1 to 3
    // c is edge from 2 to 3
    const dxa = (p2.x - p1.x) / (p2.y - p1.y);
    const dxb = (p3.x - p1.x) / (p3.y - p1.y);
    const dxc = (p3.x - p2.x) / (p3.y - p2.y);

    const dua = (t2.u - t1.u) / (p2.y - p1.y);
    const dub = (t3.u - t1.u) / (p3.y - p1.y);
    const duc = (t3.u - t2.u) / (p3.y - p2.y);

    const dva = (t2.v - t1.v) / (p2.y - p1.y);
    const dvb = (t3.v - t1.v) / (p3.y - p1.y);
    const dvc = (t3.v - t2.v) / (p3.y - p2.y);

    let xa = p1.x;
    let xb = p1.x;
    let xc = p2.x;

    let y = p1.y;

    let ta = { u: t1.u, v: t1.v };
    let tb = { u: t1.u, v: t1.v };
    let tc = { u: t2.u, v: t2.v };

    // Scan from 1 to 2
    for (y; y < p2.y; y++) {
        affineHline(xa, ta, xb, tb, y, texture);
        xa += dxa;
        xb += dxb;
        ta.u += dua;
        ta.v += dva;
        tb.u += dub;
        tb.v += dvb;
    }

    // Scan from 2 to 3
    for (y; y <= p3.y; y++) {
        affineHline(xb, tb, xc, tc, y, texture);
        xb += dxb;
        xc += dxc;
        tb.u += dub;
        tb.v += dvb;
        tc.u += duc;
        tc.v += dvc;
    }
};

/**
 * @param {Point3} p1
 * @param {Texel} t1
 * @param {Point3} p2
 * @param {Texel} t2
 * @param {Point3} p3
 * @param {Texel} t3
 * @param {ImageData} texture
 */
export const correctTriangle = (p1, t1, p2, t2, p3, t3, texture) => {
    // Order the points vertically
    if (p1.y > p3.y) {
        [p1, p3] = [p3, p1];
        [t1, t3] = [t3, t1];
    }
    if (p1.y > p2.y) {
        [p1, p2] = [p2, p1];
        [t1, t2] = [t2, t1];
    }
    if (p2.y > p3.y) {
        [p2, p3] = [p3, p2];
        [t2, t3] = [t3, t2];
    }

    // a is edge from 1 to 2
    // b is edge from 1 to 3
    // c is edge from 2 to 3
    const dxa = (p2.x - p1.x) / (p2.y - p1.y);
    const dxb = (p3.x - p1.x) / (p3.y - p1.y);
    const dxc = (p3.x - p2.x) / (p3.y - p2.y);

    const dza = (1 / p2.z - 1 / p1.z) / (p2.y - p1.y);
    const dzb = (1 / p3.z - 1 / p1.z) / (p3.y - p1.y);
    const dzc = (1 / p3.z - 1 / p2.z) / (p3.y - p2.y);

    const dua = (t2.u / p2.z - t1.u / p1.z) / (p2.y - p1.y);
    const dub = (t3.u / p3.z - t1.u / p1.z) / (p3.y - p1.y);
    const duc = (t3.u / p3.z - t2.u / p2.z) / (p3.y - p2.y);

    const dva = (t2.v / p2.z - t1.v / p1.z) / (p2.y - p1.y);
    const dvb = (t3.v / p3.z - t1.v / p1.z) / (p3.y - p1.y);
    const dvc = (t3.v / p3.z - t2.v / p2.z) / (p3.y - p2.y);

    let xa = p1.x;
    let xb = p1.x;
    let xc = p2.x;

    let y = p1.y;

    let za = 1 / p1.z;
    let zb = 1 / p1.z;
    let zc = 1 / p2.z;

    let ta = { u: t1.u / p1.z, v: t1.v / p1.z };
    let tb = { u: t1.u / p1.z, v: t1.v / p1.z };
    let tc = { u: t2.u / p2.z, v: t2.v / p2.z };

    // Scan from 1 to 2
    for (y; y < p2.y; y++) {
        correctHline(xa, za, ta, xb, zb, tb, y, texture);
        xa += dxa;
        xb += dxb;
        za += dza;
        zb += dzb;
        ta.u += dua;
        ta.v += dva;
        tb.u += dub;
        tb.v += dvb;
    }

    // Scan from 2 to 3
    for (y; y <= p3.y; y++) {
        correctHline(xb, zb, tb, xc, zc, tc, y, texture);
        xb += dxb;
        xc += dxc;
        zb += dzb;
        zc += dzc;
        tb.u += dub;
        tb.v += dvb;
        tc.u += duc;
        tc.v += dvc;
    }
};

/**
 * @param {number} index 
 * @param {Rgb} rgb 
 */
export const spliceRgb = (index, rgb) => {
    index *= 4;
    buf8[index] = rgb.red;
    buf8[index + 1] = rgb.green;
    buf8[index + 2] = rgb.blue;
    buf8[index + 3] = 255;
};
