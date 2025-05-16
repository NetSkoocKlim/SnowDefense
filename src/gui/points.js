
export class Points {
    constructor() {
        this.currentPoints = 100000;
        this.position = {x: 0, y: 0}
        this.increase(0);
    }


    increase(value) {
        this.currentPoints += value;
    }

    decrease(value) {
        this.currentPoints -= value;
    }

}