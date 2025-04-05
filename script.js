import {Enemy} from './src/enemy.js'
import {SnowDefense} from "./src/game.js";
import {addGunInteractionListeners, addPauseListeners, addTowerInteractionListeners} from "./src/listeners.js";
import {Canvas} from "./src/canvas.js";

let game;

function checkAndStart() {
    if (Enemy.spawnTimer === null) {
        Enemy.setSpawnRate(game.base, Canvas.width);
    }
    game.draw();
}

const start = () => {
    Canvas.initCanvas();
    game = new SnowDefense();
    addPauseListeners(game, checkAndStart);
    addGunInteractionListeners(game);
    addTowerInteractionListeners(game);
    if (document.hasFocus()) checkAndStart();
}

document.addEventListener("DOMContentLoaded", start);


