// @ts-check
/**
 * @typedef {{ x: number, y: number }} Point2Data
 * @typedef {{ x: number, y: number, z: number }} Point3Data
 */

export class Point2 {

    /**
     * @param {number[]} values
     */
    constructor(values) {
        this.values = values;
    }

    get x() {
        return this.values[0];
    }

    get y() {
        return this.values[1];
    }

    /**
     * Generate a random 2D point.
     */
    static random() {
        return new Point2([
            Math.random() * 320,
            Math.random() * 200,
        ]);
    }
}

export class Point3 {

    /**
     * @param {number[]} values
     */
    constructor(values) {
        this.values = values;
    }

    get x() {
        return this.values[0];
    }

    get y() {
        return this.values[1];
    }

    get z() {
        return this.values[2];
    }

    set x(x) {
        this.values[0] = x;
    }

    set y(y) {
        this.values[1] = y;
    }

    set z(z) {
        this.values[2] = z;
    }

    /**
     * Multiply this point by a scalar.
     * @param {number} s 
     */
    mul(s) {
        return new Point3([
            this.x * s,
            this.y * s,
            this.z * s
        ]);
    }

    /**
     * Add another point to this point.
     * @param {Point3Data} b
     */
    add(b) {
        return new Point3([
            this.x + b.x,
            this.y + b.y,
            this.z + b.z,
        ]);
    }

    /**
     * Subtract another point from this point.
     * @param {Point3} b
     */
    sub(b) {
        return new Point3([
            this.x - b.x,
            this.y - b.y,
            this.z - b.z,
        ]);
    }

    /**
     * Calculate the dot product of this and another point.
     * @param {Point3} b 
     */
    dot(b) {
        return this.x * b.x + this.y * b.y + this.z * b.z;
    }

    /**
     * Calculate the cross product of this and another point.
     * @param {Point3} b
     */
    cross(b) {
        return new Point3([
            this.y * b.z - this.z * b.y,
            this.z * b.x - this.x * b.z,
            this.x * b.y - this.y * b.x,
        ]);
    }

    /**
     * Calculate the length this point.
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * Normalize this point.
     */
    normalize() {
        const l = this.length();
        return new Point3([
            this.x / l,
            this.y / l,
            this.z / l,
        ]);
    }
}

/**
 * Determine if three points are clockwise.
 * @param {Point2Data} a 
 * @param {Point2Data} b 
 * @param {Point2Data} c 
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
 * @param {Point3Data} p
 * @param {number} phi 
 * @param {number} theta 
 */
export const rotate = (p, phi, theta) => {
    return new Point3([
        -p.x * Math.sin(theta) + p.y * Math.cos(theta),
        -p.x * Math.cos(theta) * Math.sin(phi) - p.y * Math.sin(theta) * Math.sin(phi) - p.z * Math.cos(phi),
        -p.x * Math.cos(theta) * Math.cos(phi) - p.y * Math.sin(theta) * Math.cos(phi) + p.z * Math.sin(phi),
    ]);
};

/**
 * Project a 3d point into a 2d point.
 * Return includes the Z incase it's needed later.
 * @param {Point3Data} p 
 * @param {number} xCenter 
 * @param {number} yCenter 
 * @param {number} zCenter 
 */
export const project = (p, xCenter = 160, yCenter = 100, zCenter = 256) => ({
    x: 256 * p.x / (p.z + zCenter) + xCenter,
    y: 256 * p.y / (p.z + zCenter) + yCenter,
    z: p.z,
});
