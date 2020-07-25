// @ts-check
/**
 * @typedef { import("./math").Point3Data } Point3Data
 */

import { Point3 } from "./math.js";

export class Matrix4 {

    /**
     * @param {number[][]} values 
     */
    constructor(values) {
        this.values = values;
    }

    /**
     * Create a new identity matrix.
     */
    static identity() {
        return new Matrix4([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);
    }

    /**
     * Create an X rotation matrix.
     * @param {number} theta the angle to rotate around the X axis (in radians)
     */
    static xRotation(theta) {
        return new Matrix4([
            [1, 0, 0, 0],
            [0, Math.cos(theta), -Math.sin(theta), 0],
            [0, Math.sin(theta), Math.cos(theta), 0],
            [0, 0, 0, 1],
        ]);
    }

    /**
     * Create a Y rotation matrix.
     * @param {number} theta the angle to rotate around the Y axis (in radians)
     */
    static yRotation(theta) {
        return new Matrix4([
            [Math.cos(theta), 0, Math.sin(theta), 0],
            [0, 1, 0, 0],
            [-Math.sin(theta), 0, Math.cos(theta), 0],
            [0, 0, 0, 1],
        ]);
    }

    /**
     * Create a z rotation matrix.
     * @param {number} theta the angle to rotate around the Z axis (in radians)
     */
    static zRotation(theta) {
        return new Matrix4([
            [Math.cos(theta), -Math.sin(theta), 0, 0],
            [Math.sin(theta), Math.cos(theta), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);
    }

    /**
     * Create a translation matrix.
     * @param {number} x the X distance to translate 
     * @param {number} y the Y distance to translate 
     * @param {number} z the Z distance to translate 
     */
    static translation(x, y, z) {
        return new Matrix4([
            [1, 0, 0, x],
            [0, 1, 0, y],
            [0, 0, 1, z],
            [0, 0, 0, 1],
        ]);
    }

    /**
     * @param {Matrix4} b 
     */
    mul(b) {
        const result = Matrix4.identity();
        for (let i = 0; i < 4; i++) {
            result[i] = new Array(4);
        }

        for (let c = 0; c < 4; c++) {
            for (let d = 0; d < 4; d++) {
                let sum = 0;
                for (let k = 0; k < 4; k++) {
                    sum = sum + this.values[c][k] * b.values[k][d];
                }
                result[c][d] = sum;
            }
        }

        return result;
    }

    /**
     * Transform a vertex by multiplying it by a matrix.
     * @param {Point3Data} v the vertex
     */
    transform(v) {
        return new Point3([
            v.x * this.values[0][0] + v.y * this.values[0][1] + v.z * this.values[0][2] + this.values[0][3],
            v.x * this.values[1][0] + v.y * this.values[1][1] + v.z * this.values[1][2] + this.values[1][3],
            v.x * this.values[2][0] + v.y * this.values[2][1] + v.z * this.values[2][2] + this.values[2][3],
        ]);
    }
}
