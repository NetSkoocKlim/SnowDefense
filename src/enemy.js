import {getRectangleBorders, ObjectType} from "./utilities.js";
import {Collision, PolygonCollision} from "./collision.js";
import {Canvas} from "./canvas.js";


export class Enemy {

    static enemies = [];
    static spawnTimer = null;

    constructor(baseSize, sceneSize) {
        this.objectType = ObjectType.Enemy;

        this.img = new Image();
        this.img.src = './sprite.png';

        this.imgSourceHeight = 520;
        this.imgSourceWidth = 224;
        this.scale = 0.125;

        this.imgDestHeight = this.imgSourceHeight * this.scale;
        this.imgDestWidth = this.imgSourceWidth * this.scale;

        this.width = this.imgDestWidth;
        this.height = this.imgDestHeight;

        this.sceneSize = sceneSize;
        this.baseSize = baseSize;
        this.position = {x: null, y: null};
        this.speed = 0.35;
    }

    spawn() {
        this.side = Math.floor(1 + Math.random() * 4);
        let x, y, velocity, temp;
        switch (this.side) {
            case 1:
                temp = this.height;
                this.height = this.width;
                this.width = temp;
                velocity = {x: 1, y: 0};
                x = -this.width;
                y = this.sceneSize / 2 - this.baseSize / 2 + Math.random() * (this.baseSize - this.height);
                break;
            case 2:
                velocity = {x: 0, y: -1};
                x = this.sceneSize / 2 - this.baseSize / 2 + Math.random() * (this.baseSize - this.width);
                y = this.sceneSize + this.height;
                break;
            case 3:
                temp = this.height;

                this.height = this.width;
                this.width = temp;

                velocity = {x: -1, y: 0};
                x = this.sceneSize;
                y = this.sceneSize / 2 - this.baseSize / 2 + Math.random() * (this.baseSize - this.height);
                break;
            case 4:
                velocity = {x: 0, y: 1};
                x = this.sceneSize / 2 - this.baseSize / 2 + Math.random() * (this.baseSize - this.width);
                y = -this.height;
                break;
        }
        this.position.x = x;
        this.position.y = y;
        this.velocity = velocity;
        this.collision = new PolygonCollision(this, this.position,
            getRectangleBorders(this.width, this.height), 0);
    }


    checkBaseConflict(baseCollision) {
        return Collision.checkPolygonsCollision(baseCollision, this.collision);
    }

    get center() {
        return {
            x: this.collision.position.x + this.width / 2,
            y: this.collision.position.y + this.height / 2,
        };
    }

    move() {
        this.position.x += this.velocity.x * this.speed;
        this.position.y += this.velocity.y * this.speed;
    }

    rotateImg() {

        if (this.side === 1) {
            Canvas.ctx.rotate(Math.PI / 2);
            Canvas.ctx.translate(0, -this.imgDestHeight);
        } else if (this.side === 3) {
            Canvas.ctx.rotate(-Math.PI / 2);
            Canvas.ctx.translate(-this.imgDestWidth, 0);
        } else if (this.side === 4) {
            Canvas.ctx.rotate(Math.PI);
            Canvas.ctx.translate(-this.imgDestWidth, -this.imgDestHeight);
        }
    }

    draw() {
        Canvas.ctx.save();
        Canvas.ctx.translate(this.position.x, this.position.y);
        this.rotateImg();
        Canvas.ctx.drawImage(
            this.img,
            0, 0, this.imgSourceWidth, this.imgSourceHeight,
            0, 0, this.imgDestWidth, this.imgDestHeight
        );
        Canvas.ctx.restore();
    }

    static spawnEnemy(base, sceneSize, ctx) {
        let count = 3;
        for (let i = 0; i < count; i++) {
            let enemy = new Enemy(base.size, sceneSize, ctx);
            enemy.spawn();
            Enemy.enemies.push(enemy);
        }
    }

    static setSpawnRate(base, sceneSize, ctx) {
        Enemy.spawnTimer = setInterval(() => {
            Enemy.spawnEnemy(base, sceneSize, ctx)
        }, 2000);
    }

    static stopSpawn() {
        clearInterval(Enemy.spawnTimer);
        Enemy.spawnTimer = null;
    }
}
