import {WaveCreator} from "./waveCreator.js";


export class LevelCreator {

    constructor() {
        this.levels = [];
    }

    addLevel(income, startGold, enemyHp, enemyAttack, eliteSpawnChance, enemyReward, configureFn) {
        const builder = {
            income,
            startGold,
            enemyHp,
            enemyAttack,
            eliteSpawnChance,
            enemyReward,
            waves: [],
            addWave(fn) {
                const wc = new WaveCreator();
                fn(wc);
                this.waves.push(wc.build());
                return this;
            }
        };

        if (configureFn) {
            configureFn(builder);
        }
        this.levels.push(builder);
        return this;
    }

    build() {
        const levels = this.levels.map(l => {
            const lvl = { income: l.income, startGold: l.startGold, enemyHp: l.enemyHp,
                enemyAttack: l.enemyAttack, enemyReward: l.enemyReward,
                eliteSpawnChance: l.eliteSpawnChance, waves: l.waves };
            lvl.waveCount = l.waves.length;
            return lvl;
        });
        return { levels, levelCount: levels.length };
    }

}
