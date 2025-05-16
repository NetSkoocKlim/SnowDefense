import {CooldownTimer} from "../entities/timer/timer.js";
import {Canvas} from "../entities/canvas";

class SpriteAnimator {
    constructor(name) {
        this.assetsPath = "./assets/";
        this.frameDelay = 0.2;
        this.currentFrame = 0;
        this.scale = 0.1  * Canvas.scale;
        this.frameDelayTimer = new CooldownTimer("FrameTimer " + name, this.frameDelay, {shouldReset: true});
        this.frameDelayTimer.onComplete = () => {
            this.getNextFrame()
        };
    }

    stopAnimation() {
        this.frameDelayTimer.isShouldContinue = false;
        this.frameDelayTimer.pause();
    }

    resumeAnimation() {
        this.frameDelayTimer.isShouldContinue = true;
        this.frameDelayTimer.resume();
    }

    changeAnimation(spriteImg, spriteImgWidth, spriteImgHeight, framesCount) {
        this.spriteHeight = spriteImgHeight;
        this.spriteWidth = spriteImgWidth / framesCount;

        this.spriteScaledHeight = this.spriteHeight * this.scale;
        this.spriteScaledWidth = this.spriteWidth * this.scale;

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
    constructor(enemyKind, moveSprite, attackSprite, hideSprite) {//}, hurtSprite, deathSprite, hideSprite=null, ) {
        super(`${enemyKind} enemy`);
        this.enemySpritesPath = this.assetsPath + `enemy/${enemyKind}/`;
        this.moveSprite = moveSprite;
        this.attackSprite = attackSprite;
        this.hideSprite = hideSprite;
        this.loadImages();
    }


    loadImages() {
        this.moveSpriteImg = new Image();
        this.moveSpriteImg.src = this.enemySpritesPath + this.moveSprite.path;

        this.attackSpriteImg = new Image();
        this.attackSpriteImg.src = this.enemySpritesPath + this.attackSprite.path;

        if (this.hideSprite !== undefined) {
            this.hideSpriteImg = new Image();
            this.hideSpriteImg.src = this.enemySpritesPath + this.hideSprite.path;
        }

    }

    toggleHideAnimation() {
        this.changeAnimation(this.hideSpriteImg, this.hideSprite.width, this.hideSprite.height, this.hideSprite.frameCount);
    }


    toggleMoveAnimation() {
        this.changeAnimation(this.moveSpriteImg, this.moveSprite.width, this.moveSprite.height, this.moveSprite.frameCount);
    }

    toggleAttackAnimation() {
        this.frameDelayTimer.reset({startTime: 0.15});
        this.changeAnimation(this.attackSpriteImg, this.attackSprite.width, this.attackSprite.height, this.attackSprite.frameCount);
    }
}