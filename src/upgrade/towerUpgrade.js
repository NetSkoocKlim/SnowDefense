import {Upgrade} from "./upgrade.js";

export class TowerUpgrade {
    static attackUpgradeLevels = [{
        nextUpgradeCost: 15,
        value: 30,
    }, {
        nextUpgradeCost: 25,
        value: 25
    }, {
        nextUpgradeCost: 0,
        value: 40
    }
    ];

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
        nextUpgradeCost: 100,
        value: 0.2
    }
    ];

    static upgradeLevels = [{
        nextUpgradeCost: 50,
        value: null,
    }, {
        nextUpgradeCost: 80,
        value: null,
    }, {
        nextUpgradeCost: 0,
        value: null,
    }
    ]

    static startUpgrades = {
        reloadTime: new Upgrade("reload", TowerUpgrade.reloadUpgradeLevels, "Улучшить скорострельность башни"),
        attack: new Upgrade("attack", TowerUpgrade.attackUpgradeLevels, "Улучшить атаку башни"),
        grades: new Upgrade("grades", TowerUpgrade.upgradeLevels, "Улучшить характеристики башни")
    }
}