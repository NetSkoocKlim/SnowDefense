import {CooldownTimer, IncrementTimer} from "../../../entities/timer/timer.js";
import {EnemySpawner} from "../../../entities/enemy/enemy.js";

export class WaveManager {

    constructor(levelDescription) {
        this.waveTimer = new IncrementTimer("Wave timer");
        this.currentWave = 0;
        this.waveCount = levelDescription.waves.length;
        this.waveDelay = 5;
        this.waveEndTimer = new CooldownTimer("WaveEndTimer", this.waveDelay, {shouldReset: false});
        this.levelDescription = levelDescription;
    }

    getWaveDescription() {
        this.waveDescription = this.levelDescription.waves[this.currentWave];
        this.spawnsCount = this.waveDescription.spawnsCount;
        this.randomSpawnsCount = this.waveDescription.randomSpawnsCount;
        this.endWaveTime = this.waveDescription.endWaveTime;
    }

    startNextWave() {
        this.waveTimer.reset();
        this.waveTimer.resume();
        this.waveTimer.isShouldContinue = true;

        this.waveEndTimer.pause();
        this.waveEndTimer.reset({});
        this.waveEndTimer.isShouldContinue = false;

        this.getWaveDescription();
        console.log("New wave started. Duration: ", this.waveDescription.endWaveTime, "seconds");

        for (let i = 0; i < this.waveDescription.spawnsCount; i++) {
            let spawnDetails = this.waveDescription.spawns[i];
            this.waveTimer.scheduleEvent(spawnDetails.timerValue, () => {
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
            this.waveTimer.scheduleEvent(timerValue, () => {
                EnemySpawner.setSpawnRate(spawnDetails.enemyCount, spawnDetails.delay);
            });
        }

        this.waveTimer.scheduleEvent(this.endWaveTime, () => {
            this.endWave();
        });

    }

    endWave() {
        console.log("Wave ended");
        this.waveTimer.clearEvents();
        this.waveTimer.pause();
        this.waveTimer.isShouldContinue = false;

        EnemySpawner.spawnTimer.pause();
        EnemySpawner.spawnTimer.isShouldContinue = false;

        this.currentWave += 1;
        if (this.currentWave >= this.waveCount) {
            console.log("this was last wave ;(")
            this.waveTimer.pause();
            return;
        }
        console.log("Next wave in:", this.waveDelay, "seconds");

        this.waveEndTimer.reset({startTime: this.waveDelay});
        this.waveEndTimer.isShouldContinue = true;
        this.waveEndTimer.onComplete = () => {
            this.startNextWave();
        }
        this.waveEndTimer.resume();
    }
}