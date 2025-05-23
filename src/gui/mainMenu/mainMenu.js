import {createDivElement, createImg} from "../../utilities.js";
import {createButton} from "../../utilities.js";
import {Game} from "../../game.js";

export class mainMenu {
    constructor() {
        this.mainScreen = createDivElement(document.querySelector("#game"), null, null, null, "mainMenu");
        this.initMainMenu();
        this.isActive = true;
    }

    initMainMenu() {
        this.wrapper = createDivElement(this.mainScreen, null, null, null, "wrapper");
        this.button = createButton("Новая игра", this.wrapper, "button");
        this.img = createImg("assets/Background/Background.png", this.mainScreen, "img");
    }

    show() {
        console.log('show');
        document.querySelector(".mainMenu").style.display = "block";
        Game.escapeMenu.isActive = false;
        Game.mainMenu.isActive = true;

        Game.hintManager.hideTutorial();
        Game.base.basePanel.hide();
        Game.panel.hide();

        if (!Game.hintManager.isCompleteGroup('intro')) {
            Game.hintManager.resetGroup('intro');
        }
    }

    hide() {
        Game.mainMenu.isActive = false;
        this.mainScreen.style.display = "none";
    }

    hideAndRestartGame() {
        this.hide();
        Game.restartGame();
        Game.resumeGame();
        if (!Game.hintManager.hints["intro_1"].shown) {
            Game.hintManager.start('intro_1');
        }
    }

}

export class EscapeMenu{
    constructor() {
        this.escapeMenu = createDivElement(document.querySelector("#game"), null, null, null, "escapeMenu");
        this.isActive = false;
        this.initEscapeMenu();
    }
    initEscapeMenu() {
        this.escapeWrapper = createDivElement(this.escapeMenu, null, null, null, "wrapper");
        this.continueButton = createButton("Продолжить", this.escapeWrapper, "button");
        this.exitButton = createButton("Выйти", this.escapeWrapper, "button");
    }
}

