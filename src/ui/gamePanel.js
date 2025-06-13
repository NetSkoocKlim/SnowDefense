import {Game} from "../game.js";

export class GamePanel {
    constructor(containerId) {
        this._createPanel();
        this._bindEvents();
        this.hide();
    }

    _createPanel() {
        this.el = document.createElement('div');
        this.el.className = 'game-panel collapsed';
        this.el.innerHTML = `
            <div class="panel-header">Статистика &#9662;</div>
            <div class="panel-content">
                <div class="summary">
                    <div class="row time-row">
                        <div class="label">Время:</div>
                        <div class="value"><span id="ui-time">0:00</span></div>
                    </div>
                    <div class="row gold-row">
                        <div class="label">Ледышки:</div>
                        <div class="value"><span id="ui-gold">0</span></div>
                    </div>
                    <div class="row level-row">
                        <div class="label">Уровень:</div>
                        <div class="value"><span id="ui-level">1</span></div>
                    </div>
                    <div class="row wave-row">
                        <div class="label">Волна:</div>
                        <div class="value"><span id="ui-wave">1/${Game.levelManager.waveManager.waveCount}</span></div>
                    </div>
                    <div class="row enemies-row">
                        <div class="label">Голодные враги:</div>
                        <div class="value"><span id="ui-enemies">0</span></div>
                    </div>
                    <div class="row income-row">
                        <div class="label">Доход:</div>
                        <div class="value"><span id="ui-income">0</span></div>
                    </div>
            
                </div>
            </div>
        `;
        Game.gameDiv.appendChild(this.el);

        this.header = this.el.querySelector('.panel-header');
        this.uiTime = this.el.querySelector('#ui-time');
        this.uiGold = this.el.querySelector('#ui-gold');
        this.uiLevel = this.el.querySelector('#ui-level');
        this.uiWave = this.el.querySelector('#ui-wave');
        this.uiEnemies = this.el.querySelector('#ui-enemies');
        this.uiIncome = this.el.querySelector('#ui-income');

        this._addIceIcon(this.uiGold);
        this._addIceIcon(this.uiIncome);
    }

    _addIceIcon(valueSpan) {
        const img = document.createElement('img');
        img.src = './assets/ice-coins/gold.svg';
        img.width = 24;
        img.height = 24;
        img.alt = '';
        img.className = 'icon-ice';
        valueSpan.parentNode.insertBefore(img, valueSpan.nextSibling);
    }


    _bindEvents() {
        this.header.addEventListener('click', () => this.toggle());
    }


    toggle() {
        this.el.classList.toggle('collapsed');
        if (this.el.classList.contains('collapsed')) {
            this.header.innerHTML = 'Статистика &#9662;';
        } else {
            this.header.innerHTML = 'Статистика &#9652;';
        }
    }

    flash(el ,newValue) {
        if (el.textContent !== String(newValue)) {
            el.classList.add('highlight');
            setTimeout(() => el.classList.remove('highlight'), 500);
        }
        el.textContent = newValue;
    }

    update(state) {
        const { elapsedMs, gold, level, wave, enemies, income } = state;
        if (elapsedMs !== undefined) {
            this.flash(this.uiTime, this._formatTime(elapsedMs));
        }
        if (gold !== undefined) {
            this.flash(this.uiGold, gold);
        }
        if (level !== undefined) {
            this.flash(this.uiLevel, level);
        }
        if (wave !== undefined) {
            this.flash(this.uiWave, `${wave}/${Game.levelManager.waveManager.waveCount}`);
        }
        if (enemies !== undefined) {
            this.flash(this.uiEnemies, enemies);
        }
        if (income !== undefined) {
            this.flash(this.uiIncome, income);
        }

    }

    _formatTime(secs) {
        const totalSec = Math.floor(secs);
        const m = Math.floor(totalSec / 60);
        const s= totalSec % 60;
        return m + ':' + (s < 10 ? '0' + s : s);
    }

    show() {
        this.el.style.display = 'block';
        this.isActive = true;
    }

    hide() {
        this.el.style.display = 'none';
        this.isActive = false;
    }
}