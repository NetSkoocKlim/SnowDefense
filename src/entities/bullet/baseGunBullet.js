import {Collision} from "../../collision.js";
import {Bullet} from "./bullet.js";

export class BaseGunBullet extends Bullet {
    constructor(x, y, velocity) {
        super(x, y, velocity, 6, 1);
    }

    checkWallConflict() {
        for (let i = 0; i < Collision.pathCollisions.length; i++) {
            let path = Collision.pathCollisions[i];
            if (Collision.checkPolygonAndCircleCollision(path, this.collisions.circleCollision)) return true;
            if (Collision.checkPolygonsCollision(path, this.collisions.triangleCollision)) return true;
        }
        return false;
    }
}