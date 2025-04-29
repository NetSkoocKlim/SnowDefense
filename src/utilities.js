import {Game} from "./game.js";

import {EnemySpawner} from "./entities/enemy/enemySpawner.js";

export class ObjType {
    static Base = Symbol();
    static Tower = Symbol();
}


export function createImg(src, parent, className){
    const img = document.createElement("img");
    img.src = src;
    img.classList.add(className);
    parent.appendChild(img);

    return img;
}

export function createButton(text, parent, className){
    const Button = document.createElement("button");
    Button.innerText = text;
    Button.classList.add(className);
    parent.appendChild(Button);
    return Button;
}

export function rotatePoint(point, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: point.x * cos - point.y * sin,
        y: point.x * sin + point.y * cos
    };
}

export function getRectangleBorders(width, height) {
    return [
        {x: 0, y: 0},
        {x: width, y: 0},
        {x: width, y: height},
        {x: 0, y: height},
    ]
}

export function getTriangleBorder(width, height) {
    return [
        {x: width, y: -height / 2},
        {x: width, y: height / 2},
        {x: 0, y: 0}
    ];
}

export function createDivElement(parent, position, width, height, className) {
    const div = document.createElement('div');
    div.classList.add(className);
    div.style.width = width + 'px';
    div.style.height = height + 'px';
    if (position) {
        div.style.left = position.x + 'px';
        div.style.top = position.y + 'px';
    }
    div.style.position = 'absolute';
    parent.appendChild(div);
    return div;
}

export function drawCircle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

export function drawPolygon(ctx, points, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fill();
}

export function processHit(source) {
    for (let i = source.gun.bullets.length - 1; i >= 0; i--) {
        let bullet = source.gun.bullets[i];
        bullet.draw({collision: true});
        if (source.type === ObjType.Base) {
            if (bullet.checkWallConflict(source)) {
               source.gun.bullets.splice(i, 1);
            }
        }
        let wasHit = false;
        for (let j = EnemySpawner.enemies.length - 1; j >= 0; j--) {
            let enemy = EnemySpawner.enemies[j];
            if (enemy.isAlive && bullet.checkHit(enemy)) {
                source.gun.bullets.splice(i, 1);
                enemy.handleDamage(source.gun.attackDamage);
                wasHit = true;
                break;
            }
        }
        if (!wasHit) {
            if (source.type === ObjType.Tower && bullet.checkEnd()) {
                source.gun.bullets.splice(i, 1);
            }
            else {
                bullet.update();
            }
        }
    }
}