import {Game} from "../game.js";

export class NextWavePopup {
    constructor(containerId = 'next-wave-popup-container') {
        this.container = document.getElementById(containerId);
        this.popup = document.createElement('div');
        this.popup.classList.add('next-wave-popup');
        this.timeElem = this.popup.querySelector('.time');
        this.container.appendChild(this.popup);
    }

    showNextWaveTimer() {
        this.popup.innerHTML = `
      <div class="popup-content">
        Следующая волна через <span class="time">${Game.levelManager.waveManager.waveEndTimer.seconds}</span> секунд
      </div>
    `;
        this.timeElem = this.popup.querySelector('.time');
        this.popup.classList.add('_visible');
        this.update();
        Game.levelManager.waveManager.waveEndTimer.onTick = () => this.update();
    }

    showEndWaveWarning() {
        this.popup.innerHTML = `
        <div class="popup-content">
            Последняя волна.<br><br>
            Для продолжения <br>
            отбейся от оставшихся врагов!
        </div>`;
        this.popup.classList.add('_visible', 'final-warning');
    }

    update() {
        this.timeElem.textContent = Game.levelManager.waveManager.waveEndTimer.seconds;
    }

    hide() {
        this.popup.classList.remove('_visible', 'final-warning');
        Game.levelManager.waveManager.waveEndTimer.onTick = null;
    }
}