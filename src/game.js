import {Collision} from "./collision.js";
import {Enemy} from "./enemy.js";
import {Map} from "./map.js";
import {Canvas} from "./canvas.js";
import {Points} from "./gui/points.js";


export class SnowDefense {

    static points = new Points();

    constructor() {
        this.pause = {
            buttonPause: false,
            windowPause: false
        };
        this.map = new Map();
        this.base = this.map.base;
    }

    pauseGame() {
        Map.towers.forEach((tower) => {
            if (!tower.gun.canFire) tower.gun.pauseReload();
        })
        Enemy.stopSpawn()
    }

    resumeGame() {
        if (!this.pause.buttonPause) {
            Map.towers.forEach((tower) => {
                if (!tower.gun.canFire) tower.gun.resumeReload();
            })
            this.checkAndStart();
        }
    }

    checkAndStart() {
        if (Enemy.spawnTimer === null) {
            Enemy.setSpawnRate(this.base, Canvas.width);
        }
        this.draw();
    }

    draw() {
        Canvas.ctx.clearRect(0, 0, Canvas.width, Canvas.height);
        this.map.draw({collision: true});
        this.base.draw({collision: true});
        this.base.gun.draw();

        Map.towers.forEach(tower => {
            let targetEnemy = null;
            let dif = Canvas.width * Canvas.height;
            Enemy.enemies.forEach((enemy) => {
                if (Collision.checkPolygonAndCircleCollision(enemy.collision, tower.gun.collision)) {
                    let difX = enemy.center.x - tower.center.x;
                    let difY = enemy.center.y - tower.center.y;
                        if (difX * difX + difY*difY < dif) {
                            targetEnemy = enemy;
                            dif = difX * difX + difY*difY;
                        }
                }
            })

            if (targetEnemy !== null) {
                tower.gun.updateRotation(targetEnemy.center.x, targetEnemy.center.y);
                tower.gun.fire(targetEnemy);
            }

            tower.draw();
            for (let i = tower.gun.bullets.length - 1; i >= 0; i--) {
                let bullet = tower.gun.bullets[i];
                bullet.draw();
                bullet.collisions.circleCollision.draw();
                bullet.collisions.triangleCollision.draw();
                let wasHit = false;
                for (let j = Enemy.enemies.length - 1; j >= 0; j--) {
                    let enemy = Enemy.enemies[j];
                    if (bullet.checkHit(enemy)) {
                        tower.gun.bullets.splice(i, 1);
                        Enemy.enemies.splice(j, 1);
                        SnowDefense.points.increase(enemy.reward);
                        wasHit = true;
                        break;
                    }
                }
                if (!wasHit) {
                    if (bullet.checkEnd()) {
                        tower.gun.bullets.splice(i, 1);
                    }
                    else {
                        bullet.update();
                    }
                }
            }
        })

        Enemy.enemies.forEach((enemy) => {
            enemy.draw();
            if (!enemy.checkBaseConflict(this.base.collision)) {
                 enemy.move();
            }
        })

        for (let i = this.base.gun.bullets.length - 1; i >= 0; i--) {
            let bullet = this.base.gun.bullets[i];
            bullet.draw();
            bullet.collisions.circleCollision.draw();
            bullet.collisions.triangleCollision.draw();
            if (bullet.checkWallConflict(this.base)) {
                this.base.gun.bullets.splice(i, 1);
                continue;
            }

            let wasHit = false;
            for (let j = Enemy.enemies.length - 1; j >= 0; j--) {
                let enemy = Enemy.enemies[j];
                if (bullet.checkHit(enemy)) {
                    this.base.gun.bullets.splice(i, 1);
                    Enemy.enemies.splice(j, 1);
                    wasHit = true;
                    SnowDefense.points.increase(enemy.reward);
                    break;
                }
            }
            if (!wasHit) {
                bullet.update();
            }
        }
        if (!this.pause.buttonPause && !this.pause.windowPause) requestAnimationFrame(() => this.draw());
    }
}