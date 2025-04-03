import {Enemy} from './src/enemy.js'
import {SnowDefense} from "./src/game.js";
import {addGunInteractionListeners, addPauseListeners} from "./src/listeners.js";


const canvas = document.querySelector('#canvas');
const pause = {
    buttonPause: false,
    windowPause: false
};
let game;

function checkAndStart() {
    if (Enemy.spawnTimer === null) {
        Enemy.setSpawnRate(game.base, game.canvas.width, game.ctx);
    }
    game.draw();
}

const start = () => {
    game = new SnowDefense(canvas, pause);
    addPauseListeners(game, checkAndStart);
    addGunInteractionListeners(game);
    checkAndStart();
}

start();
