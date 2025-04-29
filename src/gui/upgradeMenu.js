import {Game} from "../game.js";

export class UpgradeMenu {

    constructor() {

    }

    handleUpgrade(stat) {
        const stats = Object.entries(this.upgradable.stats);
        let upgradableStat = null;
        for (let i = 0;i < stats.length; i++) {
            if (stat === stats[i][1].name) {
                upgradableStat = stats[i][1];
                break;
            }
        }
        if (upgradableStat === null) return;
        if (upgradableStat.currentLevel === upgradableStat.maxLevel - 1) {
            console.log("Уже достигнут максимальный уровень");
            return;
        }
        if (Game.points.currentPoints - upgradableStat.value.nextUpgradeCost < 0) {
            console.log("Недостаточно ЗОЛОТА");
            return;
        }
        this.upgrade(upgradableStat);
    }

    upgrade(stat) {
        Game.points.currentPoints -= stat.value.nextUpgradeCost
        stat.upgrade();
        if (stat.name === "reload") {
            this.upgradable.reloadTimer.pause();
            this.upgradable.reloadTimer.reset({startTime:stat.value});
            this.upgradable.reloadTimer.resume();
        }
    }

    setUpgradable(upgradable) {
        this.upgradable = upgradable;
    }
}