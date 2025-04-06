import {Enemy} from './src/enemy.js'
import {SnowDefense} from "./src/game.js";
import {addGunInteractionListeners, addPauseListeners, addTowerInteractionListeners} from "./src/listeners.js";
import {Canvas} from "./src/canvas.js";

let game;

const start = () => {
    Canvas.initCanvas();
    game = new SnowDefense();
    addPauseListeners(game);
    addGunInteractionListeners(game);
    addTowerInteractionListeners(game);
    if (document.hasFocus()) game.checkAndStart();
}

document.addEventListener("DOMContentLoaded", start);
window.addEventListener("mousedown", (evt) => {
    evt.preventDefault();
})


