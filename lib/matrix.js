// @ts-check
/**
 * @typedef { import("./math").Point3 } Point3
 * @typedef { number[][] } Matrix
 */

/**
 * Create a new identity matrix.
 */
export const identityMatrix = () => [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
];

/**
 * Create an X rotation matrix.
 * @param {number} theta the angle to rotate around the X axis (in radians)
 */
export const xRotationMatrix = (theta) => [
    [1, 0, 0, 0],
    [0, Math.cos(theta), -Math.sin(theta), 0],
    [0, Math.sin(theta), Math.cos(theta), 0],
    [0, 0, 0, 1],
];

/**
 * Create a Y rotation matrix.
 * @param {number} theta the angle to rotate around the Y axis (in radians)
 */
export const yRotationMatrix = (theta) => [
    [Math.cos(theta), 0, Math.sin(theta), 0],
    [0, 1, 0, 0],
    [-Math.sin(theta), 0, Math.cos(theta), 0],
    [0, 0, 0, 1],
];

/**
 * Create a z rotation matrix.
 * @param {number} theta the angle to rotate around the Z axis (in radians)
 */
export const zRotationMatrix = (theta) => [
    [Math.cos(theta), -Math.sin(theta), 0, 0],
    [Math.sin(theta), Math.cos(theta), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
];

/**
 * Create a translation matrix.
 * @param {Point3} d the distance to translate 
 */
export const translationMatrix = (d) => [
    [1, 0, 0, d.x],
    [0, 1, 0, d.y],
    [0, 0, 1, d.z],
    [0, 0, 0, 1],
];

/**
 * Multiply two matricies.
 * @param {Matrix} a the first matrix
 * @param {Matrix} b the second matrix
 * @returns the result
 */
export const multiplyMatrix = (a, b) => {
    /** @type { Matrix } */
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
 * Transform a vertex by multiplying it by a matrix.
 * @param {Point3} v the vertex
 * @param {Matrix} m the matrix
 */
export const transformVertex = (v, m) => ({
    x: v.x * m[0][0] + v.y * m[0][1] + v.z * m[0][2] + m[0][3],
    y: v.x * m[1][0] + v.y * m[1][1] + v.z * m[1][2] + m[1][3],
    z: v.x * m[2][0] + v.y * m[2][1] + v.z * m[2][2] + m[2][3],
});
