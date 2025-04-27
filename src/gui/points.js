import {createDivElement} from "../utilities.js";

export class Points {
    constructor() {
        this.currentPoints = 0;
        this.position = {x: 0, y: 0}
        this.initPointsBlock();
        this.increase(0);
    }

    initPointsBlock() {
        this.block =  createDivElement(document.querySelector('div#game'), {x:0,y:0}, null, null, 'points');
        this.span = document.createElement("span");
        this.block.appendChild(this.span);
    }

    increase(value) {
        this.currentPoints += value;
        this.span.innerHTML = this.currentPoints.toString().padStart(5, '0');
    }

    decrease(value) {
        this.currentPoints -= value;
        this.span.innerHTML = this.currentPoints.toString().padStart(5, '0');
    }

}