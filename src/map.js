import {getRectangleBorders, ObjectType} from "./utilities.js";
import {Collision, PolygonCollision} from "./collision.js";
import {Base} from "./base.js";
export class Path {
    constructor(position, width, height, ctx) {
        this.objectType = ObjectType.Path;
        this.position = position;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.collision = new PolygonCollision(this, this.position, getRectangleBorders(this.width, this.height), 0, this.ctx);
        Collision.pathCollisions.push(this.collision);
    }

    draw() {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}


export class Map {
    static pathes = [];

    constructor(canvas, sceneSize, ctx) {
        this.sceneSize = sceneSize;
        this.ctx = ctx;
        this.base = new Base(sceneSize, this.ctx);
        this.createPathes();
    }

    createPathes() {
        let pathSize =  (this.sceneSize - this.base.size) / 2;
        Map.pathes.push(
            new Path({
                x: 0,
                y: 0
            }, pathSize, pathSize, this.ctx),
            new Path( {
                x: pathSize + this.base.size,
                y: 0
            }, pathSize, pathSize, this.ctx),
            new Path( {
                x: pathSize + this.base.size,
                y: pathSize + this.base.size
            }, pathSize, pathSize, this.ctx),
            new Path( {
                x: 0,
                y: pathSize + this.base.size
            }, pathSize, pathSize, this.ctx),
        )
    }

    draw({collision=false}) {
        this.ctx.fillStyle = '#ad5f3e';
        this.ctx.fillRect(0, 0, this.sceneSize, this.sceneSize);
        Map.pathes.forEach(path => {
            path.draw();
        })
        if (collision) Collision.pathCollisions.forEach(pathCollision => {
            pathCollision.draw();
        })
    }

}