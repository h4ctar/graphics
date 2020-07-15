// @ts-check
/**
 * @typedef {{ x: number, y: number }} Point2
 * @typedef {{ x: number, y: number, z: number }} Point3
 */

export const randomPoint2 = () => ({
    x: Math.random() * 320,
    y: Math.random() * 200,
});

/**
 * Add two points.
 * @param {Point3} a 
 * @param {Point3} b
 */
export const add = (a, b) => ({
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
});

/**
 * Subtract one point from another.
 * @param {Point3} a 
 * @param {Point3} b
 */
export const sub = (a, b) => ({
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
});

/**
 * Determine if three points are clockwise.
 * @param {Point2} a 
 * @param {Point2} b 
 * @param {Point2} c 
 */
export const clockwise = (a, b, c) => {
    const ab = (b.x - a.x) * (b.y + a.y);
    const bc = (c.x - b.x) * (c.y + b.y);
    const ca = (a.x - c.x) * (a.y + c.y);
    const area2 = ab + bc + ca;
    return area2 > 0;
};

/**
 * Rotate a point.
 * @param {Point3} p
 * @param {number} phi 
 * @param {number} theta 
 */
export const rotate = (p, phi, theta) => ({
    // x: -p.x * Math.sin(theta) + p.y * Math.cos(theta),
    // y: -p.x * Math.cos(theta) * Math.sin(phi) - p.y * Math.sin(theta) * Math.sin(phi) - p.z * Math.cos(phi),
    // z: -p.x * Math.cos(theta) * Math.cos(phi) - p.y * Math.sin(theta) * Math.cos(phi) + p.z * Math.sin(phi),
    x: p.x * Math.cos(theta) * Math.cos(phi) - p.y * Math.sin(theta) * Math.cos(phi) - p.z * Math.sin(phi),
    y: p.x * Math.sin(theta) + p.y * Math.cos(theta),
    z: p.x * Math.cos(theta) * Math.sin(phi) - p.y * Math.sin(theta) * Math.sin(phi) + p.z * Math.cos(phi),
});

/**
 * Project a 3d point into a 2d point.
 * @param {Point3} p 
 * @param {number} xCenter 
 * @param {number} yCenter 
 * @param {number} zCenter 
 */
export const project = (p, xCenter = 160, yCenter = 100, zCenter = 256) => ({
    x: 256 * p.x / (p.z + zCenter) + xCenter,
    y: 256 * p.y / (p.z + zCenter) + yCenter,
});

/**
 * Calculate the dot product.
 * @param {Point3} a 
 * @param {Point3} b 
 */
export const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;

/**
 * Calculate the cross product.
 * @param {Point3} a 
 * @param {Point3} b
 */
export const cross = (a, b) => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
});

/**
 * Calculate the length of a vertex.
 * @param {Point3} p 
 */
export const length = (p) => Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);

/**
 * Normalize a vertex.
 * @param {Point3} p 
 */
export const normalize = (p) => {
    const l = length(p);
    return {
        x: p.x / l,
        y: p.y / l,
        z: p.z / l,
    };
};

/**
 * @param {number} theta 
 */
export const xRotationMatrix = (theta) => [
    [1, 0, 0, 0],
    [0, Math.cos(theta), -Math.sin(theta), 0],
    [0, Math.sin(theta), Math.cos(theta), 0],
    [0, 0, 0, 1],
];

/**
 * @param {number} theta 
 */
export const yRotationMatrix = (theta) => [
    [Math.cos(theta), 0, Math.sin(theta), 0],
    [0, 1, 0, 0],
    [-Math.sin(theta), 0, Math.cos(theta), 0],
    [0, 0, 0, 1],
];

/**
 * @param {number} theta 
 */
export const zRotationMatrix = (theta) => [
    [Math.cos(theta), -Math.sin(theta), 0, 0],
    [Math.sin(theta), Math.cos(theta), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
];

/**
 * @param {Point3} p 
 */
export const translationMatrix = (p) => [
    [1, 0, 0, p.x],
    [0, 1, 0, p.y],
    [0, 0, 1, p.z],
    [0, 0, 0, 1],
];

/**
 * @param {number[][]} a 
 * @param {number[][]} b 
 */
export const multiplyMatrix = (a, b) => {
    // [a[0][0] * b[0][0] + a[1][0] * b[0][1]]

    /** @type { number[][] } */
    const result = new Array(4);
    for (let i = 0; i < 4; i++) {
        result[i] = new Array(4);
    }

    for (let c = 0; c < 4; c++) {
        for (let d = 0; d < 4; d++) {
            let sum = 0;
            for (let k = 0; k < 4; k++) {
                sum = sum + a[c][k] * b[k][d];
            }
            result[c][d] = sum;
        }
    }

    return result;
};

/**
 * @param {Point3} v 
 * @param {number[][]} m 
 */
export const transformVertex = (v, m) => ({
    x: v.x * m[0][0] + v.y * m[0][1] + v.z * m[0][2] + m[0][3],
    y: v.x * m[1][0] + v.y * m[1][1] + v.z * m[1][2] + m[1][3],
    z: v.x * m[2][0] + v.y * m[2][1] + v.z * m[2][2] + m[2][3],
});
