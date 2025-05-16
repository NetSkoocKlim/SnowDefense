import {CooldownTimer, IncrementTimer} from "../../../entities/timer/timer.js";

import {EnemySpawner} from "../../../entities/enemy/enemySpawner.js";
import {Game} from "../../../game.js";
import {NextWavePopup} from "../../../gui/nextWavePopup.js";

export class WaveManager {

    constructor() {
        this.waveTimer = new IncrementTimer("Wave timer");
        this.currentWave = 0;
        this.waveDelay = 5;
        this.waveEndTimer = new CooldownTimer("WaveEndTimer", this.waveDelay, {shouldReset: false});
        this.waveComplete = false;
        this.nextWavePopup = new NextWavePopup();

        this.waveEndTimer.onComplete = () => {
            this.nextWavePopup.hide();
            this.currentWave += 1;
            this.startNextWave();
        }
    }

    setLevelDescription(levelDescription) {
        this.levelDescription = levelDescription;
        this.waveCount = this.levelDescription.waves.length;
        this.currentWave = 0;
    }

    getWaveDescription() {
        this.waveDescription = this.levelDescription.waves[this.currentWave];
        this.spawnsCount = this.waveDescription.spawnsCount;
        this.randomSpawnsCount = this.waveDescription.randomSpawnsCount;
        this.endWaveTime = this.waveDescription.endWaveTime;
    }

    startNextWave() {
        this.waveComplete = false;
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
                        EnemySpawner.spawnEnemy({side: enemyDescription.side, count: enemyDescription.count, isElite: false});
                    });
                }
                if (spawnDetails.enemies.elite) {
                    spawnDetails.enemies.elite.forEach((enemyDescription) => {
                        EnemySpawner.spawnEnemy({side: enemyDescription.side, count: enemyDescription.count, isElite: true});
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
        console.log("Wave complete");
        this.waveComplete = true;
        this.waveTimer.clearEvents();
        this.waveTimer.pause();
        this.waveTimer.isShouldContinue = false;

        EnemySpawner.spawnTimer.pause();
        EnemySpawner.spawnTimer.isShouldContinue = false;

        if (this.currentWave + 1 >= this.waveCount) {
            this.nextWavePopup.showEndWaveWarning();
            this.waveTimer.pause();
            return;
        }
        console.log("Next wave in:", this.waveDelay, "seconds");

        this.waveEndTimer.reset({startTime: this.waveDelay});
        this.waveEndTimer.isShouldContinue = true;
        this.waveEndTimer.resume();
        this.nextWavePopup.showNextWaveTimer();
    }
}