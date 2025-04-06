import {BaseGunBullet} from "./bullet.js";
import {PolygonCollision} from "./collision.js";
import {getRectangleBorders} from './utilities.js'
import {Canvas} from "./canvas.js";


export class Base {
    constructor(sceneSize) {
        this.update(sceneSize);
        this.collision = new PolygonCollision(this.position, getRectangleBorders(this.size, this.size), 0);
        this.gun = new BaseGun(this.size, this.center);
    }

    update = (size) => {
        this.size = size*0.2;
        this.position = {
            x: size/2 - this.size/2,
            y: size/2 - this.size/2,
        }
        if (this.gun) this.gun.updatePosition(this.size, this.center);
    }

    get center() {
        return {
            x: this.position.x + this.size / 2,
            y: this.position.y + this.size / 2,
        }
    }

    draw({collision=false}) {
        Canvas.ctx.fillStyle = 'brown';
        Canvas.ctx.fillRect(this.position.x,this.position.y,  this.size, this.size);
        if (collision) this.collision.draw();
    }
}


class BaseGun {
    constructor(size, center) {
        this.size = size*0.1;
        this.width = this.size*3.5;
        this.height = this.size*2;
        this.center = center;
        this.currentAngle = 0;
        this.smoothing = 0.015;
        this.rotation = {x: null, y: null}
        this.bullets = [];
    }

    updatePosition(size, center) {
        this.size = size * 0.15;
        this.width = this.size*3;
        this.height = this.size*1.5;
        this.center = center;
    }

    updateRotation(mouseX, mouseY) {
        this.rotation.x = mouseX - this.center.x;
        this.rotation.y = mouseY - this.center.y;
    }

    lerpAngle(target) {
        const shortAngle = ((target - this.currentAngle) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
        this.currentAngle += shortAngle * this.smoothing;
        return shortAngle;
    }

    draw() {
        const targetAngle = Math.atan2(this.rotation.y,this.rotation.x);
        this.lerpAngle(targetAngle);
        Canvas.ctx.fillStyle = 'black';
        Canvas.ctx.save();
        Canvas.ctx.translate(this.center.x, this.center.y);
        Canvas.ctx.rotate(this.currentAngle);
        Canvas.ctx.fillRect(-this.height/2, -this.height/2,  this.width,  this.height );
        Canvas.ctx.restore();
    }

    fire() {
        let bullet = new BaseGunBullet(
            this.center.x+Math.cos(this.currentAngle) * (this.width * 0.75),
            this.center.y+Math.sin(this.currentAngle) * (this.width * 0.75),
            {x: Math.cos(this.currentAngle), y: Math.sin(this.currentAngle)},
        )
        this.bullets.push(bullet);
    }
}


