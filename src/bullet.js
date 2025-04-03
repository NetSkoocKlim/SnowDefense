import {CircleCollision, Collision, PolygonCollision} from "./collision.js";
import {getTriangleBorder} from "./utilities.js";


export class Bullet {
    constructor(x, y, velocity, ctx) {
        this.ctx = ctx;
        this.velocity = velocity;
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);

        this.scale = 6;
        this.triangleSize = {width: 3*this.scale, height: 2 *this.scale};
        this.circleRadius = this.scale;

        this.startPosition = {
            x: x,
            y: y,
        }

        this.endPosition = {
            x: this.startPosition.x + this.triangleSize.width * Math.cos(this.angle),
            y: this.startPosition.y + this.triangleSize.width * Math.sin(this.angle)
        }

        this.speed = 0.5;

        this.circleCollision = new CircleCollision(
            this,
            this.endPosition,
            this.circleRadius,
            this.ctx
        );
        this.triangleCollision = new PolygonCollision(
            this,
            this.startPosition,
            getTriangleBorder(this.triangleSize.width, this.triangleSize.height),
            this.angle,
            this.ctx
        );
    }


    checkHit(enemy) {
        return Collision.checkPolygonAndCircleCollision(enemy.collision, this.circleCollision)
            || Collision.checkPolygonsCollision(this.triangleCollision, enemy.collision);
    }


    checkWallConflict(base, sceneSize) {
        let {x, y} = this.circleCollision.position;
        if (x >= base.position.x && x <= (base.position.x + base.size) &&
            y >= base.position.y && y <= (base.position.y + base.size)) {
            return false;
        }
        let {x:xt, y: yt} = this.triangleCollision.position;
        if (xt < 0 || x > sceneSize || y < 0 || y > sceneSize) return true;
        for (let i = 0; i < Collision.pathCollisions.length; i++) {
            let path = Collision.pathCollisions[i];
            if (Collision.checkPolygonAndCircleCollision(path, this.circleCollision)) return true;
            if (Collision.checkPolygonsCollision(path, this.triangleCollision)) return true;
        }
        return false;
    }

    draw() {
        this.drawTriangle();
        this.drawCircle();
    }

    drawCircle() {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        this.ctx.fillStyle = 'pink';
        this.ctx.beginPath();
        this.ctx.arc(
            this.startPosition.x + this.triangleSize.width * cos,
            this.startPosition.y + this.triangleSize.width * sin,
            this.circleRadius,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    drawTriangle() {
        const points = this.triangleCollision.getRotatedPoints();
        this.ctx.fillStyle = 'orange';
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach(p => this.ctx.lineTo(p.x, p.y));
        this.ctx.closePath();
        this.ctx.fill();
    }

    update() {
        this.startPosition.x += this.velocity.x * this.speed;
        this.startPosition.y += this.velocity.y * this.speed;
        this.endPosition.x += this.velocity.x * this.speed;
        this.endPosition.y += this.velocity.y * this.speed;
    }

}
