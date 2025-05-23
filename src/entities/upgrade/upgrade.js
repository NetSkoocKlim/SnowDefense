export class  Upgrade {
    constructor(name, levels, upgradeDescription) {
        this.maxLevel = levels.length;
        this.currentLevel = 0;
        this.name = name;
        this.levels = levels;
        this.upgradeDescription = upgradeDescription;
    }

    get value() {
        return this.levels[this.currentLevel];
    }

    upgrade() {
        this.currentLevel++;
    }

    reset() {
        this.currentLevel = 0;
    }

    clone() {
        const copy = new Upgrade(this.name, this.levels, this.upgradeDescription);
        copy.currentLevel = this.currentLevel;
        return copy;
    }

}