import {CircleCollision, Collision, PolygonCollision} from "../../collision.js";
import {drawCircle, drawPolygon, getTriangleBorder} from "../../utilities.js";
import {Canvas} from "../canvas/";


export class Bullet {

    constructor(x, y, velocity, scale, speed) {
        this.velocity = velocity;
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);
        this.scale = scale * Canvas.scale;
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
        return Collision.checkPolygonAndCircleCollision(enemy.collisions.head, this.collisions.circleCollision) ||
            Collision.checkPolygonAndCircleCollision(enemy.collisions.body, this.collisions.circleCollision) ||
            Collision.checkPolygonsCollision(this.collisions.triangleCollision, enemy.collisions.head) ||
            Collision.checkPolygonsCollision(this.collisions.triangleCollision, enemy.collisions.body);
    }


    update() {
        this.trianglePosition.x += this.velocity.x * this.speed;
        this.trianglePosition.y += this.velocity.y * this.speed;
        this.circlePosition.x += this.velocity.x * this.speed;
        this.circlePosition.y += this.velocity.y * this.speed;
    }

    draw({collision = false}) {
        drawPolygon(Canvas.ctx, this.collisions.triangleCollision.getRotatedPoints(), 'orange');
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        drawCircle(Canvas.ctx, this.trianglePosition.x + this.triangleSize.width * cos,
            this.trianglePosition.y + this.triangleSize.width * sin,
            this.circleRadius,
            'pink');
        if (collision) {
            this.collisions.circleCollision.draw();
            this.collisions.triangleCollision.draw();
        }
    }
}
