import {Upgrade} from "./upgrade.js";

export class MineUpgrade {
    static explosionDamageUpgradeLevels = [{
        nextUpgradeCost: 0,
        value: 25,
    }, {
        nextUpgradeCost: 0,
        value: 40
    }, {
        nextUpgradeCost: 0,
        value: 60
    }
    ];

    static explosionRadiusUpgradeLevels = [{
        nextUpgradeCost: 0,
        value: 20,
    }, {
        nextUpgradeCost: 0,
        value: 40
    }, {
        nextUpgradeCost: 0,
        value: 55,
    }]

    static spawnRateUpgradeLevels = [{
        nextUpgradeCost: 0,
        value: 6,
    }, {
        nextUpgradeCost: 0,
        value: 4
    }, {
        nextUpgradeCost: 0,
        value: 0.5,
    }]

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
        explosionDamage: new Upgrade("attack", MineUpgrade.explosionDamageUpgradeLevels, "Сытность"),
        explosionRadius: new Upgrade("radius", MineUpgrade.explosionRadiusUpgradeLevels, "Радиус"),
        spawnRate: new Upgrade("spawnRate", MineUpgrade.spawnRateUpgradeLevels, "Время появления"),
        grades: new Upgrade("grades", MineUpgrade.upgradeLevels, "Улучшить характеристики мин")
    }
}