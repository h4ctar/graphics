import { Matrix4 } from "../lib/matrix.js";
import { Point3 } from "../lib/math.js";

export class Camera {

    /**
     * @param {Point3} pos
     * @param {number} phi
     * @param {number} theta
     */
    constructor(pos, phi, theta) {
        this.pos = pos;
        this.phi = phi;
        this.theta = theta;
        this.nearPlane = {
            normal: new Point3([0, 0, 1]),
            distance: 1
        };
    }

    get matrix() {
        return Matrix4.xRotation(-this.theta)
            .mul(Matrix4.yRotation(-this.phi))
            .mul(Matrix4.translation(-this.pos.x, -this.pos.y, -this.pos.z));
    }
}
