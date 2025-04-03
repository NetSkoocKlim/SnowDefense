import {Map} from "./src/map.js";
import {Collision} from "./src/collision.js";
import {Enemy} from './src/enemy.js'



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

let map;
let base;

const updateSceneSize = () => {
    sceneSize = Math.min(document.documentElement.clientHeight, document.documentElement.clientWidth);
    canvas.style.marginLeft = `${(document.documentElement.clientWidth - sceneSize) / 2}px`;
    canvas.style.marginTop = `${(document.documentElement.clientHeight - sceneSize) / 2}px`;
    canvas.width = sceneSize;
    canvas.height = sceneSize;
}


const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    map.draw();
    base.draw({collision: true});
    base.gun.draw(mouseX, mouseY);

    Collision.pathCollisions.forEach(pathCollision => {
        pathCollision.draw();
    })

    Enemy.enemies.forEach(function (enemy) {
        enemy.draw();
        enemy.collision.draw();
        if (!enemy.checkBaseConflict(base.collision)) {
            enemy.move();
        }
    })

    for (let i = base.gun.bullets.length - 1; i >= 0; i--) {
        let bullet = base.gun.bullets[i];
        bullet.draw();
        bullet.circleCollision.draw();
        bullet.triangleCollision.draw();
        if (bullet.checkWallConflict(base, sceneSize)) {
            base.gun.bullets.splice(i, 1);
            continue;
        }
        let wasHit = false;
        for (let j = Enemy.enemies.length - 1; j >= 0; j--) {
            let enemy = Enemy.enemies[j];
            if (bullet.checkHit(enemy)) {
                base.gun.bullets.splice(i, 1);
                Enemy.enemies.splice(j, 1);
                wasHit = true;
                break;
            }
        }
        if (!wasHit) {
            bullet.update();
        }
    }
    if (!buttonPause && !windowPause) requestAnimationFrame(draw);

}

function checkAndStart() {
    if (Enemy.spawnTimer === null) {
        Enemy.setSpawnRate(base, sceneSize, ctx);
    }
    requestAnimationFrame(draw);
}

const start = () => {
    updateSceneSize();
    map = new Map(canvas, sceneSize, ctx);
    base = map.base;
    checkAndStart()
}




(function (_) {
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

})();

canvas.addEventListener('click', () => {
    if (!buttonPause) base.gun.fire();
})

window.onresize = () => {
    updateSceneSize();
    base.update(canvas.width, sceneSize);
}

window.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    base.gun.updateRotation(event.clientX - rect.left, event.clientY - rect.top);
})

start();
