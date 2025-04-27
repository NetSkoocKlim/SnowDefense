import {Map} from "./entities/map/";
import {Canvas} from "./entities/canvas/";
import {Points} from "./gui/points.js";
import {processHit} from "./utilities.js";
import {GameTimer, Timer} from "./entities/timer/timer.js";
import {EnemySpawner} from "./entities/enemy/enemySpawner.js";
import {LevelManager} from "./level/levelManager/levelManager.js";
import {Menu, EscapeMenu} from "./gui/mainMenu/menu.js";


export class Game {

    static points;
    static map;
    static base;
    static timer;
    static levelStarted = false;
    static levelManager;

    static async initGame() {
        Game.points = new Points();
        Game.map = new Map();
        Game.base = Game.map.base;
        Game.timer = new GameTimer("GameTimer", 600);
        Game.timer.isShouldContinue = true;
        EnemySpawner.init();
        Game.mainMenu = new Menu();
        Game.escapeMenu = new EscapeMenu();
        await fetch('./src/level/levelDescription.json')
            .then(response => {
                console.log(response.status);
                return response.json();
            })
            .then(data => {
                console.log(data);
                Game.levelManager = new LevelManager(data);
            })

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
            if (timer.isShouldContinue && timer.timerId === null) {
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
        console.log(Game.pause.buttonPause, Game.pause.windowPause, Game.mainMenu.isActive, Game.escapeMenu.isActive);
        if (Game.pause.buttonPause || Game.pause.windowPause || Game.mainMenu.isActive || Game.escapeMenu.isActive) return;

        Canvas.ctx.clearRect(0, 0, Canvas.width, Canvas.height);
        Game.map.draw({collision: true});
        Game.base.draw({collision: true});
        Game.base.gun.draw();
        EnemySpawner.enemies.forEach((enemy) => {
            if (enemy.isAlive) {
                enemy.draw({collision: true});
                if (enemy.currentState === "Attack") {
                    enemy.handleAttack();
                }
                else if (enemy.currentState === "Move") {
                    enemy.move();
                }
            }
        });
        Map.towers.forEach(tower => {
            tower.draw({collision: false});
            tower.gun.isEnemyInRadius();
            processHit(tower);
        });
        processHit(Game.base);
        requestAnimationFrame(() => Game.draw());
    };
}