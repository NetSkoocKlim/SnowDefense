import {Game} from "./src/game.js";
import {addGunInteractionListeners, addPauseListeners, addTowerInteractionListeners} from "./src/listeners.js";
import {Canvas} from "./src/entities/canvas/";
import {levelDescription} from "./src/level/levelManager/levelDescription.js"


const start = () => {
    Canvas.initCanvas();
    Game.initGame();
    addPauseListeners();
    addGunInteractionListeners();
    addTowerInteractionListeners();
    if (document.hasFocus()) Game.checkAndStart();
}

document.addEventListener("DOMContentLoaded", start);

window.addEventListener("mousedown", (evt) => {
    evt.preventDefault();
})


