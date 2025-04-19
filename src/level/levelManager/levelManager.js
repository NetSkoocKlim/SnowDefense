import {WaveManager} from "./waveManager/waveManager.js"

export class LevelManager {

    constructor(levelsDescription) {
        this.currentLevel = 0;
        this.levelsDescription = levelsDescription;
        console.log(levelsDescription);
        this.levelCount = this.levelsDescription.levelCount;
        this.waveManager = new WaveManager();
    }

    startNextLevel() {
        this.currentLevel += 1;
        if (this.currentLevel > this.levelCount) {
            console.log("This was last level ;(");
            return;
        }
        console.log("Level", this.currentLevel, "started");
        this.waveManager.setLevelDescription(this.levelsDescription.levels[this.currentLevel]);
        this.waveManager.startNextWave();
    }

}