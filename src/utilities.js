import {EnemySpawner} from "./entities/enemy/enemySpawner.js";
import {EliteEnemy} from "./entities/enemy/enemyKind/eliteEnemy.js";
import {Canvas} from "./entities/canvas";

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

export function drawCircle(x, y, radius, color, stroke) {
    Canvas.ctx.fillStyle = color;
    Canvas.ctx.beginPath();
    Canvas.ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );
    Canvas.ctx.fill();
    if (stroke) {
        Canvas.ctx.stroke();
    }
}

export function drawPolygon(points, color) {
    Canvas.ctx.fillStyle = color;
    Canvas.ctx.beginPath();
    Canvas.ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(p => Canvas.ctx.lineTo(p.x, p.y));
    Canvas.ctx.closePath();
    Canvas.ctx.fill();
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
        for (let j = EnemySpawner.eliteEnemies.length - 1; j >= 0; j--) {
            let enemy = EnemySpawner.eliteEnemies[j];
            if (enemy.isAlive && enemy.currentState !== "Hidden" && bullet.checkHit(enemy)) {
                if (Math.random() <= EliteEnemy.disappearChance) {
                    enemy.setHide();
                }
                else {
                    source.gun.bullets.splice(i, 1);
                    enemy.handleDamage(source.gun.attackDamage);
                    wasHit = true;
                }
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


export const drawRoundRect = (x, y, w, h, r, fill, stroke) => {
    if (r > h / 2) r = h / 2;
    Canvas.ctx.beginPath();
    Canvas.ctx.moveTo(x + r, y);
    Canvas.ctx.lineTo(x + w - r, y);
    Canvas.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    Canvas.ctx.lineTo(x + w, y + h - r);
    Canvas.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    Canvas.ctx.lineTo(x + r, y + h);
    Canvas.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    Canvas.ctx.lineTo(x, y + r);
    Canvas.ctx.quadraticCurveTo(x, y, x + r, y);
    Canvas.ctx.closePath();
    if (fill) Canvas.ctx.fill();
    if (stroke) Canvas.ctx.stroke();
}