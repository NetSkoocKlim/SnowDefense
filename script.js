import {Game} from "./src/game.js";
import {addGunInteractionListeners,
    addPauseListeners,
    addTowerInteractionListeners,
    addInteractionMainMenu,
    addInteractionEscapeMenu,} from "./src/listeners.js";
import {Canvas} from "./src/entities/canvas/";

const start = async () => {
    Canvas.initCanvas();
    await Game.initGame()
    addPauseListeners();
    addGunInteractionListeners();
    addTowerInteractionListeners();
    addInteractionMainMenu();
    addInteractionEscapeMenu();
}

document.addEventListener("DOMContentLoaded", start);

window.addEventListener("mousedown", (event) => {
    event.preventDefault();
})

window.addEventListener("contextmenu", (event) => {
    event.preventDefault();
})

window.addEventListener('keydown', (event) => {
    console.log(event.code);
    if (event.code !== 'F5' && event.code !== "F12") {
        event.preventDefault();
    }
});
