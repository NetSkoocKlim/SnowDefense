import {PolygonCollision} from "../../collision.js";
import {getRectangleBorders, ObjType} from '../../utilities.js'
import {Canvas} from "../../canvas/canvas.js";
import {BaseGun} from "../gun/baseGun.js";


export class Base {
    basePanel;

    constructor() {
        this.type = ObjType.Base;
        this.size = Canvas.width*0.2;

        this.position = {
            x: Canvas.width/2 - this.size/2,
            y: Canvas.width/2 - this.size/2,
        }

        this.baseImg = new Image();
        this.baseImg.src = "./assets/base/base.png"
        this.maxHealthPoints = 150;

        this.healthPoints = this.maxHealthPoints;

        this.collision = new PolygonCollision({x: this.center.x - this.size / 2 * 0.9, y: this.center.y - this.size / 2 * 0.8}, getRectangleBorders(this.size * 0.9, this.size * 0.85), 0);
        this.gun = new BaseGun(this.center, this.size * 0.2, this.size * 0.45);

    }

    reset() {
        this.healthPoints = this.maxHealthPoints;
        this.gun.reset();
        this.basePanel.reset();

    }

    get center() {
        return {
            x: this.position.x + this.size / 2,
            y: this.position.y + this.size / 2,
        }
    }


    draw({collision=false}) {
        Canvas.ctx.drawImage(this.baseImg, 0, 0, 884, 837, this.position.x, this.position.y, this.size, this.size);
        if (collision) this.collision.draw();
    }
}




