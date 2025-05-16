export class  Upgrade {
    constructor(name, levels, upgradeDescription, ...kwargs) {
        this.maxLevel = levels.length;
        this.currentLevel = 0;
        this.name = name;
        this.levels = levels;
        this.upgradeDescription = upgradeDescription;
        if (kwargs !== undefined) {
            this.upgradeIcon = kwargs.upgradeIcon;
        }
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

}