/**
 * @typedef {{ x: number, y: number }} Point2
 * @typedef {{ x: number, y: number, z: number }} Point3
 */

export const randomPoint2 = () => ({
    x: Math.random() * 320,
    y: Math.random() * 200,
});
