import {EnemySpawner} from "../enemy/enemySpawner.js";
import {CircleCollision, Collision} from "../../collision.js";
import {Game} from "../../game.js";
import {Canvas} from "../canvas";
import {MineSpawner} from "./mineSpawner.js";

export class Mine {
    position;

    constructor() {
        this.isExplode = true;
        this.size = 20;

        this.explosionCollision = new CircleCollision(this.position, MineSpawner.explosionRadius);
        this.mineCollision = new CircleCollision(this.position, this.size/2);

        this.mineImg = new Image();
        this.mineImg.src = "./assets/mine/mine.png";
    }

    isEnemyInRadius() {
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

    draw({collision= false}) {
        Canvas.ctx.drawImage(this.mineImg, 0, 0, 893, 957, this.position.x, this.position.y, this.size, this.size);
        // if (collision) {
        //     this.explosionCollision.draw();
        //     this.mineCollision.draw();
        // }
    }

}