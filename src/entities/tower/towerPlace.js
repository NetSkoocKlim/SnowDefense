import {PolygonCollision} from "../../collision.js";
import {createDivElement, getRectangleBorders} from "../../utilities.js";
import {Canvas} from "../canvas";
import {Game} from "../../game.js";
import {UpgradeMenu} from "../../gui/upgradeMenu.js";
import {TowerUpgrade} from "../upgrade";


export class TowerPlace {
    static towerCosts = [15, 30, 80, 160];
    static towerPlacedCount = 0;

    constructor(position, size) {
        this.position = position;
        this.size = size;
        this.towerIsPlaced = false;
        this.collision = new PolygonCollision({
            x: this.position.x - 5,
            y: this.position.y - 5
        }, getRectangleBorders(this.size + 10, this.size + 10), 0);
        this.towerPlaceDiv = createDivElement(document.querySelector('#game'), this.collision.position, this.size, this.size, 'towerPlace');
        this.isSelected = false;

        //this.buyMenu = new BuyMenu();
        this.upgradeMenu = new UpgradeMenu();

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

    handleTowerPlaceClick() {
        if (!this.towerIsPlaced) {
            //if (!buyMenuIsActive){
            //buyMenuIsActive=true;
            //this.buyMenu.show();
            //}
            //else{
            //buyMenuIsActive=false;
            //this.buyMenu.hide();
            //}
        }
        else {
            //if (!towerBuyMenuIsActive) {
            //towerUpgradeMenuIsActive=true;
            //this.upgradeMenu.show();
            //}
            //else{
            //towerUpgradeMenuIsActive=false;
            //this.upgradeMenu.hide();
            //}
        }
    }

    setTower() {
        Game.points.decrease(TowerPlace.towerCost);
        for (let i = 0;i<4;i++) {
            let tower = Game.towers[i];
            if (tower.isActive === false) {
                tower.isActive = true;
                tower.setPosition(this.center, this.size)
                this.placedTower = tower;
                TowerPlace.towerPlacedCount++;
                break;
            }
        }
        this.towerIsPlaced = true;
        this.upgradeMenu.setUpgradable(this.placedTower.gun);
        console.log("New tower cost is", TowerPlace.towerCost);
    }

    sellTower() {
        for (let i = 0;i<4;i++) {
            let tower = Game.towers[i];
            if (tower === this.placedTower) {
                this.placedTower = null;
                tower.isActive = false;
                this.towerIsPlaced = false;
                TowerPlace.towerPlacedCount--;
                break;
            }
        }
        Game.points.increase(Math.floor(TowerPlace.towerCost));
    }

    draw() {
        if (!this.isSelected && !this.towerIsPlaced)
            Canvas.ctx.fillStyle = '#ff0000';
        else
            Canvas.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        Canvas.ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
        this.collision.draw();
    }
}