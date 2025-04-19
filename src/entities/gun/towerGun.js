import {CircleCollision, Collision} from "../../collision.js";
import {TowerGunBullet} from "../bullet/";
import {Gun} from "./gun.js";
import {CooldownTimer} from "../timer/timer.js";

import {EnemySpawner} from "../enemy/enemySpawner.js";

export class TowerGun extends Gun {
    constructor(center, width, height) {
        super(center, width, height);
        this.attackRadius = 175;
        this.attackRadiusShow = new CircleCollision(this.center, this.attackRadius);
        this.canFire = true;
        this.reloadTime = 0.5;
        this.reloadTimer = new CooldownTimer("TowerGunReload", this.reloadTime, {shouldReset: false});
        this.reloadTimer.onComplete = () => {
            this.reload();
        };
        this.reloadTimer.isShouldContinue = true;
    }

    updateRotation(mouseX, mouseY) {
        super.updateRotation(mouseX, mouseY);
        this.currentAngle = Math.atan2(this.rotation.y, this.rotation.x);
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

    draw({collision = false}) {
        super.draw();
        if (collision) this.attackRadiusShow.draw();
    }
}
