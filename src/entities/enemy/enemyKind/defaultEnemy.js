import {Enemy} from "../enemy.js";
import {EnemyAnimator} from "../../../spriteAnimator/spriteAnimator.js";
import {Canvas} from "../../canvas";

export class DefaultEnemy extends Enemy {
    constructor() {
        super(28 * Canvas.scale,65 * Canvas.scale, 0.35, DefaultEnemy.createAnimator());
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
            path: "move/sprite.png",
            frameCount: 4,
            width: 896,
            height: 520
        }
        return new EnemyAnimator("default", moveSprite, attackSprite);
    }


}