import {getRectangleBorders} from "../../utilities.js";
import {Collision, PolygonCollision} from "../../collision.js";
import {Canvas} from "../canvas/";
import {Game} from "../../game.js";
import {CooldownTimer} from "../timer/timer.js";


export class Enemy {
    reward;
    constructor(width, height, speed, animator) {
        this.enemyAnimator = animator;
        this.currentState = null;
        this.isAlive = false;
        this.position = {x: null, y: null};
        this.headCenter = {x: null, y: null};
        this.width = width;
        this.damage = 1;
        this.height = height;
        this.speed = speed;
        this.attackCooldown = 0.2;
        this.attackCooldownTimer = new CooldownTimer("Enemy Attack Cooldown", this.attackCooldown, {shouldReset: false});
        this.maxHP = 100;
        this.currentHP = this.maxHP;
        this.healthBarHeight = 5 * Canvas.scale;
        this.healthBarOffset = 5 * Canvas.scale;
    }

    spawn({side = null}) {
        if (side === null) {
            this.side = Math.floor(1 + Math.random() * 4);
        } else {
            this.side = side;
        }
        let x, y, velocity;
        switch (this.side) {
            case 1:
                [this.height, this.width] = [Math.min(this.width, this.height), Math.max(this.width, this.height)];
                velocity = {x: 1, y: 0};
                x = -this.width;
                y = Canvas.height / 2 - Game.base.size / 2 + Math.random() * (Game.base.size - this.height);
                break;
            case 2:
                [this.height, this.width] = [Math.max(this.width, this.height), Math.min(this.width, this.height)]
                velocity = {x: 0, y: -1};
                x = Canvas.width / 2 - Game.base.size / 2 + Math.random() * (Game.base.size - this.width);
                y = Canvas.height;
                break;
            case 3:
                [this.height, this.width] = [Math.min(this.width, this.height), Math.max(this.width, this.height)]
                velocity = {x: -1, y: 0};
                x = Canvas.width;
                y = Canvas.height / 2 - Game.base.size / 2 + Math.random() * (Game.base.size - this.height);
                break;
            case 4:
                [this.height, this.width] = [Math.max(this.width, this.height), Math.min(this.width, this.height)]
                velocity = {x: 0, y: 1};
                x = Canvas.width / 2 - Game.base.size / 2 + Math.random() * (Game.base.size - this.width);
                y = -this.height;
                break;
        }
        this.position.x = x;
        this.position.y = y;
        this.velocity = velocity;
        this.isAlive = true;
        this.addCollisions();
        this.setMove();
        this.enemyAnimator.resumeAnimation();
    }

    getHealthColor() {
        const percentage = this.currentHP / this.maxHP;
        if (percentage <= 0.25) return '#ff0000';
        if (percentage <= 0.5) return '#ffa500';
        return '#4CAF50';
    }

    handleDamage(damage) {
        if (this.currentHP - damage <= 0) {
            this.setDeath();
            Game.points.increase(this.reward);
        }
        else {
            this.currentHP -= damage;
        }
    }

    drawHealthBar() {
        let barWidth = this.width;
        let x = this.position.x;
        let y = this.position.y - this.healthBarOffset;
        if (this.side === 4) {
            y = this.position.y + this.height + this.healthBarOffset;
        }
        Canvas.ctx.fillStyle = '#555';
        Canvas.ctx.fillRect(x, y, barWidth, this.healthBarHeight);
        let healthWidth = (this.currentHP / this.maxHP) * barWidth;
        Canvas.ctx.fillStyle = this.getHealthColor();
        Canvas.ctx.fillRect(x, y, healthWidth, this.healthBarHeight);
    }

    isBaseAccessible() {
        return Collision.checkPolygonsCollision(this.collisions.head, Game.base.collision);
    }

    setMove() {
        this.enemyAnimator.toggleMoveAnimation();
        this.imgSourceHeight = this.enemyAnimator.spriteHeight;
        this.imgSourceWidth = this.enemyAnimator.spriteWidth;
        this.imgDestHeight = this.height;
        this.imgDestWidth = this.width;
        if (this.side === 1 || this.side === 3) {
            [this.imgDestHeight, this.imgDestWidth] = [this.width, this.height];
        }
        this.currentState = "Move";
    }

    setAttack() {
        this.enemyAnimator.toggleAttackAnimation();
        this.attackCooldownTimer.isShouldContinue = true;
        this.currentState = "Attack";
        this.attackCooldownTimer.resume();
    }

    setDeath() {
        this.currentState = "Death";
        this.enemyAnimator.stopAnimation();
        this.attackCooldownTimer.pause();
        this.isAlive = false;
        this.currentHP = this.maxHP;
    }

