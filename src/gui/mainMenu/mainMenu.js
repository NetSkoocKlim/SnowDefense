import {Game} from "../../game.js";

export class mainMenu {
    constructor(){
        // Основные элементы
        this.startButton = document.getElementById('startButton');
        this.escapeMenu = document.getElementById('escapeMenu');
        this.continueButton = document.getElementById('continueButton');
        this.exitButton = document.getElementById('exitButton');

        // Состояния
        this.isActive = true;
        this.isGamePaused = false;

        // Инициализация обработчиков
        this.initStartButton();
        this.initEscapeMenu();
    }

    initStartButton() {
        this.startButton.addEventListener('click', () => {
            if (this.isActive) {
                Game.checkAndStart();
                this.isActive = false;
                this.startButton.style.display = 'none';
            }
        });
    }

    initEscapeMenu() {
        // Обработчик клавиши ESC для всего документа
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape' && !this.isActive) {
                this.toggleEscapeMenu();
            }
        });

        // Обработчики для кнопок ESC меню
        this.continueButton.addEventListener('click', () => this.handleContinue());
        this.exitButton.addEventListener('click', () => this.handleExit());
    }

    toggleEscapeMenu() {
        this.isGamePaused = !this.isGamePaused;
        this.escapeMenu.classList.toggle('active');

        // Управление паузой игры
        if(this.isGamePaused) {
            Game.pauseGame();
        } else {
            Game.resumeGame();
        }
    }

    handleContinue() {
        this.toggleEscapeMenu();
    }

    handleExit() {
        // Возврат в главное меню
        this.isActive = true;
        this.isGamePaused = false;
        this.escapeMenu.classList.remove('active');
        this.startButton.style.display = 'flex';
        Game.pauseGame();
    }
}