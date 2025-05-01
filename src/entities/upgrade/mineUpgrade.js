import {Upgrade} from "./upgrade.js";

export class MineUpgrade {
    static explosionDamageUpgradeLevels = [{
        nextUpgradeCost: 30,
        value: 40,
    }, {
        nextUpgradeCost: 75,
        value: 25
    }, {
        nextUpgradeCost: 0,
        value: 40
    }
    ];

    static explosionRadiusUpgradeLevels = [{
        nextUpgradeCost: 30,
        value: 125,
    }, {
        nextUpgradeCost: 50,
        value: 50
    }, {
        nextUpgradeCost: 100,
        value: 60,
    }]


    static startUpgrades = {
        explosionDamage: new Upgrade("attack", MineUpgrade.explosionDamageUpgradeLevels, "Улучшить урон взрыва мин"),
        explosionRadius: new Upgrade("radius", MineUpgrade.explosionRadiusUpgradeLevels, "Улучшить радиус поражения мин"),
    }
}