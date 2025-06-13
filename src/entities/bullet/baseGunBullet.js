import {Collision} from "../../collision.js";
import {Bullet} from "./bullet.js";
import {Canvas} from "../../canvas/canvas.js";

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


    processHit(gun, bulletInd) {
        if (this.checkWallConflict()) {
            gun.bullets.splice(bulletInd, 1);
            return;
        }
        if (this.trianglePosition.x < 0 || this.trianglePosition.x > Canvas.width) {
            gun.bullets.splice(bulletInd, 1);
            return;
        }
        if (this.trianglePosition.y < 0 || this.trianglePosition.y > Canvas.height) {
            gun.bullets.splice(bulletInd, 1);
            return;
        }
        super.processHit(gun, bulletInd);
    }
}