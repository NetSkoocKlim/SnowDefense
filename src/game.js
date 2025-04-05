import {Collision} from "./collision.js";
import {Enemy} from "./enemy.js";
import {Map} from "./map.js";
import {Canvas} from "./canvas.js";

export class SnowDefense {

    constructor() {
        this.pause = {
            buttonPause: false,
            windowPause: false
        };
        this.map = new Map();
        this.base = this.map.base;
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
                tower.gun.fire();
            }

            tower.draw();
            for (let i = tower.gun.bullets.length - 1; i >= 0; i--) {
                let bullet = tower.gun.bullets[i];
                bullet.draw();
                bullet.circleCollision.draw();
                bullet.triangleCollision.draw();
                let wasHit = false;
                for (let j = Enemy.enemies.length - 1; j >= 0; j--) {
                    let enemy = Enemy.enemies[j];
                    if (bullet.checkHit(enemy)) {
                        this.base.gun.bullets.splice(i, 1);
                        Enemy.enemies.splice(j, 1);
                        wasHit = true;
                        break;
                    }
                }
                if (!wasHit) {
                    console.log('updated');
                    bullet.update();
                }
            }
        })

        Enemy.enemies.forEach((enemy) => {
            enemy.draw();
            enemy.collision.draw();
            if (!enemy.checkBaseConflict(this.base.collision)) {
                 enemy.move();
            }
        })

        for (let i = this.base.gun.bullets.length - 1; i >= 0; i--) {
            let bullet = this.base.gun.bullets[i];
            bullet.draw();
            bullet.circleCollision.draw();
            bullet.triangleCollision.draw();
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