import {Game} from "../game.js";
import {wait} from "../utilities.js";

export class GameOverPanel {
    constructor() {
        this.root = Game.gameDiv;
        this.isActive = false;
        this._createElements();
        this._setupButtons();
    }

    _createElements() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'game-over-overlay';

        this.box = document.createElement('div');
        this.box.className = 'game-over-box';

        this.boxImg = document.createElement('img');
        this.boxImg.className = 'game-over-img';
        this.boxImg.src = "./assets/gameOverPanel/panel.png"

        this.box.appendChild(this.boxImg);

        const title = document.createElement('h1');
        title.textContent = 'Game Over';
        this.box.appendChild(title);

        const btnContainer = document.createElement('div');
        btnContainer.className = 'game-over-buttons';

        this.btnMenu = document.createElement('button');
        this.btnMenu.id = 'btn-main-menu';
        this.btnMenu.textContent = 'Главное меню';

        this.btnRestart = document.createElement('button');
        this.btnRestart.id = 'btn-restart';
        this.btnRestart.textContent = 'Рестарт уровня';

        btnContainer.appendChild(this.btnRestart);
        btnContainer.appendChild(this.btnMenu);
        this.box.appendChild(btnContainer);

        this.overlay.appendChild(this.box);
        this.root.appendChild(this.overlay);
    }

    _setupButtons() {
        this.btnMenu.addEventListener('click', () => {
            this.hide();
            Game.mainMenu.show();
        });

        this.btnRestart.addEventListener('click', () => {
            this.hide();
            Game.continueGame();
            Game.levelManager.startLevel();
            Game.resumeGame();
        });
    }

    async show() {
        if (this.isActive) return;
        this.overlay.classList.add('active');
        this.overlay.style.visibility = 'visible';
        this.overlay.style.opacity = '1';
        await wait(1000);
        this.isActive = true;
    }

    hide() {
        if (!this.isActive) return;
        this.overlay.style.opacity = '0';
        this.overlay.style.visibility = 'hidden';
        this.overlay.classList.remove('active');
        this.isActive = false;
    }
}