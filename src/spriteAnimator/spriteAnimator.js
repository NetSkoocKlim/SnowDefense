import {CooldownTimer} from "../entities/timer/timer.js";

class SpriteAnimator {
    constructor(name) {
        this.assetsPath = "./assets/";
        this.frameDelay = 0.2;
        this.currentFrame = 0;
        this.frameDelayTimer = new CooldownTimer("FrameTimer " + name, this.frameDelay, {shouldReset: true});
        this.changeAnimationTimer = new CooldownTimer("ChangeAnimation " + name, 0, {shouldReset: false});
        this.frameDelayTimer.onComplete = () => {this.getNextFrame()};
    }

    changeAnimation(spriteImg, spriteImgWidth, spriteImgHeight, framesCount) {
        this.spriteWidth = spriteImgWidth / framesCount;
        console.log(this.spriteWidth);
        this.framesCount = framesCount;
        this.frameDelayTimer.reset({});
        this.currentFrame = 0;

    }

    getNextFrame() {
        console.log('asddsa');
        this.currentFrame += 1;
        if ( this.currentFrame >= this.framesCount ) {
            this.currentFrame = 0;
        }
    }
}

export class EnemyAnimator extends SpriteAnimator {
    constructor() {
        super("Enemy");
        this.currentState = {
            state: null,
            sprite: null,
            img: null,
        };
        this.enemySpritesPath = this.assetsPath + "enemy/";

        this.moveSprite = {
            path: this.enemySpritesPath + "move/sprite.png",
            frameCount: 4,
            width: 896,
            height: 520
        };

        this.attackSprite = {
            path: this.enemySpritesPath + "attack/",
            frameCount: 3,
        };

        this.loadImages();
    }

    loadImages() {
        this.moveSpriteImg = new Image();
        this.moveSpriteImg.src = this.moveSprite.path;
    }

    setMove() {
        this.currentState = {
            state: "Move",
            sprite: this.moveSprite,
            img: this.moveSpriteImg,
        }
        this.changeAnimation(this.moveSpriteImg, this.moveSprite.width, this.moveSprite.height, this.moveSprite.frameCount);
    }

}