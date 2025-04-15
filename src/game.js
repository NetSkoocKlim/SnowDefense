import {Map} from "./entities/map/";
import {Canvas} from "./entities/canvas/";
import {Points} from "./gui/points.js";
import {processHit} from "./utilities.js";
import {GameTimer, Timer} from "./entities/timer/timer.js";
import {EnemySpawner} from "./entities/enemy/enemy.js";
import {LevelManager} from "./level/levelManager/levelManager.js";


export class Game {

    static points;
    static map;
    static base;
    static timer;
    static levelStarted = false;
    static levelManager;

    static initGame () {
        Game.points = new Points();
        Game.map = new Map();
        Game.base = Game.map.base;
        Game.timer = new GameTimer("GameTimer", 600);
        Game.timer.isShouldContinue = true;
        Game.levelManager = new LevelManager();
        EnemySpawner.initTimer();
    }

    static pause = {
        buttonPause: false,
        windowPause: false
    };

    static pauseGame() {
        Timer.timers.forEach((timer) => {
            timer.pause();
        })
    };

    static resumeGame() {
        if (!Game.pause.buttonPause) {
            Game.checkAndStart();
        }
    };

    static checkAndStart() {
        Timer.timers.forEach((timer) => {
            if (timer.isShouldContinue && timer.timerId === null ) {
                timer.resume();
            }
        });
        if (!this.levelStarted) {
            this.levelManager.startNextLevel();
            this.levelStarted = true;
        }
        Game.draw();
    };

    static draw() {
        Canvas.ctx.clearRect(0, 0, Canvas.width, Canvas.height);
        Game.map.draw({collision: true});
        Game.base.draw({collision: true});
        Game.base.gun.draw();
        EnemySpawner.enemies.forEach((enemy) => {
            enemy.draw({collision: true});
            if (!enemy.checkBaseConflict()) {
                enemy.move();
            }
        });
        Map.towers.forEach(tower => {
            tower.draw({collision: false});
            tower.gun.isEnemyInRadius();
            processHit(tower);
        });
        processHit(Game.base);
        if (!Game.pause.buttonPause && !Game.pause.windowPause) requestAnimationFrame(() => Game.draw());
    };
}