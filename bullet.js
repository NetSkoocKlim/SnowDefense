import {CircleCollision, Collision, TriangleCollision} from "./collision.js";


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

        this.speed = 1.5;

        this.circleCollision = new CircleCollision(
            this,
            this.endPosition,
            this.circleRadius,
            this.ctx
        );
        this.triangleCollision = new TriangleCollision(
            this,
            this.startPosition,
            this.triangleSize,
            this.angle,
            this.ctx
        );
    }


    checkCollision(enemy) {
        return this.checkCircleCollision(enemy) || this.checkTriangleCollision(enemy);
    }

    checkCircleCollision(enemy) {
        let {x: cx, y: cy} = this.circleCollision.position;

        let {x: x1, y: y1} = enemy.collision.position;
        let w = enemy.collision.width;
        let h = enemy.collision.height;

        if (x1 <= cx && (cx <= x1 + w) && y1 <= cy && cy <= y1 + h) {
            return true
        }

        if (x1 <= cx && (cx <= x1 + w)) {
            let distance_top = Math.abs(cy - y1)
            let distance_bottom = Math.abs(cy - y1 - h)
            if (distance_top <= this.circleRadius || distance_bottom <= this.circleRadius) {
                return true
            }
        }

        if (y1 <= cy && (cy <= y1 + h)) {
            let distance_left = Math.abs(cx - x1)
            let distance_right = Math.abs(cx - x1 - w)
            if (distance_left <= this.circleRadius || distance_right <= this.circleRadius) {
                return true
            }
        }

        let corners = [{x: x1, y: y1}, {x: x1 + w, y: y1}, {x: x1, y: y1 + h},
            {x: x1 + w, y: y1 + h}];

        corners.forEach((corner) => {
            let {x, y} = corner;
            if (Math.sqrt((cx - x) ** 2 + (cy - y) ** 2) <= this.circleRadius) {
                return true;
            }
        });

        return false;
    }

    checkTriangleCollision(enemy) {
        const trianglePoints = this.triangleCollision.getRotatedPoints();
        const enemyRect = {
            x: enemy.collision.position.x,
            y: enemy.collision.position.y,
            width: enemy.collision.width,
            height: enemy.collision.height
        };

        const enemyPolygon = [
            { x: enemyRect.x, y: enemyRect.y },
            { x: enemyRect.x + enemyRect.width, y: enemyRect.y },
            { x: enemyRect.x + enemyRect.width, y: enemyRect.y + enemyRect.height },
            { x: enemyRect.x, y: enemyRect.y + enemyRect.height }
        ];

        return this.polygonsCollide(trianglePoints, enemyPolygon);
    }

    polygonsCollide(polygon1, polygon2) {
        const polygons = [polygon1, polygon2];
        for (let i = 0; i < polygons.length; i++) {
            const polygon = polygons[i];
            for (let j = 0; j < polygon.length; j++) {
                const start = polygon[j];
                const end = polygon[(j + 1) % polygon.length];
                const normal = {
                    x: end.y - start.y,
                    y: start.x - end.x
                };

                const [minA, maxA] = this.projectPolygon(polygon1, normal);
                const [minB, maxB] = this.projectPolygon(polygon2, normal);

                if (maxA < minB || maxB < minA) return false;
            }
        }
        return true;
    }

    projectPolygon(polygon, axis) {
        let min = Infinity;
        let max = -Infinity;
        for (const point of polygon) {
            const projected = point.x * axis.x + point.y * axis.y;
            min = Math.min(min, projected);
            max = Math.max(max, projected);
        }
        return [min, max];
    }

    checkWallCollision(base) {
        let {x, y} = this.circleCollision.position;

        if (x >= base.position.x && x <= (base.position.x + base.size) &&
            y >= base.position.y && y <= (base.position.y + base.size)) {
            return false;
        }

        for (let i = 0; i < Collision.pathCollisions.length; i++) {
            let path = Collision.pathCollisions[i];
            if (x >= path.position.x && x <= (path.position.x + path.width) &&
                y >= path.position.y && y <= (path.position.y + path.height)) {
                return true;
            }
        }

        const trianglePoints = this.triangleCollision.getRotatedPoints();
        for (const path of Collision.pathCollisions) {
            const pathRect = {
                x: path.position.x,
                y: path.position.y,
                width: path.width,
                height: path.height
            };
            const pathPolygon = [
                { x: pathRect.x, y: pathRect.y },
                { x: pathRect.x + pathRect.width, y: pathRect.y },
                { x: pathRect.x + pathRect.width, y: pathRect.y + pathRect.height },
                { x: pathRect.x, y: pathRect.y + pathRect.height }
            ];

            if (this.polygonsCollide(trianglePoints, pathPolygon)) {
                return true;
            }
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
