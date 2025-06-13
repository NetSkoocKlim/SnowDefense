import {Upgrade} from "./upgrade.js";

export class MineUpgrade {
    static explosionDamageUpgradeLevels = [{
        nextUpgradeCost: 0,
        value: 30,
    }, {
        nextUpgradeCost: 0,
        value: 50
    }, {
        nextUpgradeCost: 0,
        value: 80
    }
    ];

    static explosionRadiusUpgradeLevels = [{
        nextUpgradeCost: 0,
        value: 20,
    }, {
        nextUpgradeCost: 0,
        value: 80
    }, {
        nextUpgradeCost: 0,
        value: 170,
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
        nextUpgradeCost: 70,
        value: null,
    }, {
        nextUpgradeCost: 300,
        value: null,
    }, {
        nextUpgradeCost: 0,
        value: null,
    }
    ]


    static startUpgrades = {
        explosionDamage: new Upgrade("attack", MineUpgrade.explosionDamageUpgradeLevels, "Сытность"),
        explosionRadius: new Upgrade("radius", MineUpgrade.explosionRadiusUpgradeLevels, "Радиус насыщения"),
        spawnRate: new Upgrade("spawnRate", MineUpgrade.spawnRateUpgradeLevels, "Время изготовки"),
        grades: new Upgrade("grades", MineUpgrade.upgradeLevels, "Улучшить характеристики мин")
    }
}