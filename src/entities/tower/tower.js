import {Canvas} from "../../canvas/canvas.js";
import {TowerGun} from "../gun/towerGun.js";
import {ObjType} from "../../utilities.js";
import {Game} from "../../game.js";
import {TowerMenu} from "../../ui/towerMenu.js";

export class Tower {

    constructor() {
        this.type = ObjType.Tower;
        this.isActive = false;
        this.isSetted = false;
        this.towerImg = new Image();
        this.towerImg.src = "./assets/tower/tower.png";
        this.gun = new TowerGun();
        this.towerMenu = new TowerMenu(this.position);
    }

    static initTowers() {
        for (let i = 0;i<4;i++) {
            Game.towers[i] = new Tower();
        }
    }

    reset() {
        this.isActive = false;
        this.gun.reset();
    }


    get position() {
        if (this.center !== undefined)
        return {
            x: this.center.x - this.size / 2,
            y: this.center.y - this.size / 2,
        }
        return {x: 0, y:0};
    }

    setPosition(center, size) {
        this.center = center;
        this.size = size;
        this.towerMenu.setPosition(this.center);
        this.towerMenu.tower = this;
        this.gun.set(this.center, this.size * 0.4 , this.size * 0.9);
    }


    draw({collision=false}) {
        Canvas.ctx.drawImage(this.towerImg, 0, 0, 781, 886, this.position.x, this.position.y, this.size, this.size * 1.134)
        this.gun.draw({collision: collision});
    }

}