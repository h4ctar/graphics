import { xRotationMatrix, multiplyMatrix, translationMatrix, yRotationMatrix } from "../lib/matrix.js";

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
            normal: { x: 0, y: 0, z: 1 },
            distance: 1
        };
        this.updateMatrix();
    }

    updateMatrix() {
        this.matrix = xRotationMatrix(-this.theta);
        this.matrix = multiplyMatrix(this.matrix, yRotationMatrix(-this.phi));
        this.matrix = multiplyMatrix(this.matrix, translationMatrix({ x: -this.pos.x, y: -this.pos.y, z: -this.pos.z }));
    }
}
