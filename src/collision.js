import {rotatePoint} from "./utilities.js";
import {Canvas} from "./entities/canvas/";


export class Collision {
    static pathCollisions = [];

    static checkPolygonsCollision(polygon1, polygon2) {
        const polygons = [polygon1, polygon2].map((polygon) => polygon.getRotatedPoints());
        for (let i = 0; i < polygons.length; i++) {
            const polygon = polygons[i];
            for (let j = 0; j < polygon.length; j++) {
                const start = polygon[j];
                const end = polygon[(j + 1) % polygon.length];
                const normal = {
                    x: end.y - start.y,
                    y: start.x - end.x
                };
                const [minA, maxA] = PolygonCollision.projectPolygon(polygons[0], normal);
                const [minB, maxB] = PolygonCollision.projectPolygon(polygons[1], normal);
                if (maxA < minB || maxB < minA) return false;
            }
        }
        return true;
    }

    static checkPolygonAndPointCollision(poly, point) {
        const {x , y} = point;
        const polygon = poly.getRotatedPoints();
        let inside = false;
        const n = polygon.length;
        for (let i = 0; i < n; i++) {
            const p1 = polygon[i];
            const p2 = polygon[(i + 1) % n];
            const y1 = p1[1], y2 = p2[1];

            if ((y1 > y) === (y2 > y)) continue;

            const x1 = p1[0], x2 = p2[0];
            if (y1 === y2) continue;

            const t = (y - y1) / (y2 - y1);
            const xIntersect = x1 + t * (x2 - x1);

            if (xIntersect > x) inside = !inside;
        }
        return inside;
    }

    static checkPolygonAndCircleCollision(polygon, circle) {
        if (Collision.checkPolygonAndPointCollision(polygon, circle.position)) return true;
        const points = polygon.getRotatedPoints();
        const n = points.length;
        const {x:cx, y:cy} = circle.position;
        for (let i = 0; i < n; i++) {
            const {x:ax, y:ay} = points[i];
            const {x:bx, y:by} = points[(i+1) % n];
            const distToStartSq = (ax - cx)**2 + (ay - cy)**2;
            const distToEndSq = (bx - cx)**2 + (by - cy)**2;
            const rSq = circle.radius**2;

            if (distToStartSq <= rSq || distToEndSq <= rSq)
                return true;

            const abx = bx - ax;
            const aby = by - ay;
            const acx = cx - ax;
            const acy = cy - ay;
            const lenAbSq = abx**2 + aby**2;

            if (lenAbSq === 0)
                return false;

            const t = Math.max(0, Math.min(1, (acx * abx + acy * aby) / lenAbSq));
            const nearestX = ax + t * abx;
            const nearestY = ay + t * aby;
            const dx = cx - nearestX;
            const dy = cy - nearestY;

            if (dx**2 + dy**2 <= rSq)
                return true;
        }
        return false;
    }
}


export class PolygonCollision {
    constructor(position, points, angle) {
        this.points = points;
        this.position = position;
        this.angle = angle;
    }

    getRotatedPoints() {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        return this.points.map(point => {
            let rotated_point = rotatePoint(point, this.angle);
            return {
                x: this.position.x + rotated_point.x,
                y: this.position.y + rotated_point.y
            }
        });
    }

    static projectPolygon(polygon, axis) {
        let min = Infinity;
        let max = -Infinity;
        for (const point of polygon) {
            const projected = point.x * axis.x + point.y * axis.y;
            min = Math.min(min, projected);
            max = Math.max(max, projected);
        }
        return [min, max];
    }

    draw() {
        const points = this.getRotatedPoints();
        Canvas.ctx.beginPath();
        Canvas.ctx.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach(p => Canvas.ctx.lineTo(p.x, p.y));
        Canvas.ctx.closePath();
        Canvas.ctx.stroke();
    }
}


export class CircleCollision {
    constructor(position, radius) {
        this.position = position;
        this.radius = radius;
    }

    draw() {
        Canvas.ctx.beginPath();
        Canvas.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        Canvas.ctx.stroke();
    }
}

