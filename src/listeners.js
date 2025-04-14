import {Map} from "./entities/map/";
import {Canvas} from "./entities/canvas/";
import {Game} from "./game.js";

export const addPauseListeners = () => {
    window.addEventListener('keydown', (event) => {
        if (event.code === 'KeyP' && !Game.mainMenu.isActive) {
            if (!Game.pause.buttonPause) {
                Game.pause.buttonPause = true;
                Game.pauseGame();
            } else {
                Game.pause.buttonPause = false;
                Game.resumeGame();
            }
        }

    });

    window.addEventListener('blur', () => {
        Game.pause.windowPause = true;
        Game.pauseGame();
    });

    window.addEventListener('focus', () => {
        if (document.hasFocus() && !Game.mainMenu.isActive) {
            Game.pause.windowPause = false;
            Game.resumeGame();
        }
    });
}

export const addGunInteractionListeners = () => {
    Canvas.canvas.addEventListener('click', () => {
        if (!Game.pause.buttonPause && !Game.pause.windowPause) Game.base.gun.fire();
    })

    Canvas.canvas.addEventListener('mousemove', (event) => {
        const rect = Canvas.canvas.getBoundingClientRect();
        Game.base.gun.updateRotation(event.clientX - rect.left, event.clientY - rect.top);
    })
}

export const addTowerInteractionListeners = () => {
    Map.towerPlaces.forEach(place => {
        place.towerPlaceDiv.addEventListener('mouseover', (event) => {
            if (Game.pause.buttonPause || Game.pause.windowPause) return ;
            place.isSelected = true;
        })
        place.towerPlaceDiv.addEventListener('mouseout', (event) => {
            if (Game.pause.buttonPause || Game.pause.windowPause) return ;
            place.isSelected = false;
        })
        place.towerPlaceDiv.addEventListener('click', (event) => {
            if (Game.pause.buttonPause || Game.pause.windowPause) return ;
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