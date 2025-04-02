
export class Collision {

    static pathCollisions = [];

    constructor(obj, position, width, height, ctx) {
        this.obj = obj;
        this.ctx = ctx;
        this.position = position;
        this.width = width;
        this.height = height;
    }


    draw() {
        this.ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    }

}


export class CircleCollision {
    constructor(obj, position, radius, ctx) {
        this.obj = obj;
        this.ctx = ctx;
        this.position = position;
        this.radius = radius;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        this.ctx.stroke();
    }
}

export class TriangleCollision {
    constructor(obj, position, size, angle, ctx) {
        this.obj = obj;
        this.ctx = ctx;
        this.position = position;
        this.size = size;
        this.angle = angle;
        this.points = this.calculatePoints();
    }

    calculatePoints() {
        return [
            { x: this.size.width, y: -this.size.height / 2 },
            { x: this.size.width, y: this.size.height / 2 },
            { x: 0, y: 0 }
        ];
    }

    getRotatedPoints() {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        return this.points.map(point => ({
            x: this.position.x + point.x * cos - point.y * sin,
            y: this.position.y + point.x * sin + point.y * cos
        }));
    }


    draw() {
        const points = this.getRotatedPoints();
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach(p => this.ctx.lineTo(p.x, p.y));
        this.ctx.closePath();
        this.ctx.stroke();
    }
}