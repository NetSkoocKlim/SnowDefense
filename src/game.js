import {Scene} from "./entities/scene/";
import {Canvas} from "./entities/canvas/";
import {Points} from "./entities/points.js";
import {processHit} from "./utilities.js";
import {IncrementTimer, Timer} from "./timer/timer.js";
import {EnemySpawner} from "./entities/enemy/enemySpawner.js";
import {LevelManager} from "./level/levelManager/levelManager.js";
import {mainMenu, EscapeMenu} from "./gui/mainMenu/mainMenu.js";
import {Tower} from "./entities/tower";
import {MineSpawner} from "./entities/mine/mineSpawner.js";
import {Base} from "./entities/base";
import {GamePanel} from "./gui/gamePanel.js";
import {HintManager} from "./gui/hints/hintManager.js";
import {BasePanel} from "./gui/basePanel/basePanel.js";
import {CountdownDisplay} from "./gui/countDown.js";
import {EndLevelPanel} from "./gui/endLevelPanel.js";


export class Game {
    static points;
    static scene;
    static base;
    static timer;
    static levelStarted = false;
    static levelManager;
    static towers = [];
    static panel;
    static hintManager;
    static gamePause = false;
    static drawIsActive = false;
    static levelData;
    static countDown;
    static end = false;

    static async initGame() {
        Canvas.initCanvas();
        Game.initBorder();
        Game.mainMenu = new mainMenu();
        Game.escapeMenu = new EscapeMenu();
        this.levelData = await fetch('./src/level/levelDescription.json').then(res => res.json());
        Game.points = new Points();
        Game.base = new Base();
        Game.base.basePanel = new BasePanel();
        Game.scene = new Scene();
        Tower.initTowers();
        Game.timer = new IncrementTimer("GameTimer");
        Game.timer.isShouldContinue = true;
        EnemySpawner.init();
        Game.levelManager = new LevelManager(this.levelData);
        Game.panel = new GamePanel('statistic-container', {
            totalWaves: Game.levelManager.levelCount
        });
        MineSpawner.init();
        Game.hintManager = new HintManager();
        Game.countDown = new CountdownDisplay({
                containerClass: "my-countdown",
                animationDuration: 800,
            }
        )
        Game.endLevelPanel = new EndLevelPanel({
            parent: document.querySelector("#game"),
            stats: {},
            onContinue: Game.levelManager.startNextLevel
        });
        await Game.mainMenu.show();
    }


    static restartGame() {
        Game.end = false;
        Game.points.reset();
        Game.base.reset();
        Game.scene.reset();
        Game.towers.forEach((tower) => {
            tower.reset()
        });
        Game.timer.reset();
        Game.timer.isShouldContinue = true;
        EnemySpawner.reset();
        Game.levelManager.reset();
        Game.levelStarted = false;
        MineSpawner.reset();
        Game.hintManager.reset();
    }


    static initBorder() {
        const border = document.querySelector(".frame");
        border.style.left = -70 * Canvas.scale + 'px';
        border.style.top = -70 * Canvas.scale + 'px';
        border.style.right = -70 * Canvas.scale + 'px';
        border.style.bottom = -70 * Canvas.scale + 'px';
    }

    static pauseGame() {
        Timer.timers.forEach(timer => timer.pause());
        Game.gamePause = true;
        Game.drawIsActive = false;
    }

    static resumeGame() {
        if (Game.hintManager.current !== null) return;
        Game.gamePause = false;
        Game.checkAndContinue();
    }

    static checkAndContinue() {
        Timer.timers.forEach(timer => {
            if (timer.isShouldContinue && timer.timerId === null) timer.resume();
        });
        if (!this.levelStarted) {
            this.levelManager.startNextLevel();
            this.levelStarted = true;
        }
        if (!Game.base.basePanel.upgradePanel.active && !Game.base.basePanel.visible) {
            Game.base.basePanel.show();
        }

        if (!Game.panel.isActive) {
            Game.panel.show();
        }
        if (!Game.drawIsActive) {
            Game.drawIsActive = true;
            Game.draw({});
        }
    }

    static draw({once= false}) {

        Canvas.ctx.clearRect(0, 0, Canvas.width, Canvas.height);

        Game.scene.draw({collision: true});
        Game.base.draw({collision: true});
        Game.base.gun.draw();

        EnemySpawner.enemies.forEach(enemy => {
            if (enemy.isAlive) {
                enemy.draw({collision: false});
                enemy.currentState === "Attack" && enemy.handleAttack();
                enemy.currentState === "Move" && enemy.move();
            }
        });

        EnemySpawner.eliteEnemies.forEach(enemy => {
            if (enemy.isAlive) {
                enemy.draw({collision: false});
                switch (enemy.currentState) {
                    case "Attack":
                        enemy.handleAttack();
                        break;
                    case "Move":
                        enemy.move();
                        break;
                    case "Hidden":
                        enemy.handleHiding();
                        break;
                }
            }
        });

        MineSpawner.mines.forEach(mine => {
            if (!mine.isExplode) {
                mine.draw({collision: true});
                mine.isEnemyInRadius() && mine.explode();
            }
        });

        Game.towers.forEach(tower => {
            if (tower.isActive) {
                tower.draw({collision: false});
                tower.gun.isEnemyInRadius();
                processHit(tower);
            }
        });

        processHit(Game.base);

        Game.panel.update({
            elapsedMs: Game.timer.time,
            gold: Game.points.currentPoints,
            level: Game.levelManager.currentLevel,
            wave: Game.levelManager.waveManager.currentWave + 1,
            enemies: EnemySpawner.enemiesAlive
        });

        Game.base.basePanel.update();

        if (once === true || Game.mainMenu.isActive || Game.escapeMenu.isActive || Game.gamePause) {
            Game.drawIsActive = false;
            return;
        }

        requestAnimationFrame(() => {
            Game.draw({})
        });
    }
}
