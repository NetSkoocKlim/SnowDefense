import {levelDescription} from "./levelDescription.js"
import {WaveManager} from "./waveManager/waveManager.js"

export class LevelManager {

    constructor() {
        this.currentLevel = 1;
        this.levelCount = levelDescription.levelCount;
        this.waveManager = new WaveManager(levelDescription.levels[this.currentLevel]);
    }

    startNextLevel() {
        this.waveManager.startNextWave();
        this.currentLevel += 1;
    }

}