import {CircleCollision, Collision, PolygonCollision} from "./collision.js";
import {drawCircle, drawPolygon, getTriangleBorder} from "./utilities.js";
import {Canvas} from "./canvas.js";


class Bullet {

    constructor(x, y, velocity, scale, speed) {
        this.velocity = velocity;
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);
        this.scale = scale;
        this.triangleSize = {width: 3 * this.scale, height: 2 * this.scale};
        this.circleRadius = this.scale;
        this.trianglePosition = {
            x: x,
            y: y,
        }
        this.circlePosition = {
            x: this.trianglePosition.x + this.triangleSize.width * Math.cos(this.angle),
            y: this.trianglePosition.y + this.triangleSize.width * Math.sin(this.angle)
        }
        this.speed = speed;
        this.trianglePoints = getTriangleBorder(this.triangleSize.width, this.triangleSize.height);
        this.collisions = {
            circleCollision: new CircleCollision(
                this.circlePosition,
                this.circleRadius,
            ),
            triangleCollision: new PolygonCollision(
                this.trianglePosition,
                this.trianglePoints,
                this.angle
            )
        };

    }

    checkHit(enemy) {
        return Collision.checkPolygonAndCircleCollision(enemy.collision, this.collisions.circleCollision)
            || Collision.checkPolygonsCollision(this.collisions.triangleCollision, enemy.collision);
    }


    update() {
        this.trianglePosition.x += this.velocity.x * this.speed;
        this.trianglePosition.y += this.velocity.y * this.speed;
        this.circlePosition.x += this.velocity.x * this.speed;
        this.circlePosition.y += this.velocity.y * this.speed;
    }

    draw() {
        drawPolygon(Canvas.ctx, this.collisions.triangleCollision.getRotatedPoints(), 'orange');
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        drawCircle(Canvas.ctx, this.trianglePosition.x + this.triangleSize.width * cos,
            this.trianglePosition.y + this.triangleSize.width * sin,
            this.circleRadius,
            'pink');
    }
}


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