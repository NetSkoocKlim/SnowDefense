import {WaveManager} from "./waveManager/waveManager.js"
import {Game} from "../../game.js";
import {CooldownTimer} from "../../timer/timer.js";
import {EnemySpawner} from "../../entities/enemy/enemySpawner.js";

export class LevelManager {

    static moneySpend = 0;
    static enemiesFeed = 0;
    levelIsFinished = false;
    levelIsStarted = false;
    income;

    constructor() {
        this.currentLevel = 0;
        this.levelsDescription = Game.levelData;
        console.log(this.levelsDescription);
        this.levelCount = this.levelsDescription.levelCount;
        this.waveManager = new WaveManager();

        this.incomeDelay = 15;
        this.incomeTimer = new CooldownTimer("Income timer", this.incomeDelay, {});

        this.incomeTimer.onComplete = () => {
            Game.points.increase(this.income);
        }

    }

    reset() {
        this.currentLevel = 0;
        LevelManager.moneySpend = 0;
        LevelManager.enemiesFeed = 0;
        this.levelIsFinished = false;
        this.levelIsStarted = false;
    }

    initLevel() {
        this.levelIsFinished = false;
        this.levelIsStarted = false;

        this.incomeTimer.pause();
        this.incomeTimer.reset({});
        this.incomeTimer.isShouldContinue = false;

        this.income = this.levelsDescription.levels[this.currentLevel].income;
        Game.points.currentPoints = this.levelsDescription.levels[this.currentLevel].startGold;
        EnemySpawner.enemyHp = this.levelsDescription.levels[this.currentLevel].enemyHp;
        EnemySpawner.enemyAttack = this.levelsDescription.levels[this.currentLevel].enemyAttack;
        EnemySpawner.enemyReward = this.levelsDescription.levels[this.currentLevel].enemyReward;
        EnemySpawner.eliteSpawnChance = this.levelsDescription.levels[this.currentLevel].eliteSpawnChance;

        if (EnemySpawner.eliteSpawnChance !== 0) {
            Game.startLevelPanel.setData({
                level: this.currentLevel + 1,
                money: Game.points.currentPoints,
                income: this.income,
                hp: EnemySpawner.enemyHp.common,
                attack: EnemySpawner.enemyAttack.common,
                reward: EnemySpawner.enemyReward.common,
                elite: {
                    chance:  EnemySpawner.eliteSpawnChance * 100,
                    hp: EnemySpawner.enemyHp.elite,
                    attack: EnemySpawner.enemyAttack.elite,
                    reward: EnemySpawner.enemyReward.elite,
                }
            });
        }
        else {
            Game.startLevelPanel.setData({
                level: this.currentLevel + 1,
                money: Game.points.currentPoints,
                income: this.income,
                hp: EnemySpawner.enemyHp.common,
                attack: EnemySpawner.enemyAttack.common,
                reward: EnemySpawner.enemyReward.common,
            });


        }

        Game.statsPanel.update({
            gold: Game.points.currentPoints,
            income: Game.levelManager.income
        });
        this.waveManager.reset();
        this.waveManager.setLevelDescription(this.levelsDescription.levels[this.currentLevel]);
        Game.renderStart();
    }

    startLevel() {
        this.levelIsStarted = true;
        this.levelIsFinished = false;
        this.incomeTimer.isShouldContinue = true;
        this.incomeTimer.resume();
        this.waveManager.startNextWave();

        if (!Game.hintManager.isGroupShown("intro")) {
            Game.hintManager.start('intro_1');
        }
    }

    endLevel() {
        this.levelIsFinished = true;
        this.levelIsStarted = false;
        this.currentLevel += 1;
        Game.statsPanel.update({
            level: Game.levelManager.currentLevel + 1,
        });
        this.waveManager.currentWave = 0;
        this.waveManager.waveCount = 0;
        this.waveManager.nextWavePopup.hide();
        setTimeout(() => Game.pauseGame(), 150);
        if (this.currentLevel === this.levelCount) {
            Game.endLevelPanel.showLast();
        } else {
            Game.endLevelPanel.setStats({
                "Уровень": this.currentLevel,
                "Потрачено времемни:": Game.timer.toString(),
                "Потрачено ресурсов:": LevelManager.moneySpend,
                "Песцов накормлено:": LevelManager.enemiesFeed
            })
            Game.endLevelPanel.show();
        }
    }
}
