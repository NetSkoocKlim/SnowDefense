import {LevelManager} from "../level/levelManager/levelManager.js";

export class Points {
    constructor() {
        this.currentPoints = 100;
        this.position = {x: 0, y: 0}
        this.increase(0);
    }

    reset() {
        this.currentPoints = 100;
    }

    increase(value) {
        this.currentPoints += value;
    }

    decrease(value) {
        this.currentPoints -= value;
        LevelManager.moneySpend += value;

    }

}