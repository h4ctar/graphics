// @ts-check
/**
 * @typedef {{ x: number, y: number }} Point2
 * @typedef {{ x: number, y: number, z: number }} Point3
 * @typedef {{ normal: Point3, distance: number }} Plane
 */

/**
 * Generate a random 2D point.
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
    x: -p.x * Math.sin(theta) + p.y * Math.cos(theta),
    y: -p.x * Math.cos(theta) * Math.sin(phi) - p.y * Math.sin(theta) * Math.sin(phi) - p.z * Math.cos(phi),
    z: -p.x * Math.cos(theta) * Math.cos(phi) - p.y * Math.sin(theta) * Math.cos(phi) + p.z * Math.sin(phi),
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
 * https://www.cubic.org/docs/3dclip.htm
 * @param {Point3[]} polygon 
 * @param {Plane} plane
 * @returns {Point3[]}
 */
export const clipPolygon = (polygon, plane) => {
    /** @type {Point3[]} */
    const clippedPolygon = [];

    for (let i = 0; i < polygon.length - 1; i++) {
        clippedPolygon.push(...clipLine(polygon[i], polygon[i + 1], plane));
    }

    clippedPolygon.push(...clipLine(polygon[polygon.length - 1], polygon[0], plane));

    return clippedPolygon;
};

/**
 * @param {Point3} a
 * @param {Point3} b
 * @param {Plane} plane 
 * @returns {Point3[]}
 */
const clipLine = (a, b, plane) => {
    /** @type {Point3[]} */
    const clippedPoints = [];

    const da = dot(a, plane.normal) - plane.distance;
    const db = dot(b, plane.normal) - plane.distance;

    if (da >= 0) {
        clippedPoints.push(a);
    }

    if (Math.sign(da) !== Math.sign(db)) {
        const s = da / (da - db);   // intersection factor (between 0 and 1)

        clippedPoints.push({
            x: a.x + s * (b.x - a.x),
            y: a.y + s * (b.y - a.y),
            z: a.z + s * (b.z - a.z),
            // value: a.value + s * (b.value - a.value),
        });
    }

    return clippedPoints;
};
