import {PolygonCollision} from "../../collision.js";
import {getRectangleBorders, ObjType} from '../../utilities.js'
import {Canvas} from "../canvas/";
import {BaseGun} from "../gun/";


export class Base {
    constructor() {
        this.type = ObjType.Base;

        this.size = Canvas.width*0.2;
        this.position = {
            x: Canvas.width/2 - this.size/2,
            y: Canvas.width/2 - this.size/2,
        }

        this.collision = new PolygonCollision(this.position, getRectangleBorders(this.size, this.size), 0);
        this.gun = new BaseGun(this.center, this.size * 0.35, this.size * 0.2);
    }

    get center() {
        return {
            x: this.position.x + this.size / 2,
            y: this.position.y + this.size / 2,
        }
    }

    draw({collision=false}) {
        Canvas.ctx.fillStyle = 'brown';
        Canvas.ctx.fillRect(this.position.x,this.position.y,  this.size, this.size);
        if (collision) this.collision.draw();
    }
}




