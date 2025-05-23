import {WaveManager} from "./waveManager/waveManager.js"
import {Game} from "../../game.js";

export class LevelManager {

    static moneySpend = 0;
    static enemiesFeed = 0;

    constructor(levelsDescription) {
        this.currentLevel = 0;
        this.levelsDescription = levelsDescription;
        this.levelCount = this.levelsDescription.levelCount;
        this.waveManager = new WaveManager();
    }

    reset() {
        this.currentLevel = 0;

        LevelManager.moneySpend = 0;
        LevelManager.enemiesFeed = 0;

        this.waveManager.reset();
    }

    startNextLevel() {
        this.currentLevel += 1;
        this.waveManager.currentWave = -1;
        this.waveManager.waveCount = 0;
        if (this.currentLevel > this.levelCount) {
            console.log("This was last level ;(");
            return;
        }
        this.waveManager.waveTimer.isShouldContinue = true;
        this.waveManager.setLevelDescription(this.levelsDescription.levels[this.currentLevel]);
        this.waveManager.startNextWave();
    }

    endLevel() {
        console.log("end");
        this.waveManager.nextWavePopup.hide();
        setTimeout(() => Game.pauseGame(), 150);
        Game.end = true;
        Game.endLevelPanel.setStats({
            "Уровень": this.currentLevel,
            "Потрачено времемни:": Game.timer.toString(),
            "Потрачено ресурсов:": LevelManager.moneySpend,
            "Песцов накормлено:": LevelManager.enemiesFeed
        })
        Game.endLevelPanel.show();
    }
}