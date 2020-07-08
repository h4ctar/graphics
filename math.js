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
 * @param {Point3} p 
 * @param {number} xCenter 
 * @param {number} yCenter 
 * @param {number} zCenter 
 */
export const project = (p, xCenter = 160, yCenter = 100, zCenter = 256) => ({
    x: 256 * p.x / (p.z + zCenter) + xCenter,
    y: 256 * p.y / (p.z + zCenter) + yCenter,
});
