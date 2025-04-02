import {ObjectType} from "./utilities.js";
import {Collision} from "./collision.js";

export class Path {
    constructor(position, width, height, ctx) {
        this.objectType = ObjectType.Path;
        this.position = position;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.collision = new Collision(this, this.position, this.width, this.height, this.ctx);
    }

    draw() {
        this.ctx.fillStyle = '#ad5f3e';
        this.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}


export class Map {
    static pathes = [];
}