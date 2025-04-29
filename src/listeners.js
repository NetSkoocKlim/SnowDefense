import {Map} from "./entities/map/";
import {Canvas} from "./entities/canvas/";
import {Game} from "./game.js";

export const addInteractionEscapeMenu = () => {
    window.addEventListener("keydown", event =>{
        if (!Game.escapeMenu.isActive) {
            if (event.code === "Escape" && document.querySelector(".mainMenu").style.display === "none") {
                document.querySelector(".escapeMenu").style.display = "block";
                Game.pauseGame();
                Game.escapeMenu.isActive = true;

            }
        }
        else {
            document.querySelector(".escapeMenu").style.display = "none";
            Game.escapeMenu.isActie = false;
            Game.resumeGame();
        }
    });

    Game.escapeMenu.continueButton.addEventListener("click", () => {
        document.querySelector(".escapeMenu").style.display = "none";
        Game.escapeMenu.isActive = false;
        Game.resumeGame();
    });

    Game.escapeMenu.exitButton.addEventListener("click", () => {
        document.querySelector(".escapeMenu").style.display = "none";
        document.querySelector(".mainMenu").style.display = "block";
        Game.escapeMenu.isActive = false;
        Game.mainMenu.isActive = true;
});
}

export const addInteractionMainMenu = ()=> {
    Game.mainMenu.button.addEventListener("click", (event)=>{
        event.stopPropagation();
        if (Game.mainMenu.isActive){
            Game.mainMenu.isActive = false;
            document.querySelector(".mainMenu").style.display = "none";
            Game.resumeGame();
        }
    })
}

export const addPauseListeners = () => {
    let key_pressed = false;
    window.addEventListener('keydown', (event) => {
        if (!key_pressed) {
            if (event.code === 'KeyP') {
                if (!Game.pause.buttonPause) {
                    Game.pause.buttonPause = true;
                    Game.pauseGame();
                } else {
                    Game.pause.buttonPause = false;
                    Game.resumeGame();
                }
                key_pressed = true;
            }
        }
    });

    window.addEventListener('keyup', (event) => {
        key_pressed = false;
    });

    window.addEventListener('blur', () => {
        Game.pause.windowPause = true;
        Game.pauseGame();
    });

    window.addEventListener('focus', () => {
        Game.pause.windowPause = false;
        if (document.hasFocus() && !Game.mainMenu.isActive) {
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

        place.towerPlaceDiv.addEventListener('click', () => {
            place.handleTowerPlaceClick();
        });
    })
}