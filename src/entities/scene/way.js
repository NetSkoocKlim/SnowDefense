import {Collision, PolygonCollision} from "../../collision.js";
import {getRectangleBorders} from "../../utilities.js";
import {Canvas} from "../canvas";

export class Way {
    constructor(position, width, height) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.collision = new PolygonCollision(this.position, getRectangleBorders(this.width, this.height),
            0);
        Collision.pathCollisions.push(this.collision);
    }

    draw() {
        Canvas.ctx.fillStyle = '#fff';
        Canvas.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}