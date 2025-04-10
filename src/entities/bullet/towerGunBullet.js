import {Bullet} from "./bullet.js";

export class TowerGunBullet extends Bullet {
    constructor(x, y, velocity, fireSource) {
        super(x, y, velocity, 4, 1);
        this.fireSource = fireSource;
    }

    checkEnd() {
        let {x, y} = this.collisions.circleCollision.position;
        return Math.abs(x - this.fireSource.x) < this.speed && Math.abs(y - this.fireSource.y) <= this.speed;
    }

}