import {Bullet} from "./bullet.js";

export class TowerGunBullet extends Bullet {
    constructor(x, y, velocity, fireTarget, maxDist) {
        super(x, y, velocity, 4, 1);
        this.fireSource = fireTarget;
        this.start = {x: x, y: y};
        this.maxDist = maxDist;
    }

    checkEnd() {
        let {x, y} = this.collisions.circleCollision.position;
        let D = {
            x: this.fireSource.x - this.start.x,
            y: this.fireSource.y - this.start.y,
        }
        let V = {
            x: x - this.start.x,
            y: y - this.start.y
        }
        return this.dot(V, D) / this.dot(D, D) >= 1 || Math.sqrt(this.dot(V, V)) >= this.maxDist;
    }

    dot(v1, v2) {
        return v1.x*v2.x + v1.y*v2.y;
    }

}