import {CooldownTimer} from "../entities/timer/timer.js";

class SpriteAnimator {
    constructor(name) {
        this.assetsPath = "./assets/";
        this.frameDelay = 0.2;
        this.currentFrame = 0;
        this.frameDelayTimer = new CooldownTimer("FrameTimer " + name, this.frameDelay, {shouldReset: true});
        this.frameDelayTimer.onComplete = () => {
            this.getNextFrame()
        };
    }

    stopAnimation() {
        this.frameDelayTimer.isShouldContinue = false;
        this.frameDelayTimer.pause();
        this.currentFrame = 0;
    }

    resumeAnimation() {
        this.frameDelayTimer.isShouldContinue = true;
        this.frameDelayTimer.reset({});
        this.frameDelayTimer.resume();
    }

    changeAnimation(spriteImg, spriteImgWidth, spriteImgHeight, framesCount) {
        this.spriteHeight = spriteImgHeight;
        this.spriteWidth = spriteImgWidth / framesCount;
        this.spriteImg = spriteImg;
        this.framesCount = framesCount;
        this.frameDelayTimer.reset({});
        this.currentFrame = 0;
    }

    getNextFrame() {
        this.currentFrame += 1;
        if (this.currentFrame >= this.framesCount) {
            this.currentFrame = 0;
        }
    }
}

export class EnemyAnimator extends SpriteAnimator {
    constructor(enemyKind, moveSprite, attackSprite) {//}, hurtSprite, deathSprite, hideSprite=null, ) {
        super(`${enemyKind} enemy`);
        this.enemySpritesPath = this.assetsPath + `enemy/${enemyKind}/`;
        this.moveSprite = moveSprite;
        this.attackSprite = attackSprite;
        this.loadImages();
    }

    loadImages() {
        this.moveSpriteImg = new Image();
        this.moveSpriteImg.src = this.enemySpritesPath + this.moveSprite.path;

        this.attackSpriteImg = new Image();
        this.attackSpriteImg.src = this.enemySpritesPath + this.attackSprite.path;

    }

    toggleMoveAnimation() {
        this.changeAnimation(this.moveSpriteImg, this.moveSprite.width, this.moveSprite.height, this.moveSprite.frameCount);
    }

    toggleAttackAnimation() {
        this.changeAnimation(this.attackSpriteImg, this.attackSprite.width, this.attackSprite.height, this.attackSprite.frameCount);
    }
}