import {Enemy} from "../enemy.js";
import {EnemyAnimator} from "../../../spriteAnimator/spriteAnimator.js";
import {Canvas} from "../../canvas";

export class DefaultEnemy extends Enemy {
    static width = 28 * 8 * 0.1;
    static height = 65 * 8 * 0.1;
    static speed = 0.35;

    headCollisionScales = {
        width: {
            odd: 0.25,
            even: 0.95
        },
        height: {
            odd: 0.95,
            even: 0.25
        }
    };

    bodyCollisionScales = {
        width: {
            odd: 0.65,
            even: 0.75
        },
        height: {
            odd: 0.75,
            even: 0.65
        }
    }

    constructor() {
        super(DefaultEnemy.width * Canvas.scale, DefaultEnemy.height * Canvas.scale, DefaultEnemy.speed * Canvas.scale, DefaultEnemy.createAnimator(), "default");
        this.reward = 5;
    }

    static createAnimator() {
        let moveSprite = {
            path: "move/sprite.png",
            frameCount: 4,
            width: 896,
            height: 520
        }

        let attackSprite = {
            path: "attack/sprite.png",
            frameCount: 4,
            width: 896,
            height: 704
        }
        return new EnemyAnimator("default", moveSprite, attackSprite);
    }


}