import {Canvas} from "../canvas/";
import {TowerGun} from "../gun/";
import {ObjType} from "../../utilities.js";
import {Game} from "../../game.js";

export class Tower {

    constructor() {
        this.type = ObjType.Tower;
        this.isActive = false;
        this.towerImg = new Image();
        this.towerImg.src = "./assets/tower/tower.png";
    }

    static initTowers() {
        for (let i = 0;i<4;i++) {
            let tower = new Tower();
            Game.towers.push(tower);
        }
    }

    get position() {
        return {
            x: this.center.x - this.size / 2,
            y: this.center.y - this.size / 2,
        }
    }

    setPosition(center, size) {
        this.center = center;
        this.size = size;
        this.gun = new TowerGun(this.center, this.size * 0.4 , this.size * 0.9);
    }


    draw({collision=false}) {
        //Canvas.ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
        Canvas.ctx.drawImage(this.towerImg, 0, 0, 781, 886, this.position.x, this.position.y, this.size, this.size * 1.134)
        this.gun.draw({collision: collision});
    }

}