import {createDivElement, drawCircle} from "../../utilities.js";
import {Game} from "../../game.js";


export class TowerPlace {
    static towerCosts = [45, 60, 75, 90];
    static towerPlacedCount = 0;

    constructor(position, size) {
        this.position = position;
        this.size = size * 1.5;
        this.towerIsPlaced = false;

        this.towerPlaceDiv = createDivElement(document.querySelector('#game'), this.position, this.size, this.size, 'towerPlace');
        this.isSelected = false;
        this.towerPlaceImg = new Image();
        this.towerPlaceImg.src = "./assets/map/towerPlace.png";
        this.towerPlaceImg.classList.add("towerPlace");

        this.setTower();
    }

    reset() {
        TowerPlace.towerPlacedCount = 0;
        this.towerIsPlaced = false;
        this.isSelected = false;
        this.placedTower.towerMenu.hide();
        this.placedTower.towerMenu.buyRow.style.display = 'flex';
        this.placedTower.towerMenu.sellRow.style.display = 'none';
    }

    static get towerCost() {
        return TowerPlace.towerCosts[TowerPlace.towerPlacedCount];
    }

    get center() {
        return {
            x: this.position.x + this.size / 2,
            y: this.position.y + this.size / 2
        }
    }

    setTower() {
        for (let i = 0;i<4;i++) {
            let tower = Game.towers[i];
            if (tower.isSetted  === false) {
                tower.isSetted  = true;
                tower.place = this;
                tower.setPosition(this.center, this.size)
                this.placedTower = tower;
                break;
            }
        }
    }

    placeTower() {
        this.towerIsPlaced = true;
        this.placedTower.isActive = true;
    }

    draw() {
        if (!this.isSelected && !this.towerIsPlaced) {
            drawCircle(this.center.x, this.center.y, this.size / 2, 'rgba(166,202,240, 0.3)', true);
        }
        else {
            drawCircle(this.center.x, this.center.y, this.size / 2,'rgba(157,177,204, 0.6)', true);
        }
    }
}