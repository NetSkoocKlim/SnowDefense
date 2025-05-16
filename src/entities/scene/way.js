import {Collision, PolygonCollision} from "../../collision.js";
import {getRectangleBorders} from "../../utilities.js";
import {Canvas} from "../canvas";
import {Game} from "../../game.js";

export class Way {
    constructor(position, width, height, side) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.side = side;
        this.addCollision();
        this.wayImage = new Image();
        this.wayImage.src = "./assets/map/way.jpg"
    }

    addCollision() {
        let collisionPosition = {x: null, y: null};
        let collisionSize = Canvas.width / 2 - Game.base.size / 2 * 0.8;
        switch (this.side) {
            case 1:
                collisionPosition.x = 0;
                collisionPosition.y = 0;
                this.collision = new PolygonCollision(collisionPosition, getRectangleBorders(collisionSize, collisionSize), 0);
                break;
            case 2:
                collisionPosition.x = 0;
                collisionPosition.y =  Canvas.width / 2 + Game.base.size / 2 * 0.9;
                break;
            case 3:
                collisionPosition.x =  Canvas.width / 2 + Game.base.size / 2 * 0.9;
                collisionPosition.y =  Canvas.width / 2 + Game.base.size / 2 * 0.9;
                break;
            case 4:
                collisionPosition.x =  Canvas.width / 2 + Game.base.size / 2 * 0.9;
                collisionPosition.y =  0;
                break;
        }
        this.collision = new PolygonCollision(collisionPosition, getRectangleBorders(collisionSize, collisionSize), 0);
        Collision.pathCollisions.push(this.collision);
    }

    draw() {
        // Canvas.ctx.fillStyle = '#fff';
        // Canvas.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        Canvas.ctx.save();
        Canvas.ctx.translate(this.position.x, this.position.y);
        if (this.side % 2 === 1) {
            Canvas.ctx.rotate(Math.PI / 2);
            Canvas.ctx.translate(0, -this.width);
            Canvas.ctx.drawImage(this.wayImage, 0, 0, 234, 1092, 0, 0, this.height, this.width);

        }
        else {
            Canvas.ctx.drawImage(this.wayImage, 0, 0, 234, 1092, 0, 0, this.width, this.height);

        }
        Canvas.ctx.restore();

    }
}