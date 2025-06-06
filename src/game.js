import {Scene} from "./entities/scene/scene.js";
import {Canvas} from "./canvas/canvas.js";
import {Points} from "./entities/points.js";
import {IncrementTimer, Timer} from "./timer/timer.js";
import {EnemySpawner} from "./entities/enemy/enemySpawner.js";
import {LevelManager} from "./level/levelManager/levelManager.js";
import {MainMenu} from "./ui/menu/mainMenu.js";
import {Tower} from "./entities/tower/tower.js";
import {MineSpawner} from "./entities/mine/mineSpawner.js";
import {Base} from "./entities/base/base.js";
import {GamePanel} from "./ui/gamePanel.js";
import {HintManager} from "./ui/hints/hintManager.js";
import {BasePanel} from "./ui/basePanel/basePanel.js";
import {CountdownDisplay} from "./ui/countDown.js";
import {EndLevelPanel} from "./ui/endLevelPanel.js";
import {EscapeMenu} from "./ui/menu/escapeMenu.js";
import {GameOverPanel} from "./ui/gameOverPanel.js";
import {LevelInitializer} from "./level/levelInitializer.js";
import {LevelStartPanel} from "./ui/startLevelPanel.js";


export class Game {
    static points;
    static scene;
    static base;
    static timer;
    static levelManager;
    static towers = [];
    static statsPanel;
    static hintManager;
    static gamePause = false;
    static drawIsActive = false;
    static levelData;
    static countDown;
    static gameIsNotStarted = true;

    static initGame() {
        Game.initBorder();
        this.gameDiv = document.querySelector("#game");
        Game.mainMenu = new MainMenu();
        Game.escapeMenu = new EscapeMenu();
        Game.levelData = LevelInitializer.initLevels();
        Game.levelManager = new LevelManager();

        Game.points = new Points();
        Game.base = new Base();
        Game.base.basePanel = new BasePanel();
        Tower.initTowers();
        Game.scene = new Scene();
        Game.timer = new IncrementTimer("GameTimer");

        Game.timer.onTick = () => {
            Game.statsPanel.update({
                elapsedMs: Game.timer.time,
            });
        }

        Game.timer.isShouldContinue = true;
        EnemySpawner.init();
        MineSpawner.init();
        Game.hintManager = new HintManager();
        Game.countDown = new CountdownDisplay({
                containerClass: "my-countdown",
                animationDuration: 800,
            }
        )
        Game.statsPanel = new GamePanel('statistic-container', {
            totalWaves: Game.levelManager.levelCount
        });
        Game.endLevelPanel = new EndLevelPanel({
            parent: document.querySelector("#game"),
            stats: {},
            });
        Game.gameOverPanel = new GameOverPanel();
        Game.startLevelPanel = new LevelStartPanel();
    }

    static startNewGame() {
        Game.gameIsNotStarted = false;
        Game.levelManager.reset();
        Game.continueGame();
    }

    static continueGame() {
        Game.restartGame();
        Game.levelManager.initLevel();
    }

    static restartGame() {
        Game.levelManager.waveManager.nextWavePopup.hide();
        Game.levelManager.waveManager.reset();
        Game.points.reset();
        Game.base.reset();
        Game.scene.reset();
        Game.towers.forEach((tower) => {
            tower.reset()
        });
        Game.timer.reset();
        Game.timer.isShouldContinue = true;
        EnemySpawner.reset();
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
        Timer.timers.forEach(timer => {
            if (timer.timerId !== null) {
                timer.pause();
            }
        });
        Game.gamePause = true;
        Game.stopDrawing();
    }

    static resumeGame() {

        if (Game.hintManager.current !== null) return;
        if (Game.mainMenu.isActive || Game.escapeMenu.isActive || Game.endLevelPanel.isActive || Game.gameOverPanel.isActive) return;
        Game.gamePause = false;
        Game.checkAndContinue();
    }

    static checkAndContinue() {
        Timer.timers.forEach(timer => {
            if (timer.isShouldContinue && timer.timerId === null) timer.resume();
        });
        if (!Game.base.basePanel.upgradePanel.active && !Game.base.basePanel.visible) {
            Game.base.basePanel.show();
        }
        if (!Game.statsPanel.isActive) {
            Game.statsPanel.show();
        }
        if (!Game.levelManager.levelIsStarted) {
            Game.startLevelPanel.show();
        }
        if (!Game.drawIsActive) {
            Game.drawIsActive = true;
            Game.draw({});
        }

    }

    static renderStart() {
        if (!Game.base.basePanel.upgradePanel.active && !Game.base.basePanel.visible) {
            Game.base.basePanel.show();
        }
        if (!Game.statsPanel.isActive) {
            Game.statsPanel.show();
        }
        Game.draw({once: true});
    }

    static stopDrawing() {
        Game.drawIsActive = false;
        cancelAnimationFrame(Game.animationId);
    }

    static draw({once= false}) {
        Game.animationId = requestAnimationFrame(() => {
            Game.draw({})
        });

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
                if (mine.enemyInRadius()) mine.beginExplosion();
            }
        });


        Game.towers.forEach(tower => {
            if (tower.isActive) {
                tower.draw({collision: false});
                for (let i = tower.gun.bullets.length - 1; i>=0;i--) {
                    let bullet = tower.gun.bullets[i];
                    bullet.draw({});
                    bullet.processHit(tower.gun, i);
                }
            }
        });

        for (let i = Game.base.gun.bullets.length - 1; i>=0;i--) {
            let bullet = Game.base.gun.bullets[i];
            bullet.draw({});
            bullet.processHit(Game.base.gun, i);
        }

        if (once) {
            Game.stopDrawing();
        }
    }
}
