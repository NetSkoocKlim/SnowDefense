import {Collision} from "./collision.js";
import {Enemy} from "./enemy.js";
import {Map} from "./map.js";

export class SnowDefense {

    constructor(canvas, pause) {
        this.canvas = canvas;
        this.pause = pause;
        this.ctx = this.canvas.getContext('2d');
        this.setCanvasSize();
        this.map = new Map(this.canvas, this.canvas.width, this.ctx);
        this.base = this.map.base;
    }

    setCanvasSize() {
        const canvasSize = Math.min(document.documentElement.clientHeight, document.documentElement.clientWidth);
        this.canvas.width = canvasSize;
        this.canvas.height = canvasSize;
        this.canvas.style.position = "fixed";
        this.canvas.style.left = "50%";
        this.canvas.style.top = "50%";
        this.canvas.style.transform = "translate(-50%, -50%)";
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.map.draw({collision: true});
        this.base.draw({collision: true});
        this.base.gun.draw();

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
            if (bullet.checkWallConflict(this.base, this.canvas.width)) {
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
        if (!this.pause.buttonPause && !this.pause.windowPause)requestAnimationFrame(() => this.draw());
    }
}