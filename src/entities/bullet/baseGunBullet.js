import {Collision} from "../../collision.js";
import {Bullet} from "./bullet.js";

export class BaseGunBullet extends Bullet {
    constructor(x, y, velocity) {
        super(x, y, velocity, 6, 1);
    }

    checkWallConflict(base, sceneSize) {
        let {x, y} = this.collisions.circleCollision.position;
        if (x >= base.position.x && x <= (base.position.x + base.size) &&
            y >= base.position.y && y <= (base.position.y + base.size)) {
            return false;
        }
        let {x: xt, y: yt} = this.collisions.triangleCollision.position;
        if (xt < 0 || x > sceneSize || yt < 0 || yt > sceneSize) return true;
        for (let i = 0; i < Collision.pathCollisions.length; i++) {
            let path = Collision.pathCollisions[i];
            if (Collision.checkPolygonAndCircleCollision(path, this.collisions.circleCollision)) return true;
            if (Collision.checkPolygonsCollision(path, this.collisions.triangleCollision)) return true;
        }
        return false;
    }
}