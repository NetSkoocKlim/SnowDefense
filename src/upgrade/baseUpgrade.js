import {Upgrade} from "./upgrade.js";

export class BaseUpgrade {

    static attackUpgradeLevels = [
        { nextUpgradeCost: 50, value: 50 },
        { nextUpgradeCost: 70, value: 60 },
        { nextUpgradeCost: 150, value: 70 },
        { nextUpgradeCost: 0, value: 100 }
    ];

    static smoothingUpgradeLevels = [
        { nextUpgradeCost: 100, value: 0.01 },
        { nextUpgradeCost: 0, value: 0.03 }
    ];

    static reloadUpgradeLevels = [
        { nextUpgradeCost: 50, value: 0.5 },
        { nextUpgradeCost: 70, value: 0.4 },
        { nextUpgradeCost: 100, value: 0.3 },
        { nextUpgradeCost: 0, value: 0.2 }
    ];

    static startUpgrades = {
        attack: new Upgrade("Атака", BaseUpgrade.attackUpgradeLevels, "Увеличь сытность своих снарядов!"),
        smoothing: new Upgrade("Скорость вращения", BaseUpgrade.smoothingUpgradeLevels, "Не позволь врагу подобраться со спины!"),
        reloadTime: new Upgrade("Время перезарядки", BaseUpgrade.reloadUpgradeLevels, "Стреляй быстрее!")
    };

}
