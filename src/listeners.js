import {Enemy} from "./enemy.js";

export const addPauseListeners = (game, startFunction) => {
    let pause = game.pause;

    window.addEventListener('keydown', (event) => {
        if (event.code === 'KeyP') {
            if (!pause.buttonPause) {
                Enemy.stopSpawn();
                pause.buttonPause = true;
            } else {
                pause.buttonPause = false;
                startFunction();
            }
        }
    });

    window.addEventListener('blur', () => {
        pause.windowPause = true;
        Enemy.stopSpawn()
    });

    window.addEventListener('focus', () => {
        pause.windowPause = false;
        if (!pause.buttonPause) startFunction();
    });
}

export const addGunInteractionListeners = (game) => {
    game.canvas.addEventListener('click', () => {
        if (!game.pause.buttonPause) game.base.gun.fire();
    })

    window.addEventListener('mousemove', (event) => {
        const rect = game.canvas.getBoundingClientRect();
        game.base.gun.updateRotation(event.clientX - rect.left, event.clientY - rect.top);
    })
}