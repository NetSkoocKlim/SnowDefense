import {EnemySpawner} from "../enemy/enemySpawner.js";
import {CircleCollision, Collision} from "../../collision.js";
import {Game} from "../../game.js";
import {Canvas} from "../../canvas/canvas.js";
import {MineSpawner} from "./mineSpawner.js";
import {SpriteAnimator} from "../../spriteAnimator/spriteAnimator.js";

export class Mine {
    position;

    constructor() {
        this.isExplode = true;
        this.size = 20 * Canvas.scale;

        this.explosionCollision = new CircleCollision(this.position, MineSpawner.explosionRadius);
        this.mineCollision = new CircleCollision(this.position, this.size/2);
        this.explodeAnimator = new SpriteAnimator("Explode");
        this.explodeAnimator.frameDelay = 0.5;
        this.explodeAnimator.frameDelayTimer.reset({});

        this.mineImg = new Image();
        this.mineImg.src = "./assets/mine/mine.png";

        this.explodeImg = new Image();
        this.explodeImg.src = "./assets/mine/explosion.png";

        this.explodeAnimator.changeAnimation(this.explodeImg, 1312, 214, 8);
    }

    reset() {
        this.isExplode = true;
    }

    enemyInRadius() {
        for (let i = 0;i<EnemySpawner.enemies.length;i++) {
            let enemy = EnemySpawner.enemies[i];
            if (enemy.isAlive) {
                if (Collision.checkPolygonAndCircleCollision(enemy.collisions.head, this.mineCollision ) ||
                    Collision.checkPolygonAndCircleCollision(enemy.collisions.body, this.mineCollision)
                ) {
                    return true;
                }
            }
        }
        for (let i = 0;i<EnemySpawner.eliteEnemies.length;i++) {
            let enemy = EnemySpawner.eliteEnemies[i];
            if (enemy.isAlive && enemy.currentState !== "Hidden") {
                if (Collision.checkPolygonAndCircleCollision(enemy.collisions.head, this.mineCollision ) ||
                    Collision.checkPolygonAndCircleCollision(enemy.collisions.body, this.mineCollision)
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    spawn() {
        this.state = "placed";
        let side = Math.floor(Math.random() * 4) + 1;
        switch (side) {
            case 1:
                this.position = {
                    x: Math.floor(Math.random()*(Canvas.width / 2 - Game.base.size / 2 - this.size)),
                    y: Math.floor(Canvas.height / 2 - Game.base.size / 2 + Math.random() * (Game.base.size - this.size))
                }
                break;
            case 2:
                this.position = {
                    x: Math.floor(Canvas.width / 2 - Game.base.size / 2 + Math.random() * (Game.base.size - this.size)),
                    y: Math.floor(Canvas.height / 2 + Game.base.size / 2 + Math.random() * (Canvas.height / 2  - Game.base.size / 2 - this.size))
                }
                break;
            case 3:
                this.position = {
                    x: Math.floor(Canvas.width / 2 + Game.base.size / 2 + Math.random() * (Canvas.width / 2  - Game.base.size / 2 - this.size)),
                    y: Math.floor(Canvas.height / 2 - Game.base.size / 2  +  Math.random() * (Game.base.size - this.size))
                }
                break;
            case 4:
                this.position = {
                    x: Math.floor(Canvas.width / 2 - Game.base.size / 2 + Math.random() * (Game.base.size - this.size)),
                    y: Math.floor( Math.random()* (Canvas.height / 2 - Game.base.size / 2 - this.size))
                }
                break;
        }
        this.explosionCollision.position = {x: this.position.x + this.size / 2, y: this.position.y + this.size / 2};
        this.mineCollision.position = {x: this.position.x + this.size / 2, y: this.position.y + this.size / 2};
        this.isExplode = false;
    }

    explode() {
        this.isExplode = true;
        this.explodeAnimator.stopAnimation();
        EnemySpawner.enemies.forEach((enemy) => {
            if (enemy.isAlive) {
                if (Collision.checkPolygonAndCircleCollision(enemy.collisions.head, this.explosionCollision) ||
                    Collision.checkPolygonAndCircleCollision(enemy.collisions.body, this.explosionCollision)
                ) {
                    enemy.handleDamage(MineSpawner.explosionDamage);
                }
            }
        })
        EnemySpawner.eliteEnemies.forEach((enemy) => {
            if (enemy.isAlive && enemy.currentState !== "Hidden") {
                if (Collision.checkPolygonAndCircleCollision(enemy.collisions.head, this.explosionCollision) ||
                    Collision.checkPolygonAndCircleCollision(enemy.collisions.body, this.explosionCollision)
                ) {
                    enemy.handleDamage(MineSpawner.explosionDamage);
                }
            }
        })
    }

    beginExplosion() {
        this.explodeAnimator.resumeAnimation();
        this.state = "Exploding";
    }

    draw({collision= false}) {
        if (this.state === "placed") {
            Canvas.ctx.drawImage(this.mineImg, 0, 0, 893, 957, this.position.x, this.position.y, this.size, this.size);
            if (collision) {
                this.explosionCollision.draw();
                this.mineCollision.draw();
            }
        }
        else {
            Canvas.ctx.save();
            Canvas.ctx.translate(this.position.x, this.position.y);
            Canvas.ctx.drawImage(
                this.explodeAnimator.spriteImg,
                this.explodeAnimator.spriteWidth * this.explodeAnimator.currentFrame, 0, this.explodeAnimator.spriteWidth, this.explodeAnimator.spriteHeight,
                -MineSpawner.explosionRadius / 2, -(MineSpawner.explosionRadius*1.3) / 2, MineSpawner.explosionRadius, MineSpawner.explosionRadius * 1.3
            );
            Canvas.ctx.restore();
            if (this.explodeAnimator.currentFrame === this.explodeAnimator.framesCount - 1) {
                this.explode();
            }
        }
    }

}