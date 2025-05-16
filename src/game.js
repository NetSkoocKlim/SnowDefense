import {Scene} from "./entities/scene/";
import {Canvas} from "./entities/canvas/";
import {Points} from "./gui/points.js";
import {processHit} from "./utilities.js";
import { IncrementTimer, Timer} from "./entities/timer/timer.js";
import {EnemySpawner} from "./entities/enemy/enemySpawner.js";
import {LevelManager} from "./level/levelManager/levelManager.js";
import {Menu, EscapeMenu} from "./gui/mainMenu/menu.js";
import {Tower} from "./entities/tower";
import {MineSpawner} from "./entities/mine/mineSpawner.js";
import {Base} from "./entities/base";
import { GamePanel } from "./gui/gamePanel.js";

export class Game {
    static points;
    static scene;
    static base;
    static timer;
    static levelStarted = false;
    static levelManager;
    static towers = [];
    static panel;

    static async initGame() {
        await Canvas.initCanvas();
        Game.points = new Points();
        Game.base = new Base();
        Game.scene = new Scene();
        Tower.initTowers();
        Game.timer = new IncrementTimer("GameTimer");
        Game.timer.isShouldContinue = true;
        EnemySpawner.init();
        Game.mainMenu = new Menu();
        Game.escapeMenu = new EscapeMenu();
        const data = await fetch('./src/level/levelDescription.json').then(res => res.json());
        Game.levelManager = new LevelManager(data);
        Game.panel = new GamePanel('statistic-container', {
            totalWaves: Game.levelManager.levelCount
        });
        MineSpawner.init();
    }

    static pauseGame() {
        Timer.timers.forEach(timer => timer.pause());
    }

    static resumeGame() {
        Game.checkAndStart();
    }

    static checkAndStart() {
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

        Game.draw();
    }

    static draw() {
        if (Game.mainMenu.isActive || Game.escapeMenu.isActive) return;


        Canvas.ctx.clearRect(0, 0, Canvas.width, Canvas.height);
        Game.scene.draw({collision: true});

        Game.base.draw({collision: true});
        Game.base.gun.draw();

        EnemySpawner.enemies.forEach(enemy => {
            if (enemy.isAlive) {
                enemy.draw({collision: true});
                enemy.currentState === "Attack" && enemy.handleAttack();
                enemy.currentState === "Move" && enemy.move();
            }
        });

        EnemySpawner.eliteEnemies.forEach(enemy => {
            if (enemy.isAlive) {
                enemy.draw({collision: true});
                switch (enemy.currentState) {
                    case "Attack": enemy.handleAttack(); break;
                    case "Move": enemy.move(); break;
                    case "Hidden": enemy.handleHiding(); break;
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

        requestAnimationFrame(() => Game.draw());
    }
}
