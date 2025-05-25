import {LevelManager} from "../level/levelManager/levelManager.js";

export class Points {
    constructor() {
        this.currentPoints = 100;
    }

    reset() {
        this.currentPoints = 100;
    }

    setPoints(points) {
        this.currentPoints = points;
    }

    increase(value) {
        this.currentPoints += value;
    }

    decrease(value) {
        this.currentPoints -= value;
        LevelManager.moneySpend += value;

    }

}