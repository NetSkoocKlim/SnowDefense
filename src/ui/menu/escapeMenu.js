import {createButton, createDivElement} from "../../utilities.js";
import {Game} from "../../game.js";

export class EscapeMenu {
    constructor() {
        this.escapeMenu = createDivElement(document.querySelector("#game"), null, null, null, "escapeMenu");
        this.isActive = false;
        this.initEscapeMenu();
    }

    initEscapeMenu() {
        this.escapeWrapper = createDivElement(this.escapeMenu, null, null, null, "esc-menu-buttons");
        this.continueButton = createButton("Продолжить", this.escapeWrapper, "esc-menu-button");
        this.exitButton = createButton("Главное меню", this.escapeWrapper, "esc-menu-button");

        this.confirmWrapper = createDivElement(
            this.escapeMenu,
            null, null, null,
            "esc-menu-confirm"
        );
        this.confirmWrapper.classList.add("hidden");

        this.confirmText = document.createElement('p');
        this.confirmText.innerHTML = "Вы уверены, что хотите выйти в главное меню?<br><br> Весь прогресс текущего уровня будет потерян.";
        this.confirmText.classList.add("esc-menu-confirm-text");
        this.confirmWrapper.appendChild(this.confirmText);

        this.confirmButtons = createDivElement(
            this.confirmWrapper,
            null, null, null,
            "esc-menu-confirm-buttons"
        );
        this.confirmButtons.style.position = "relative";


        this.confirmYes = createButton("Да", this.confirmButtons, "esc-menu-confirm-button");
        this.confirmYes.classList.add("confirm-yes");
        this.confirmNo  = createButton("Нет", this.confirmButtons, "esc-menu-confirm-button");
        this.confirmNo.classList.add("confirm-no");


        this.confirmNo.addEventListener("click", () => this.hideConfirmation());
        this.confirmYes.addEventListener("click", async () => {
            this.hideConfirmation();
            this.hide();
            await Game.mainMenu.show();
        });
    }

    show() {
        this.isActive = true;
        this.escapeMenu.style.display = "block";
        Game.stopDrawing();

        Game.base.basePanel.upgradePanel.hide();
        Game.base.basePanel.shopPanel.hide();
        Game.base.basePanel.show();
        Game.countDown.stop();

        this.escapeMenu.classList.remove("hiding");
        this.escapeMenu.classList.add("showing");
    }

    hide() {
        this.isActive = false;
        this.escapeMenu.classList.remove("showing");
        this.escapeMenu.classList.add("hiding");

        this.escapeWrapper.addEventListener("animationend", () => {
            if (!this.isActive) {
                this.escapeMenu.style.display = "none";
                this.escapeMenu.classList.remove("hiding");
                this.hideConfirmation();
            }
        }, { once: true });
    }

    showConfirmation() {
        this.escapeWrapper.classList.add("hidden");
        this.confirmWrapper.classList.remove("hidden");
    }

    hideConfirmation() {
        this.confirmWrapper.classList.add("hidden");
        this.escapeWrapper.classList.remove("hidden");
    }
}