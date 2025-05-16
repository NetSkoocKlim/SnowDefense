import {CircleCollision, Collision} from "../../collision.js";
import {TowerGunBullet} from "../bullet/";
import {Gun} from "./gun.js";
import {CooldownTimer} from "../timer/timer.js";

import {EnemySpawner} from "../enemy/enemySpawner.js";
import {TowerUpgrade} from "../upgrade";
import {Canvas} from "../canvas";

export class TowerGun extends Gun {
    constructor(center, width, height) {
        super(center, width, height);
        this.stats = {...TowerUpgrade.startUpgrades};
        this.attackRadius = 175 * Canvas.scale;
        this.reloadTimer = new CooldownTimer("TowerGunReload", this.reloadTime, {shouldReset: false});
        this.attackRadiusShow = new CircleCollision(this.center, this.attackRadius);
        this.reloadTimer.onComplete = () => {
            this.reload();
        };

        this.canFire = true;
        this.reloadTimer.isShouldContinue = true;

        this.gunImg = new Image();
        this.gunImg.src = "./assets/tower/towerGun.png"
    }

    get reloadTime() {
        return this.stats.reloadTime.value.value;
    }

    get attackDamage() {
        return this.stats.attack.value.value;
    }


    reload() {
        this.canFire = true;
    }

    get position() {
        return {
            x: this.center.x - this.width / 2,
            y: this.center.y - this.height / 2,
        }
    }

    isEnemyInRadius() {
        let targetEnemy = null;
        let dif = Infinity;
        EnemySpawner.enemies.forEach((enemy) => {
            if (enemy.isAlive) {
                if (Collision.checkPolygonAndCircleCollision(enemy.collisions.head, this.attackRadiusShow) ||
                    Collision.checkPolygonAndCircleCollision(enemy.collisions.body, this.attackRadiusShow)
                ) {

                    let difX = enemy.collisions.head.position.x - this.center.x;
                    let difY = enemy.collisions.head.position.y - this.center.y;
                    if (difX * difX + difY * difY < dif) {
                        targetEnemy = enemy;
                        dif = difX * difX + difY * difY;
                    }
                }
            }
        })

        EnemySpawner.eliteEnemies.forEach((enemy) => {
            if (enemy.isAlive && enemy.currentState !== "Hidden") {
                if (Collision.checkPolygonAndCircleCollision(enemy.collisions.head, this.attackRadiusShow) ||
                    Collision.checkPolygonAndCircleCollision(enemy.collisions.body, this.attackRadiusShow)
                ) {

                    let difX = enemy.collisions.head.position.x - this.center.x;
                    let difY = enemy.collisions.head.position.y - this.center.y;
                    if (difX * difX + difY * difY < dif) {
                        targetEnemy = enemy;
                        dif = difX * difX + difY * difY;
                    }
                }
            }
        })

        if (targetEnemy !== null) {
            this.updateRotation(targetEnemy.collisions.head.position.x, targetEnemy.collisions.head.position.y);
            this.fire(targetEnemy);
        }
    }

    fire(enemy) {
        if (this.canFire) {
            let bullet = new TowerGunBullet(
                this.center.x + Math.cos(this.currentAngle) * (this.width * 0.75),
                this.center.y + Math.sin(this.currentAngle) * (this.width * 0.75),
                {x: Math.cos(this.currentAngle), y: Math.sin(this.currentAngle)},
                enemy.headCenter,
                this.attackRadius
            )
            this.reloadTimer.resume();
            this.canFire = false;
            this.bullets.push(bullet);
        }
    }

    updateRotation(mouseX, mouseY) {
        super.updateRotation(mouseX, mouseY);
        this.currentAngle = Math.atan2(this.rotation.y, this.rotation.x);
    }

    draw({collision = false}) {
        Canvas.ctx.save();
        Canvas.ctx.translate(this.center.x , this.center.y);
        Canvas.ctx.rotate(Math.PI/2 + this.currentAngle);
        Canvas.ctx.drawImage(this.gunImg, 0, 0, 290, 532, -this.width/2, -this.height/2, this.width, this.height);
        Canvas.ctx.restore();
        if (collision) this.attackRadiusShow.draw();
    }
}
