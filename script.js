import {Game} from "./src/game.js";
import {addGunInteractionListeners, addPauseListeners, addTowerInteractionListeners} from "./src/listeners.js";
import {Canvas} from "./src/entities/canvas/";


const start = () => {
    Canvas.initCanvas();
    Game.initGame();
    addPauseListeners();
    addGunInteractionListeners();
    addTowerInteractionListeners();
}

document.addEventListener("DOMContentLoaded", start);

window.addEventListener("mousedown", (event) => {
    event.preventDefault();
})

window.addEventListener("contextmenu", (event) => {
    event.preventDefault();
})

