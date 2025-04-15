import {Canvas} from "../canvas/";

export class Gun {
    constructor(center, width, height)
    {
        this.center = center;
        this.width = width;
        this.height = height;
        this.rotation = {x: null, y: null};
        this.bullets = [];
        this.currentAngle = 0;
    }

    updateRotation(mouseX, mouseY) {
        this.rotation.x = mouseX - this.center.x;
        this.rotation.y = mouseY - this.center.y;
    }

    draw() {
        Canvas.ctx.fillStyle = 'black';
        Canvas.ctx.save();
        Canvas.ctx.translate(this.center.x, this.center.y);
        Canvas.ctx.rotate(this.currentAngle);
        Canvas.ctx.fillRect(-this.height/2, -this.height/2,  this.width,  this.height );
        Canvas.ctx.restore();
    }
}


