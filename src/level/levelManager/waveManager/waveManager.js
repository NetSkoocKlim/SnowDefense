import {IncrementTimer} from "../../../entities/timer/timer";

export class WaveManager {

    constructor(levelDescription) {
        this.timer = new IncrementTimer();
        this.randSpawnId = 0;
        this.spawnId = 0;
        this.currentWave = 0;
        this.waveCount = levelDescription.waves.length;
        this.waveDescription = levelDescription.waves[this.currentWave];
        this.spawnsCount = this.waveDescription.spawnsCount;
        this.randomSpawnsCount = this.waveDescription.randomSpawnsCount;
        this.minTimerValue = this.waveDescription.minTimerValue;
    }

    startNextWave() {
        this.currentWave++;
        if (this.currentWave >= this.waveCount) {
            return false;
        }
    }

}