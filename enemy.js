import {ObjectType} from "./utilities.js";
import {Collision} from "./collision.js";


export class Enemy {


    static enemies = [];
    static spawnTimer = null;

    constructor(baseSize, sceneSize, ctx) {
        this.ctx = ctx;
        this.img = new Image();
        this.img.src = './sprite.png';

        this.imgSourceHeight = 520;
        this.imgSourceWidth = 224;
        this.scale = 0.125;

        this.imgDestHeight = this.imgSourceHeight * this.scale;
        this.imgDestWidth = this.imgSourceWidth * this.scale;

        this.width = this.imgDestWidth;
        this.height = this.imgDestHeight;

        this.objectType = ObjectType.Enemy;
        this.sceneSize = sceneSize;
        this.baseSize = baseSize;
        this.position = {x: null, y: null};
        this.speed = 0.3;
    }

    spawn() {
        this.side = Math.floor(1 + Math.random()*4);
        let x, y, velocity, temp;
        switch(this.side) {
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
        this.collision = new Collision(this, this.position, this.width, this.height, this.ctx);
    }

    checkBaseCollision(baseCollision) {
        let {x:x1, y:y1} = this.collision.position;
        let w1 = this.collision.width;
        let h1 = this.collision.height;
        let {x:x2, y:y2} = baseCollision.position;
        let w2 = baseCollision.width;
        let h2 = baseCollision.height;

        let intersect_x = (x1 < x2 + w2) && (x2 < x1 + w1)
        let intersect_y = (y1 < y2 + h2) && (y2 < y1 + h1)

        return intersect_x && intersect_y
    }

    move() {
        this.position.x += this.velocity.x * this.speed;
        this.position.y += this.velocity.y * this.speed;
    }

    rotateImg() {

        if (this.side === 1) {
            this.ctx.rotate(Math.PI / 2);
            this.ctx.translate(0, -this.imgDestHeight);
        }
        else if (this.side === 3) {
            this.ctx.rotate(-Math.PI/2);
            this.ctx.translate(-this.imgDestWidth, 0);
        }
        else if (this.side === 4) {
            this.ctx.rotate(Math.PI);
            this.ctx.translate(-this.imgDestWidth, -this.imgDestHeight);
        }
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.rotateImg();
        this.ctx.drawImage(
            this.img,
            0, 0, this.imgSourceWidth, this.imgSourceHeight,
            0, 0, this.imgDestWidth, this.imgDestHeight
        );
        this.ctx.restore();
    }

    static spawnEnemy(base, sceneSize, ctx) {
        let count = 4;
        for (let i = 0; i < count; i++) {
            let enemy = new Enemy(base.size, sceneSize, ctx);
            enemy.spawn();
            Enemy.enemies.push(enemy);
        }
    }

    static setSpawnRate(base, sceneSize, ctx) {
        Enemy.spawnTimer = setInterval(() => {Enemy.spawnEnemy(base, sceneSize, ctx)}, 2000);
    }

    static stopSpawn() {
        clearInterval(Enemy.spawnTimer);
        Enemy.spawnTimer = null;
    }
}
