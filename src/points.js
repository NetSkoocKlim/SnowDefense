import {LevelManager} from "./level/levelManager/levelManager.js";
import {Game} from "./game.js";

export class Points {
    constructor() {
        this.currentPoints = 100;
    }

    reset() {
        this.currentPoints = 100;
    }

    increase(value) {
        this.currentPoints += value;
        Game.statsPanel.update({
            gold: Game.points.currentPoints,
        });
        Game.base.basePanel.updateEntries();
        Game.towers.forEach(
            (tower) => {
                tower.towerMenu.updateBuyButton();
            }
        )
    }

    decrease(value) {
        this.currentPoints -= value;
        LevelManager.moneySpend += value;
        Game.statsPanel.update({
            gold: Game.points.currentPoints,
        });
        Game.base.basePanel.updateEntries();
        Game.towers.forEach(
            (tower) => {
                tower.towerMenu.updateBuyButton();
            }
        )
    }
}