    addCollisions() {
        let headCollisionPosition = {x: null, y: null};
        let bodyCollisionPosition = {x: null, y: null};
        let bodyWidth, bodyHeight, headHeight, headWidth;
        if (this.side === 2 || this.side === 4) {
            headWidth = this.width * 0.95;
            headHeight = this.height * 0.25;
            bodyWidth = this.width * 0.75;
            bodyHeight = this.height * 0.65;
        }
        else {
            headWidth = this.width * 0.25;
            headHeight = this.height * 0.95;
            bodyWidth = this.width * 0.65;
            bodyHeight = this.height * 0.75;
        }
        switch (this.side) {
            case 1:
                headCollisionPosition.x = this.position.x + this.width - headWidth;
                headCollisionPosition.y = this.position.y;
                bodyCollisionPosition.x = headCollisionPosition.x - bodyWidth;
                bodyCollisionPosition.y = headCollisionPosition.y + headHeight / 2 - bodyHeight / 2;
                break;
            case 2:
                headCollisionPosition.x = this.position.x;
                headCollisionPosition.y = this.position.y;
                bodyCollisionPosition.x = headCollisionPosition.x + headWidth / 2 - bodyWidth / 2;
                bodyCollisionPosition.y = headCollisionPosition.y + headHeight;
                break;
            case 3:
                headCollisionPosition.x = this.position.x;
                headCollisionPosition.y = this.position.y + this.height - headHeight;
                bodyCollisionPosition.x = headCollisionPosition.x + headWidth;
                bodyCollisionPosition.y = headCollisionPosition.y + headHeight / 2 - bodyHeight / 2;
                break;
            case 4:
                headCollisionPosition.x = this.position.x + this.width - headWidth;
                headCollisionPosition.y = this.position.y + this.height - headHeight;
                bodyCollisionPosition.x = headCollisionPosition.x + headWidth / 2 - bodyWidth / 2;
                bodyCollisionPosition.y = headCollisionPosition.y - bodyHeight;
                break;
        }
        this.headCenter.x = headCollisionPosition.x + headWidth / 2;
        this.headCenter.y = headCollisionPosition.y + headHeight / 2;
        this.collisions = {
            head: new PolygonCollision(headCollisionPosition, getRectangleBorders(headWidth, headHeight), 0),
            body: new PolygonCollision(bodyCollisionPosition, getRectangleBorders(bodyWidth, bodyHeight), 0)
        };
    }

    handleAttack() {
        if (this.attackCooldownTimer.timerId === null) {
            if (this.enemyAnimator.currentFrame === this.enemyAnimator.framesCount - 1) {
                this.attack();
                this.attackCooldownTimer.resume();
                this.enemyAnimator.stopAnimation();
            }
            if (this.enemyAnimator.frameDelayTimer.timerId === null) {
                this.enemyAnimator.resumeAnimation();
            }
        }
        else {
            if (this.enemyAnimator.frameDelayTimer.timerId !== null) {
                this.enemyAnimator.stopAnimation();
            }
        }
    }


    attack() {
        this.enemyAnimator.currentFrame = 0;
        Game.base.healthPoints -= this.damage;
        console.log(Game.base.healthPoints);
    }

    move() {
        this.position.x += this.velocity.x * this.speed;
        this.position.y += this.velocity.y * this.speed;
        this.collisions.head.position.x += this.velocity.x * this.speed;
        this.collisions.body.position.x += this.velocity.x * this.speed;
        this.collisions.head.position.y += this.velocity.y * this.speed;
        this.collisions.body.position.y += this.velocity.y * this.speed;
        if (this.isBaseAccessible()) {
            this.setAttack();
        }
    }

    rotateImg() {
        if (this.side === 1) {
            Canvas.ctx.rotate(Math.PI / 2);
            Canvas.ctx.translate(0, -this.width);
        } else if (this.side === 3) {
            Canvas.ctx.rotate(-Math.PI / 2);
            Canvas.ctx.translate(-this.height, 0);
        } else if (this.side === 4) {
            Canvas.ctx.rotate(Math.PI);
            Canvas.ctx.translate(-this.width, -this.height);
        }
    }

    draw({collision = false}) {
        Canvas.ctx.save();
        Canvas.ctx.translate(this.position.x, this.position.y);
        this.rotateImg();
        Canvas.ctx.drawImage(
            this.enemyAnimator.spriteImg,
            this.imgSourceWidth * this.enemyAnimator.currentFrame, 0, this.imgSourceWidth, this.imgSourceHeight,
            0, 0, this.imgDestWidth, this.imgDestHeight
        );
        Canvas.ctx.restore();
        Canvas.ctx.save();
        this.drawHealthBar();
        Canvas.ctx.restore();

    }
}
