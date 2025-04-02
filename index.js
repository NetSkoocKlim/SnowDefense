import {Base} from "./base.js";
import {Map, Path} from "./map.js";
import {Collision} from "./collision.js";
import {Enemy} from './enemy.js'

let canvas = document.createElement('canvas');

let ctx = canvas.getContext('2d');

let sceneSize = window.innerHeight

document.body.appendChild(canvas);

document.body.style.backgroundColor = 'black';
document.body.style.margin = '0';

let mouseX = 0;
let mouseY = 0;
let buttonPause = false;
let windowPause = false;

let base;


const updateSceneSize = () => {
    sceneSize = Math.min(document.documentElement.clientHeight, document.documentElement.clientWidth);
    canvas.style.marginLeft = `${(document.documentElement.clientWidth - sceneSize) / 2}px`;
    canvas.style.marginTop = `${(document.documentElement.clientHeight - sceneSize) / 2}px`;
    canvas.width = sceneSize;
    canvas.height = sceneSize;
}

const drawScene = () => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, sceneSize, sceneSize);
    Map.pathes.forEach(path => {
        path.draw();
    })
}


const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScene();
    base.draw();
    Enemy.enemies.forEach(function (enemy) {
        enemy.draw();
        enemy.collision.draw();
        if (!enemy.checkBaseCollision(base.collision)) {
            enemy.move();
        }
    })

    base.gun.draw(mouseX, mouseY);

    base.collision.draw();
    Collision.pathCollisions.forEach(pathCollision => {
        pathCollision.draw();
    })

    for (let i = base.gun.bullets.length - 1; i >= 0; i--) {
        let bullet = base.gun.bullets[i];
        if (bullet.checkWallCollision(base)) {
            base.gun.bullets.splice(i, 1);
            continue;
        }
        let wasHit = false;
        for (let j = Enemy.enemies.length - 1; j >= 0; j--) {
            let enemy = Enemy.enemies[j];
            if (bullet.checkCollision(enemy)) {
                base.gun.bullets.splice(i, 1);
                Enemy.enemies.splice(j, 1);
                wasHit = true;
                break;
            }
        }
        if (!wasHit) {
            bullet.draw();

            bullet.circleCollision.draw();
            bullet.triangleCollision.draw();

            bullet.update();
        }
    }
    if (!buttonPause && !windowPause) requestAnimationFrame(draw);
}

const start = () => {
    updateSceneSize();
    base = new Base(canvas.width, sceneSize, ctx);
    Map.pathes.push(
        new Path({
            x: 0,
            y: base.position.y
        }, (sceneSize - base.size) / 2, base.size, ctx),
        new Path({
            x: (sceneSize - base.size) / 2,
            y: 0
        }, base.size, (sceneSize - base.size) / 2, ctx),
        new Path({
            x: (sceneSize - base.size) / 2,
            y: (sceneSize + base.size) / 2
        }, base.size, (sceneSize - base.size) / 2, ctx),
        new Path({
            x: (sceneSize + base.size) / 2,
            y: (sceneSize - base.size) / 2
        }, (sceneSize - base.size) / 2, base.size, ctx),
    )
    Collision.pathCollisions.push(
        new Collision(Map.pathes[0], {x: 0, y: 0}, Map.pathes[0].width, Map.pathes[0].width, ctx),
        new Collision(Map.pathes[1], {x: sceneSize - Map.pathes[0].width, y: 0}, Map.pathes[0].width, Map.pathes[0].width, ctx),
        new Collision(Map.pathes[2], {x: sceneSize - Map.pathes[0].width, y: sceneSize - Map.pathes[0].width}, Map.pathes[0].width, Map.pathes[0].width, ctx),
        new Collision(Map.pathes[3], {x: 0, y: sceneSize - Map.pathes[0].width}, Map.pathes[0].width, Map.pathes[0].width, ctx),

    )

    checkAndStart()
}

function checkAndStart() {
    if (Enemy.spawnTimer === null) {
        Enemy.setSpawnRate(base, sceneSize, ctx);
    }
    requestAnimationFrame(draw);
}

window.addEventListener('keydown', (event) => {
    if (event.code === 'KeyP') {
        if (!buttonPause) {
            Enemy.stopSpawn();
            buttonPause = true;
        } else {
            buttonPause = false;
            checkAndStart();
        }
    }
});


window.addEventListener('blur', () => {
    windowPause = true;
    Enemy.stopSpawn()
});

window.addEventListener('focus', () => {
    windowPause = false;
    if (!buttonPause) checkAndStart();
});


canvas.addEventListener('click', () => {
    if (!buttonPause) base.gun.fire();
})


window.onresize = () => {
    updateSceneSize();
    base.update(canvas.width, sceneSize);
}

window.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
})

start();
