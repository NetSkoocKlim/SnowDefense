import {Canvas} from "../canvas/";
import {createDivElement} from "../../utilities.js";
import {TowerGun} from "../gun/";
import {ObjType} from "../../utilities.js";
import {Game} from "../../game.js";
import {Map} from "../map/";

export class Tower {
    static cost = 5;
    constructor(placeDiv, center, size) {
        this.type = ObjType.Tower;
        this.center = center;
        this.sizeDifference = 5;
        this.attack = 5;
        this.size = size + 2 * this.sizeDifference;
        this.gun = new TowerGun(this.center, this.size * 0.4, this.size * 0.2);
        this.towerDiv = createDivElement(placeDiv, {x: -this.sizeDifference, y:-this.sizeDifference}, this.size, this.size, 'tower');
    }

    get position() {
        return {
            x: this.center.x - this.size / 2,
            y: this.center.y - this.size / 2,
        }
    }

    static buyTower(place) {
        Game.points.decrease(Tower.cost);
        place.towerIsPlaced = true;
        const tower = new Tower(place.towerPlaceDiv, place.center, place.size);
        Map.towers.push(tower);
    }

    draw({collision=false}) {
        Canvas.ctx.fillStyle = 'blue';
        Canvas.ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
        this.gun.draw({collision: collision});
    }
}