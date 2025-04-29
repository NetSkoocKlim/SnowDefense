import {BaseGunBullet} from "../bullet";
import {Gun} from "./gun.js";
import {BaseUpgrade} from "../upgrade";

export class BaseGun extends Gun {
    constructor(center, width, height) {
        super(center, width, height);
        this.currentAngle = 0;
        this.stats = {...BaseUpgrade.startUpgrades};
        console.log(this.stats);
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

    fire() {
        let bullet = new BaseGunBullet(
            this.center.x+Math.cos(this.currentAngle) * (this.width * 0.75),
            this.center.y+Math.sin(this.currentAngle) * (this.width * 0.75),
            {x: Math.cos(this.currentAngle), y: Math.sin(this.currentAngle)},
        )
        this.bullets.push(bullet);
    }

    draw() {
        this.lerpAngle(Math.atan2(this.rotation.y,this.rotation.x));
        super.draw();
    }
}