import {Game} from "./src/game.js";
import {GameLoader} from "./src/gameLoader.js";
import {
    addGunInteractionListeners,
    addPauseListeners,
    addTowerInteractionListeners,
    addInteractionMainMenu,
    addInteractionEscapeMenu, addBasePanelListeners,

} from "./src/listeners.js";
import {Canvas} from "./src/canvas/canvas.js";

import {AudioLoader} from "./src/audio/audioLoader.js";
import {audioList} from "./src/audio/audioList.js";


const start = async () => {
    Canvas.initCanvas();
    const loader = new GameLoader();
    loader.show();

    Promise.all([
        await AudioLoader.loadAll(audioList)
    ]).then(() => {
        Game.initGame();
        loader.hide();
        addPauseListeners();
        addGunInteractionListeners();
        addTowerInteractionListeners();
        addInteractionMainMenu();
        addInteractionEscapeMenu();
        addBasePanelListeners();
        Game.mainMenu.show();
    });

}

document.addEventListener("DOMContentLoaded", async () => {
    window.scrollTo(0, 0);
    await start();
});

window.addEventListener("mousedown", (event) => {
    event.preventDefault();
})

window.addEventListener("contextmenu", (event) => {
    event.preventDefault();
})

window.addEventListener('keydown', (event) => {
    if (event.code !== 'F5' && event.code !== "F12") {
        event.preventDefault();
    }
});
