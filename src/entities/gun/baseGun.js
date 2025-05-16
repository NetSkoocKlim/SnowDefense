import {BaseGunBullet} from "../bullet";
import {Gun} from "./gun.js";
import {BaseUpgrade} from "../upgrade";
import {Canvas} from "../canvas";
import {CooldownTimer} from "../timer/timer.js";

export class BaseGun extends Gun {
    constructor(center, width, height) {
        super(center, width, height);
        this.currentAngle = 0;
        this.stats = {...BaseUpgrade.startUpgrades};

        this.reloadTimer = new CooldownTimer("BaseGunReload", this.reloadTime, {shouldReset: false});
        this.reloadTimer.onComplete = () => {
            this.reload();
        };

        this.canFire = true;
        this.reloadTimer.isShouldContinue = true;

        this.gunImg = new Image();
        this.gunImg.src = "./assets/base/baseGun.png";
    }

    get reloadTime() {
        return this.stats.reloadTime.value.value;
    }


    get smoothing() {
        return this.stats.smoothing.value.value;
    }

    get attackDamage() {
        return this.stats.attack.value.value;
    }

    lerpAngle(target) {
        const shortAngle = ((target - this.currentAngle) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
        this.currentAngle += shortAngle * this.smoothing;
    }

    reload() {
        this.canFire = true;
    }

    fire() {
        if (this.canFire) {
            let bullet = new BaseGunBullet(
                this.center.x + Math.cos(this.currentAngle) * (this.width * 0.75),
                this.center.y + Math.sin(this.currentAngle) * (this.width * 0.75),
                {x: Math.cos(this.currentAngle), y: Math.sin(this.currentAngle)},
            )
            this.reloadTimer.resume();
            this.canFire = false;
            this.bullets.push(bullet);
        }
    }

    draw() {
        this.lerpAngle(Math.atan2(this.rotation.y,this.rotation.x));

        Canvas.ctx.save();
        Canvas.ctx.translate(this.center.x , this.center.y);
        Canvas.ctx.rotate(Math.PI/2 + this.currentAngle);
        Canvas.ctx.drawImage(this.gunImg, 0, 0, 369, 724, -this.width/2, -this.height/2, this.width, this.height);
        Canvas.ctx.restore();

    }
}