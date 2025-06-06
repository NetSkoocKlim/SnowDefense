import {CircleCollision, Collision, PolygonCollision} from "../../collision.js";
import {getTriangleBorder, ObjType} from "../../utilities.js";
import {Canvas} from "../../canvas/canvas.js";
import {EnemySpawner} from "../enemy/enemySpawner.js";
import {EliteEnemy} from "../enemy/enemyKind/eliteEnemy.js";

export class Bullet {

    constructor(x, y, velocity, scale, speed) {
        this.velocity = velocity;
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);
        this.scale = scale * Canvas.scale;
        this.triangleSize = { width: 3 * this.scale, height: 2 * this.scale };
        this.circleRadius = this.scale;
        this.trianglePosition = { x, y };
        this.circlePosition = {
            x: x + this.triangleSize.width * Math.cos(this.angle),
            y: y + this.triangleSize.width * Math.sin(this.angle)
        };
        this.speed = speed * Canvas.scale;
        this.trianglePoints = getTriangleBorder(this.triangleSize.width, this.triangleSize.height);
        this.collisions = {
            circleCollision: new CircleCollision(
                this.circlePosition,
                this.circleRadius,
            ),
            triangleCollision: new PolygonCollision(
                this.trianglePosition,
                this.trianglePoints,
                this.angle
            )
        };

        this.bulletImg = new Image();
        this.bulletImg.src = "./assets/bullet/bullet.png";

        this.imgWidth = this.triangleSize.width * 0.8;
        this.imgHeight = this.triangleSize.height + this.circleRadius * 2;
    }


    checkHit(enemy) {
        return Collision.checkPolygonAndCircleCollision(enemy.collisions.head, this.collisions.circleCollision) ||
            Collision.checkPolygonAndCircleCollision(enemy.collisions.body, this.collisions.circleCollision) ||
            Collision.checkPolygonsCollision(this.collisions.triangleCollision, enemy.collisions.head) ||
            Collision.checkPolygonsCollision(this.collisions.triangleCollision, enemy.collisions.body);
    }

    update() {
        this.trianglePosition.x += this.velocity.x * this.speed;
        this.trianglePosition.y += this.velocity.y * this.speed;
        this.circlePosition.x   += this.velocity.x * this.speed;
        this.circlePosition.y   += this.velocity.y * this.speed;
    }

    processHit(gun, bulletInd) {
        let wasHit = false;
        for (let j = EnemySpawner.enemies.length - 1; j >= 0; j--) {
            let enemy = EnemySpawner.enemies[j];
            if (enemy.isAlive && this.checkHit(enemy)) {
                gun.bullets.splice(bulletInd, 1);
                enemy.handleDamage(gun.attackDamage);
                wasHit = true;
                break;
            }
        }
        for (let j = EnemySpawner.eliteEnemies.length - 1; j >= 0; j--) {
            let enemy = EnemySpawner.eliteEnemies[j];
            if (enemy.isAlive && enemy.currentState !== "Hidden" && this.checkHit(enemy)) {
                if (Math.random() <= EliteEnemy.disappearChance) {
                    enemy.setHide();
                }
                else {
                    gun.bullets.splice(bulletInd, 1);
                    enemy.handleDamage(gun.attackDamage);
                    wasHit = true;
                }
                break;
            }
        }
        if (!wasHit) {
            this.update(gun, bulletInd);
        }
    }

    draw({ collision = false } = {}) {
        Canvas.ctx.save();
        Canvas.ctx.translate(this.circlePosition.x, this.circlePosition.y);
        Canvas.ctx.rotate(this.angle + Math.PI / 2);
        Canvas.ctx.drawImage(
            this.bulletImg,
            -this.imgWidth  / 2,
            -this.imgHeight / 2,
            this.imgWidth,
            this.imgHeight
        );
        Canvas.ctx.restore();
        if (collision) {
            this.collisions.triangleCollision.draw();
            this.collisions.circleCollision.draw();
        }
    }
}
