import {createDivElement, createImg} from "../../utilities.js";
import {createButton} from "../../utilities.js";

export class Menu {
    constructor() {
        this.mainScreen = createDivElement(document.querySelector("#game"), null, null, null, "mainMenu");
        this.initMainMenu();
        this.isActive = true;
    }

    initMainMenu() {
        this.wrapper = createDivElement(this.mainScreen, null, null, null, "wrapper");
        this.button = createButton("Старт", this.wrapper, "button");
        this.img = createImg("assets/Background/Background.png", this.mainScreen, "img");
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

