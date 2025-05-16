import {Enemy} from "../enemy.js";
import {EnemyAnimator} from "../../../spriteAnimator/spriteAnimator.js";
import {Canvas} from "../../canvas";
import {CooldownTimer} from "../../timer/timer.js";

export class EliteEnemy extends Enemy {
    static width = 32 * 8 * 0.1;
    static height = 69 * 8 * 0.1;
    static speed = 0.35;
    static spawnChance = 0.05;
    static disappearChance = 0.0006;

    headCollisionScales = {
        width: {
            odd: 0.3,
            even: 1
        },
        height: {
            odd: 1,
            even: 0.3
        }
    };

    bodyCollisionScales = {
        width: {
            odd: 0.55,
            even: 0.65
        },
        height: {
            odd: 0.75,
            even: 0.65
        }
    }

    constructor() {
        super( EliteEnemy.width * Canvas.scale, EliteEnemy.height* Canvas.scale, EliteEnemy.speed * Canvas.scale, EliteEnemy.createAnimator(), "elite");
        this.reward = 35;
        this.hideTimer = new CooldownTimer("elite hide", 4, {shouldReset:false});
    }

    static createAnimator() {
        let moveSprite = {
            path: "move/sprite.png",
            frameCount: 4,
            width: 1024,
            height: 552
        }
        let attackSprite = {
            path: "move/sprite.png",
            frameCount: 4,
            width: 1024,
            height: 552
        }
        let hideSprite = {
            path: "hide/sprite.png",
            frameCount: 2,
            width: 528,
            height: 128
        }
        return new EnemyAnimator("elite", moveSprite, attackSprite, hideSprite);
    }


    handleHiding() {
        this.enemyAnimator.toggleHideAnimation();
        if (this.hideTimer.timerId !== null) {
            this.move();
        }
        else {
            this.hideTimer.isShouldContinue = false;
            this.setMove();
            this.speed *= 1.5;
        }
    }


    setHide() {
        this.enemyAnimator.toggleHideAnimation();
        this.hideTimer.isShouldContinue = true;
        this.currentState = "Hidden";
        this.hideTimer.resume();
    }

    move() {
        if (this.currentState === "Hidden"){
            if (this.isBaseAccessible()) return;
        }
        else if (this.currentState === "Move") {
            if (Math.random() < EliteEnemy.disappearChance) {
                this.speed /= 1.5;
                this.setHide();
                return;
            }
        }
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



}