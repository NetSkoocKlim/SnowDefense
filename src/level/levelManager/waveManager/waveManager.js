import {CooldownTimer, IncrementTimer} from "../../../timer/timer.js";

import {EnemySpawner} from "../../../entities/enemy/enemySpawner.js";
import {NextWavePopup} from "../../../gui/nextWavePopup.js";
import {Game} from "../../../game.js";

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
            this.setWaveDescription();
            this.startNextWave();
        }
    }

    reset() {
        this.waveTimer.clearEvents();
        this.waveTimer.pause();
        this.waveTimer.reset({});
        this.waveTimer.isShouldContinue = false;

        this.waveEndTimer.pause();
        this.waveEndTimer.reset({});
        this.waveEndTimer.isShouldContinue = false;

        this.waveComplete = false;
        this.currentWave = 0;
    }

    setLevelDescription(levelDescription) {
        this.levelDescription = levelDescription;
        this.waveCount = this.levelDescription.waveCount;
        this.currentWave = 0;
        this.setWaveDescription();
    }

    setWaveDescription() {
        this.waveDescription = this.levelDescription.waves[this.currentWave];
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
            let timerValue = spawnDetails.startTimerValue;
            this.waveTimer.scheduleEvent(timerValue, () => {
                EnemySpawner.setSpawnRate(spawnDetails.enemiesPerSpawn, spawnDetails.delay);
            });
            if (spawnDetails.endTimerValue) {
                this.waveTimer.scheduleEvent(spawnDetails.endTimerValue, () => {
                    EnemySpawner.unsetSpawnRate();
                })
            }
        }
        this.waveTimer.scheduleEvent(this.waveDescription.endWaveTime, () => {
            this.endWave();
        });
    }

    startNextWave() {
        this.waveComplete = false;

        this.waveEndTimer.reset({});
        this.waveEndTimer.pause();
        this.waveEndTimer.isShouldContinue = false;

        this.waveTimer.isShouldContinue = true;
        this.waveTimer.resume();
    }

    endWave() {
        this.waveComplete = true;

        this.waveTimer.reset({});
        this.waveTimer.clearEvents();
        this.waveTimer.pause();
        this.waveTimer.isShouldContinue = false;

        EnemySpawner.spawnTimer.pause();
        EnemySpawner.spawnTimer.isShouldContinue = false;

        if (this.currentWave + 1 >= this.waveCount) {
            if (EnemySpawner.enemiesAlive === 0) {
                Game.levelManager.endLevel();
            }
            else {
                this.nextWavePopup.showEndWaveWarning();
            }
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