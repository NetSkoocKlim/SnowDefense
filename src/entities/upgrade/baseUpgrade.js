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

    static reloadUpgradeLevels = [{
        nextUpgradeCost: 30,
        value: 0.6,
    }, {
        nextUpgradeCost: 50,
        value: 0.4
    }, {
        nextUpgradeCost: 100,
        value: 0.3,
    }, {
        nextUpgradeCost: 0,
        value: 0.2
    }
    ];

    static startUpgrades = {
        attack: new Upgrade("Атака", BaseUpgrade.attackUpgradeLevels, "Атаку сильнее!"),
        smoothing: new Upgrade("Скорость вращения", BaseUpgrade.smoothingUpgradeLevels, "Не позволь врагу подобраться со спины!"),
        reloadTime: new Upgrade("Время перезарядки", BaseUpgrade.reloadUpgradeLevels, "Стреляй быстрее!")
    }
}