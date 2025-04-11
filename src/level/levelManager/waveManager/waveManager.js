import {IncrementTimer} from "../../../entities/timer/timer.js";
import {EnemySpawner} from "../../../entities/enemy/enemy.js";

export class WaveManager {

    constructor(levelDescription) {
        this.timer = new IncrementTimer();
        this.currentWave = 0;
        this.waveCount = levelDescription.waves.length;
        this.wavesDelay = 15;
        this.levelDescription = levelDescription;
    }

    getWaveDescription() {
        this.waveDescription = this.levelDescription.waves[this.currentWave];
        this.spawnsCount = this.waveDescription.spawnsCount;
        this.randomSpawnsCount = this.waveDescription.randomSpawnsCount;
        this.endWaveTime = this.waveDescription.endWaveTime;
    }

    startNextWave() {
        if (this.currentWave >= this.waveCount) {
            this.endLevel();
            return;
        }
        this.getWaveDescription();
        for (let i = 0; i < this.waveDescription.spawnsCount; i++) {
            let spawnDetails = this.waveDescription.spawns[i];
            this.timer.scheduleEvent(spawnDetails.timerValue, () => {
                if (spawnDetails.enemies.common) {
                    spawnDetails.enemies.common.forEach((enemyDescription) => {
                        EnemySpawner.spawnEnemy({side: enemyDescription.side, count: enemyDescription.count});
                    });
                }
                if (spawnDetails.enemies.elite) {
                    spawnDetails.enemies.elite.forEach((enemyDescription) => {
                        EnemySpawner.spawnEnemy({side: enemyDescription.side, count: enemyDescription.count});
                    });
                }
            });
        }

        for (let i = 0; i < this.waveDescription.randomSpawnsCount; i++) {
            let spawnDetails = this.waveDescription.randomSpawns[i];
            let timerValue = spawnDetails.timerValue;
            this.timer.scheduleEvent(timerValue, () => {
                EnemySpawner.setSpawnRate(spawnDetails.enemyCount, spawnDetails.delay);
            });
        }

        this.timer.scheduleEvent(this.endWaveTime, () => {
            this.timer.clearEvents();
            this.startNextWave();
        });
        this.currentWave++;
    }
    endLevel() {
    }
}