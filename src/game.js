import {Enemy} from "./entities/enemy/";
import {Map} from "./entities/map/";
import {Canvas} from "./entities/canvas/";
import {Points} from "./gui/points.js";
import {processHit} from "./utilities.js";
import {GameTimer, Timer} from "./entities/timer/timer.js";


export class Game {

    static points;
    static map;
    static base;
    static timer;

    static initGame () {
        Game.points = new Points();
        Game.map = new Map();
        Game.base = Game.map.base;
        Game.timer = new GameTimer(6);
    }

    static pause = {
        buttonPause: false,
        windowPause: false
    };

    static pauseGame() {
        Map.towers.forEach((tower) => {
            if (!tower.gun.canFire) tower.gun.pauseReload();
        })
        Timer.timers.forEach((timer) => {
            timer.pause();
        })
    };

    static resumeGame() {
        if (!Game.pause.buttonPause) {
            Map.towers.forEach((tower) => {
                if (!tower.gun.canFire) tower.gun.resumeReload();
            })
            Game.checkAndStart();
        }
    };

    static checkAndStart() {
        Timer.timers.forEach((timer) => {
            if (timer.timerId === null) {
                timer.resume();
            }
        });
        if (Enemy.spawnTimer === -1) {
            Enemy.initTimer({seconds:1});
        }
        Game.draw();
    };

    static draw() {
        Canvas.ctx.clearRect(0, 0, Canvas.width, Canvas.height);
        Game.map.draw({collision: true});
        Game.base.draw({collision: true});
        Game.base.gun.draw();
        Enemy.enemies.forEach((enemy) => {
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