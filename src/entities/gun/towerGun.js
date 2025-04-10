import {CircleCollision, Collision} from "../../collision.js";
import {Enemy} from "../enemy/";
import {TowerGunBullet} from "../bullet/";
import {Gun} from "./gun.js";

export class TowerGun extends Gun {
    constructor(center, width, height)
    {
        super(center, width, height);
        this.attackRadius = 175;
        this.attackRadiusShow = new CircleCollision(this.center, this.attackRadius);
        this.canFire = true;
        this.reloadMaxTime = 500;
        this.reloadTime = 0;
        this.reloadTimerId = null;
        this.reloadStartTime = null;
    }

    updateRotation(mouseX, mouseY) {
        super.updateRotation(mouseX, mouseY);
        this.currentAngle = Math.atan2(this.rotation.y,this.rotation.x);
    }

    reload(timeLeft) {
        this.reloadStartTime = Date.now();
        this.reloadTimerId = setTimeout(() => {
            this.canFire = true
            this.reloadTime = 0;
        }, timeLeft);
    }

    pauseReload() {
        this.reloadTime += (Date.now() - this.reloadStartTime);
        clearTimeout(this.reloadTimerId);
    }

    resumeReload() {
        if (!this.canFire) {
            this.reload(this.reloadMaxTime - this.reloadTime)
        }
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
        Enemy.enemies.forEach((enemy) => {
            if (Collision.checkPolygonAndCircleCollision(enemy.collisions.headCollision, this.attackRadiusShow) ||
                Collision.checkPolygonAndCircleCollision(enemy.collisions.bodyCollision, this.attackRadiusShow)
            ) {
                let difX = enemy.headPosition.x - this.center.x;
                let difY = enemy.headPosition.y - this.center.y;
                if (difX * difX + difY*difY < dif) {
                    targetEnemy = enemy;
                    dif = difX * difX + difY*difY;
                }
            }
        })

        if (targetEnemy !== null) {
            this.updateRotation(targetEnemy.headPosition.x, targetEnemy.headPosition.y);
            this.fire(targetEnemy);
        }
    }

    fire(enemy) {
        if (this.canFire) {
            let bullet = new TowerGunBullet(
                this.center.x + Math.cos(this.currentAngle) * (this.width * 0.75),
                this.center.y + Math.sin(this.currentAngle) * (this.width * 0.75),
                {x: Math.cos(this.currentAngle), y: Math.sin(this.currentAngle)},
                enemy.headPosition
            )
            this.reloadStartTime = null;
            this.reload(this.reloadMaxTime);
            this.canFire = false;
            this.bullets.push(bullet);
        }
    }

    draw({collision=false}) {
        super.draw();
        if (collision) this.attackRadiusShow.draw();
    }
}
