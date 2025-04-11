import {getRectangleBorders} from "../../utilities.js";
import {Collision, PolygonCollision} from "../../collision.js";
import {Canvas} from "../canvas/";
import {Game} from "../../game.js";
import {CooldownTimer} from "../timer/timer.js";


export class EnemySpawner {
    static enemies = [];
    static spawnTimer = -1;

    static initTimer() {
        EnemySpawner.spawnTimer = new CooldownTimer(1, {});
        EnemySpawner.spawnTimer.pause();
    }

    static spawnEnemy({side=null, count=1}) {
        for (let i = 0; i < count; i++) {
            let enemy = new Enemy();
            enemy.spawn({side: side});
            EnemySpawner.enemies.push(enemy);
        }
    }

    static setSpawnRate(spawnCount, seconds) {
        EnemySpawner.spawnTimer.reset({startTime: seconds});
        EnemySpawner.spawnTimer.onComplete = () => {
            EnemySpawner.spawnEnemy({side:null, count:spawnCount});
        }
    }
}

export class Enemy {

    constructor() {
        this.img = new Image();
        this.img.src = './sprite.png';
        this.imgSourceHeight = 520;
        this.imgSourceWidth = 224;

        this.sceneSize = Canvas.width;
        this.baseSize = Game.base.size;

        this.scale = 0.125;

        this.reward = 5;

        this.imgDestHeight = this.imgSourceHeight * this.scale;
        this.imgDestWidth = this.imgSourceWidth * this.scale;

        this.width = this.imgDestWidth;
        this.height = this.imgDestHeight;

        this.position = {x: null, y: null};

        this.speed = 0.35;
    }

    spawn({side=null}) {
        if (side===null) {
            this.side = Math.floor(1 + Math.random() * 4);
        }
        else {
            this.side = side;
        }

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
        this.addCollisions();
    }

    addCollisions() {
        let headCollisionPosition = {x: null, y: null};
        let headCollisionWidth = null;
        let headCollisionHeight = null;

        let bodyCollisionPosition = {x: null, y: null};
        let bodyCollisionWidth = null;
        let bodyCollisionHeight = null;
        switch (this.side) {
            case 1:
                bodyCollisionPosition.x = this.position.x * 0.9;
                bodyCollisionPosition.y = this.position.y * 1.01;
                bodyCollisionWidth = this.width * 0.6;
                bodyCollisionHeight = this.height * 0.75;

                headCollisionPosition.x = bodyCollisionPosition.x + bodyCollisionWidth;
                headCollisionPosition.y = this.position.y;
                headCollisionWidth = this.width * 0.3;
                headCollisionHeight = this.height * 0.95;

                break;
            case 2:
                headCollisionPosition.x = this.position.x;
                headCollisionPosition.y = this.position.y;
                headCollisionWidth = this.width * 0.95;
                headCollisionHeight = this.height * 0.3;

                bodyCollisionPosition.x = this.position.x * 1.01;
                bodyCollisionPosition.y = headCollisionPosition.y + headCollisionHeight;
                bodyCollisionWidth = this.width * 0.7;
                bodyCollisionHeight = this.height * 0.65;
                break;
            case 3:
                headCollisionPosition.x = this.position.x;
                headCollisionPosition.y = this.position.y * 1.01;
                headCollisionWidth = this.width * 0.3;
                headCollisionHeight = this.height * 0.8;

                bodyCollisionPosition.x = headCollisionPosition.x + headCollisionWidth;
                bodyCollisionPosition.y = this.position.y * 1.01;
                bodyCollisionWidth = this.width * 0.65;
                bodyCollisionHeight = this.height * 0.7;
                break;
            default:
                bodyCollisionPosition.x = this.position.x * 1.012;
                bodyCollisionPosition.y = this.position.y * 0.9;
                bodyCollisionWidth = this.width * 0.7;
                bodyCollisionHeight = this.height * 0.6;

                headCollisionPosition.x = this.position.x * 1.005;
                headCollisionPosition.y = bodyCollisionPosition.y + bodyCollisionHeight;
                headCollisionWidth = this.width * 0.9;
                headCollisionHeight = this.height * 0.3;
                break;
        }

        this.headWidth = headCollisionWidth;

        this.collisions = {
            headCollision: new PolygonCollision(headCollisionPosition, getRectangleBorders(headCollisionWidth, headCollisionHeight), 0),
            bodyCollision: new PolygonCollision(bodyCollisionPosition, getRectangleBorders(bodyCollisionWidth, bodyCollisionHeight), 0)
        }
    }

    checkBaseConflict() {
        return Collision.checkPolygonsCollision(Game.base.collision, this.collisions.headCollision);
    }

    get headPosition() {
        return {
            x: this.collisions.headCollision.position.x + this.headWidth / 2,
            y: this.collisions.headCollision.position.y + this.headWidth / 2,
        };
    }

    move() {
        this.position.x += this.velocity.x * this.speed;
        this.position.y += this.velocity.y * this.speed;
        this.collisions.headCollision.position.x += this.velocity.x * this.speed;
        this.collisions.headCollision.position.y += this.velocity.y * this.speed;
        this.collisions.bodyCollision.position.x += this.velocity.x * this.speed;
        this.collisions.bodyCollision.position.y += this.velocity.y * this.speed;
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

    draw({collision=false}) {
        Canvas.ctx.save();
        Canvas.ctx.translate(this.position.x, this.position.y);
        this.rotateImg();
        Canvas.ctx.drawImage(
            this.img,
            0, 0, this.imgSourceWidth, this.imgSourceHeight,
            0, 0, this.imgDestWidth, this.imgDestHeight
        );
        Canvas.ctx.restore();
        if (collision) {
            this.collisions.headCollision.draw();
            this.collisions.bodyCollision.draw();
        }
    }
}
