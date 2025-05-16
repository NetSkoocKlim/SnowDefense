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

}


