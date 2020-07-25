// @ts-check
/**
 * @typedef { import("./math").Point2 } Point2
 * @typedef { import("./math").Point3 } Point3
 * @typedef { import("./color").Rgb } Rgb
 * @typedef { import("./color").Color } Color
 * @typedef { { u: number, v: number } } Texel
 * @typedef {{ normal: Point3, distance: number }} Plane
 */

import { gradient, colorToRgb } from "./color.js";
import { dot } from "./math.js";

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

    if (x1 < 0) {
        z -= x1 * dz;
        t.u -= x1 * du;
        t.v -= x1 * dv;
        x1 = 0;
    }

    if (x2 > canvas.width) {
        x2 = canvas.width;
    }

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
 * @param {{ point: Point3, texel: Texel }} p1
 * @param {{ point: Point3, texel: Texel }} p2
 * @param {{ point: Point3, texel: Texel }} p3
 * @param {ImageData} texture
 */
export const correctTriangle = (p1, p2, p3, texture) => {
    // Order the points vertically
    if (p1.point.y > p3.point.y) {
        [p1, p3] = [p3, p1];
    }
    if (p1.point.y > p2.point.y) {
        [p1, p2] = [p2, p1];
    }
    if (p2.point.y > p3.point.y) {
        [p2, p3] = [p3, p2];
    }

    // a is edge from 1 to 2
    // b is edge from 1 to 3
    // c is edge from 2 to 3
    const dxa = (p2.point.x - p1.point.x) / (p2.point.y - p1.point.y);
    const dxb = (p3.point.x - p1.point.x) / (p3.point.y - p1.point.y);
    const dxc = (p3.point.x - p2.point.x) / (p3.point.y - p2.point.y);

    const dza = (1 / p2.point.z - 1 / p1.point.z) / (p2.point.y - p1.point.y);
    const dzb = (1 / p3.point.z - 1 / p1.point.z) / (p3.point.y - p1.point.y);
    const dzc = (1 / p3.point.z - 1 / p2.point.z) / (p3.point.y - p2.point.y);

    const dua = (p2.texel.u / p2.point.z - p1.texel.u / p1.point.z) / (p2.point.y - p1.point.y);
    const dub = (p3.texel.u / p3.point.z - p1.texel.u / p1.point.z) / (p3.point.y - p1.point.y);
    const duc = (p3.texel.u / p3.point.z - p2.texel.u / p2.point.z) / (p3.point.y - p2.point.y);

    const dva = (p2.texel.v / p2.point.z - p1.texel.v / p1.point.z) / (p2.point.y - p1.point.y);
    const dvb = (p3.texel.v / p3.point.z - p1.texel.v / p1.point.z) / (p3.point.y - p1.point.y);
    const dvc = (p3.texel.v / p3.point.z - p2.texel.v / p2.point.z) / (p3.point.y - p2.point.y);

    let xa = p1.point.x;
    let xb = p1.point.x;
    let xc = p2.point.x;

    let y = p1.point.y;

    let za = 1 / p1.point.z;
    let zb = 1 / p1.point.z;
    let zc = 1 / p2.point.z;

    let ta = { u: p1.texel.u / p1.point.z, v: p1.texel.v / p1.point.z };
    let tb = { u: p1.texel.u / p1.point.z, v: p1.texel.v / p1.point.z };
    let tc = { u: p2.texel.u / p2.point.z, v: p2.texel.v / p2.point.z };

    // Scan from 1 to 2
    for (y; y < p2.point.y; y++) {
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
    for (y; y <= p3.point.y; y++) {
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

/**
 * https://www.cubic.org/docs/3dclip.htm
 * @param {{ point: Point3, texel: Texel }[]} polygon 
 * @param {Plane} plane
 * @returns {{ point: Point3, texel: Texel }[]}
 */
export const clipPolygon = (polygon, plane) => {
    /** @type {{ point: Point3, texel: Texel }[]} */
    const clippedPolygon = [];

    for (let i = 0; i < polygon.length - 1; i++) {
        clippedPolygon.push(...clipLine(polygon[i], polygon[i + 1], plane));
    }

    clippedPolygon.push(...clipLine(polygon[polygon.length - 1], polygon[0], plane));

    return clippedPolygon;
};

/**
 * @param {{ point: Point3, texel: Texel }} a
 * @param {{ point: Point3, texel: Texel }} b
 * @param {Plane} plane 
 * @returns {{ point: Point3, texel: Texel }[]}
 */
const clipLine = (a, b, plane) => {
    /** @type {{ point: Point3, texel: Texel }[]} */
    const clippedPoints = [];

    const da = dot(a.point, plane.normal) - plane.distance;
    const db = dot(b.point, plane.normal) - plane.distance;

    if (da >= 0) {
        clippedPoints.push(a);
    }

    if (Math.sign(da) !== Math.sign(db)) {
        const s = da / (da - db);   // intersection factor (between 0 and 1)

        clippedPoints.push({
            point: {
                x: a.point.x + s * (b.point.x - a.point.x),
                y: a.point.y + s * (b.point.y - a.point.y),
                z: a.point.z + s * (b.point.z - a.point.z),
            },
            texel: {
                u: a.texel.u + s * (b.texel.u - a.texel.u),
                v: a.texel.v + s * (b.texel.v - a.texel.v),
            }
        });
    }

    return clippedPoints;
};
