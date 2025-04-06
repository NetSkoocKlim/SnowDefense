import {Canvas} from "./canvas.js";
import {createDivElement} from "./utilities.js";
import {CircleCollision} from "./collision.js";
import {TowerGunBullet} from "./bullet.js";

class TowerGun {
    constructor(center, width, height) {
        this.center = center;
        this.width = width;
        this.height = height;
        this.collision = new CircleCollision(this.center, 175);
        this.rotation = {x: null, y: null}
        this.bullets = [];
        this.canFire = true;
        this.reloadMaxTime = 500;
        this.reloadTime = 0;
        this.reloadTimerId = null;
        this.reloadStartTime = null;
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

    updateRotation(enemyX, enemyY) {
        this.rotation.x = enemyX - this.center.x;
        this.rotation.y = enemyY - this.center.y;
        this.currentAngle = Math.atan2(this.rotation.y,this.rotation.x);
    }

    fire(enemy) {
        if (this.canFire) {
            let bullet = new TowerGunBullet(
                this.center.x + Math.cos(this.currentAngle) * (this.width * 0.75),
                this.center.y + Math.sin(this.currentAngle) * (this.width * 0.75),
                {x: Math.cos(this.currentAngle), y: Math.sin(this.currentAngle)},
                enemy.center
            )
            this.reloadStartTime = null;
            this.reload(this.reloadMaxTime);
            this.canFire = false;
            this.bullets.push(bullet);
        }
    }

    get position() {
        return {
            x: this.center.x - this.width / 2,
            y: this.center.y - this.height / 2,
        }
    }

    draw() {
        Canvas.ctx.save();
        Canvas.ctx.fillStyle = 'black';
        Canvas.ctx.translate(this.center.x, this.center.y);
        Canvas.ctx.rotate(this.currentAngle);
        Canvas.ctx.fillRect(-this.height/2, -this.height/2,  this.width,  this.height );
        Canvas.ctx.restore();
        //this.collision.draw();
    }
}

export class Tower {
    static cost = 100;
    constructor(placeDiv, center, size) {
        this.center = center;
        this.sizeDifference = 5;
        this.size = size + 2 * this.sizeDifference;
        this.gun = new TowerGun(this.center, this.size * 0.4, this.size * 0.2);
        this.towerDiv = createDivElement(placeDiv, {x: -this.sizeDifference, y:-this.sizeDifference}, this.size, this.size, 'tower');
    }

    get position() {
        return {
            x: this.center.x - this.size / 2,
            y: this.center.y - this.size / 2,
        }
    }

    draw() {
        Canvas.ctx.fillStyle = 'blue';
        Canvas.ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
        this.gun.draw();
    }
}