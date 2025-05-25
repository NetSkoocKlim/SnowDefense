import {createButton, createDivElement, createImg, wait} from "../../utilities.js";
import {Game} from "../../game.js";
import {Canvas} from "../../canvas";

export class MainMenu {
    constructor() {
        this.overlay = createDivElement(
            document.querySelector("#game"),
            null, null, null,
            "overlay"
        );
        this.mainScreen = createDivElement(document.querySelector("#game"), null, null, null, "mainMenu");
        this.initMainMenu();
        this.isActive = true;
        this.hideInstant();
    }

    initMainMenu() {
        this.title = document.createElement("img");
        this.title.src = "./assets/mainMenu/title.png";

        this.buttonWrapper = createDivElement(this.mainScreen, null, null, null, "main-menu-buttons");
        this.continueButton = createButton("Продолжить", this.buttonWrapper, "main-menu-button");
        this.continueButton.classList.add("continue-button");
        this.continueButton.style.fontSize = 20 * Canvas.scale + 'px';
        this.continueButton.style.paddingTop = 10 * Canvas.scale + 'px';
        this.continueButton.style.paddingLeft = 40 * Canvas.scale + 'px';
        this.continueButton.style.paddingRight = 40 * Canvas.scale + 'px';
        this.continueButton.style.paddingBottom = 10 * Canvas.scale + 'px';
        this.continueButton.style.marginTop = 10 * Canvas.scale + 'px';
        this.continueButton.style.marginBottom = 10 * Canvas.scale + 'px';


        this.newGameButton = createButton("Новая игра", this.buttonWrapper, "main-menu-button");

        this.newGameButton.style.fontSize = 20 * Canvas.scale + 'px';
        this.newGameButton.style.paddingTop = 10 * Canvas.scale + 'px';
        this.newGameButton.style.paddingLeft = 40 * Canvas.scale + 'px';
        this.newGameButton.style.paddingRight = 40 * Canvas.scale + 'px';
        this.newGameButton.style.paddingBottom = 10 * Canvas.scale + 'px';
        this.newGameButton.style.marginTop = 10 * Canvas.scale + 'px';
        this.newGameButton.style.marginBottom = 10 * Canvas.scale + 'px';

        this.img = createImg("./assets/mainMenu/Background.png", this.mainScreen, "main-menu-background");
        this.title = createImg("./assets/mainMenu/title.png", this.mainScreen, "main-menu-title");
        this.title.style.width = 567 * Canvas.scale + 'px';
        this.title.style.height = 250 * Canvas.scale + 'px';
    }

    async show() {
        this.overlay.classList.add("active");

        Game.hintManager.hideTutorial();
        Game.base.basePanel.hide();
        Game.levelManager.waveManager.nextWavePopup.hide();
        Game.panel.hide();
        Game.startLevelPanel.hide();

        await wait(2500);
        this.isActive = true;
        Game.escapeMenu.isActive = false;
        this.mainScreen.style.display = "block";
        if (Game.gameIsNotStarted) this.continueButton.classList.remove("active");

        else this.continueButton.classList.add("active");
        this.continueButton.disabled = Game.gameIsNotStarted;


        if (!Game.hintManager.isCompleteGroup('intro')) {
            Game.hintManager.resetGroup('intro');
        }

        this.overlay.classList.remove("active");
    }

    async hide() {
        this.isActive = false;
        this.overlay.classList.add("active");
        await wait(4000);
        this.mainScreen.style.display = "none";
        this.overlay.classList.remove("active");
    }

    async hideAndRestartGame() {
        Game.startNewGame();
        await this.hide();
        Game.resumeGame();
    }

    async hideAndContinueGame() {
        Game.continueGame();
        await this.hide();
        Game.resumeGame();
    }

    hideInstant() {
        this.mainScreen.style.display = "none";
        this.isActive = false;
        this.overlay.classList.remove("active");
    }
}

