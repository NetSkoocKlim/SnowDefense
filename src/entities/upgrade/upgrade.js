export class  Upgrade {
    constructor(name, levels, upgradeDescription) {
        this.maxLevel = levels.length;
        this.currentLevel = 0;
        this.name = name;
        this.levels = levels;
    }

    get value() {
        return this.levels[this.currentLevel];
    }

    upgrade() {
        this.currentLevel++;
        console.log("Текущий", this.name, "равен", this.value);
    }

}