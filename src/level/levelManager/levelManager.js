import {WaveManager} from "./waveManager/waveManager.js"
import {Game} from "../../game.js";

export class LevelManager {

    constructor(levelsDescription) {
        this.currentLevel = 0;
        this.levelsDescription = levelsDescription;
        this.levelCount = this.levelsDescription.levelCount;
        this.waveManager = new WaveManager();
    }

    startNextLevel() {
        this.levelComplete = false;
        this.currentLevel += 1;
        this.waveManager.currentWave = -1;
        this.waveManager.waveCount = 0;
        if (this.currentLevel > this.levelCount) {
            console.log("This was last level ;(");
            return;
        }

        console.log("Level", this.currentLevel, "started");
        this.waveManager.setLevelDescription(this.levelsDescription.levels[this.currentLevel]);
        this.waveManager.startNextWave();
    }

    endLevel() {
        this.waveManager.nextWavePopup.hide();
        console.log("Level Complete");
    }

}