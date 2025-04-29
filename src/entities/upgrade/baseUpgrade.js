import {Upgrade} from "./upgrade.js";

export class BaseUpgrade {
    static attackUpgradeLevels = [{
        nextUpgradeCost: 25,
        value: 30,
    }, {
        nextUpgradeCost: 40,
        value: 70
    }, {
        nextUpgradeCost: 60,
        value: 150,
    }, {
        nextUpgradeCost: 0,
        value: 300
    }
    ];

    static smoothingUpgradeLevels = [{
        nextUpgradeCost: 60,
        value: 0.015,
    }, {
        nextUpgradeCost: 0,
        value: 0.03
    }]

    static startUpgrades = {
        attack: new Upgrade("attack", BaseUpgrade.attackUpgradeLevels, "Улучшить атаку базы"),
        smoothing: new Upgrade("smoothing", BaseUpgrade.smoothingUpgradeLevels, "Улучшить скорость поворота базы")
    }
}