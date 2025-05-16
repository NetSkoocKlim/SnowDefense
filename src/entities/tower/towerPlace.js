import {createDivElement, drawCircle} from "../../utilities.js";
import {Canvas} from "../canvas";
import {Game} from "../../game.js";
import {UpgradeMenu} from "../../gui/upgradeMenu.js";


export class TowerPlace {
    static towerCosts = [15, 30, 80, 160];
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
            this.setTower()
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

        if (!this.isSelected && !this.towerIsPlaced) {
            drawCircle(this.center.x, this.center.y, this.size / 2, 'rgba(166,202,240, 0.3)', true);
        }
        else {
            drawCircle(this.center.x, this.center.y, this.size / 2,'rgba(157,177,204, 0.6)', true);
        }
        //Canvas.ctx.drawImage(this.towerPlaceImg, 0, 0, 616, 617, this.position.x, this.position.y, 1.5 * this.size, 1.5*this.size);
    }
}