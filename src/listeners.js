import {Enemy} from "./enemy.js";
import {Map} from "./map.js";
import {Canvas} from "./canvas.js";

export const addPauseListeners = (game, startFunction) => {
    window.addEventListener('keydown', (event) => {
        if (event.code === 'KeyP') {
            if (!game.pause.buttonPause) {
                Enemy.stopSpawn();
                game.pause.buttonPause = true;
            } else {
                game.pause.buttonPause = false;
                startFunction();
            }
        }
    });

    window.addEventListener('blur', () => {
        game.pause.windowPause = true;
        Enemy.stopSpawn()
    });

    window.addEventListener('focus', () => {
        game.pause.windowPause = false;
        if (!game.buttonPause) startFunction();
    });
}

export const addGunInteractionListeners = (game) => {
    Canvas.canvas.addEventListener('click', () => {
        if (!game.pause.buttonPause && !game.pause.windowPause) game.base.gun.fire();
    })

    Canvas.canvas.addEventListener('mousemove', (event) => {
        const rect = Canvas.canvas.getBoundingClientRect();
        game.base.gun.updateRotation(event.clientX - rect.left, event.clientY - rect.top);
    })
}

export const addTowerInteractionListeners = (game) => {
    const rect = Canvas.canvas.getBoundingClientRect();

    Map.towerPlaces.forEach(place => {
        place.towerPlaceDiv.addEventListener('mouseover', (event) => {
            if (game.pause.buttonPause || game.pause.windowPause) return ;
            place.isSelected = true;
        })
        place.towerPlaceDiv.addEventListener('mouseout', (event) => {
            if (game.pause.buttonPause || game.pause.windowPause) return ;
            place.isSelected = false;
        })
        place.towerPlaceDiv.addEventListener('click', (event) => {
            if (game.pause.buttonPause || game.pause.windowPause) return ;
            place.setTower();
        })
    })

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('tower')) {
            event.stopPropagation();
        }
        if (event.target.classList.contains('towerPlace')) {
            Map.towerPlaces.forEach(place => {
                if (place.isSelected) place.setTower();
            });
        }
    })

}