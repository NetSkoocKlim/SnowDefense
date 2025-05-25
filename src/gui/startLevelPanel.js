import {Game} from "../game.js";
import {wait} from "../utilities.js";

export class LevelStartPanel {
    constructor() {
        this.container = document.querySelector("#game")
        this._createPanel();
        this.isActive = false;
    }

    _createPanel() {
        this.panel = document.createElement('div');
        this.panel.className = 'start-level-panel';

        this.titleEl = document.createElement('div');
        this.titleEl.className = 'title';
        this.panel.appendChild(this.titleEl);

        this.statsEl = document.createElement('div');
        this.statsEl.className = 'stats';
        this.panel.appendChild(this.statsEl);

        this.startBtn = document.createElement('button');
        this.startBtn.textContent = 'Начать';
        this.onStart();

        this.panel.appendChild(this.startBtn);
        this.container.appendChild(this.panel);
    }


    setData({level, money, income, hp, attack, reward, elite}) {
        this.titleEl.textContent = `Уровень ${level}`;
        this.statsEl.innerHTML = '';

        const financeSection = document.createElement('div');
        financeSection.className = 'section';
        financeSection.innerHTML = `
          <div class="section-title">Финансы и доход</div>
          <div class="sub-divider"></div>
          Деньги: ${money}<br>
          Доход: ${income}
        `;
        this.statsEl.appendChild(financeSection);

        this.statsEl.appendChild(Object.assign(document.createElement('div'), {className: 'divider'}));

        const enemySection = document.createElement('div');
        enemySection.className = 'section';
        enemySection.innerHTML = `
          <div class="section-title">Песцы</div>
          <div class="sub-divider"></div>
          Голод: ${hp}<br>
          Атака: ${attack}<br>
          Награда: ${reward}
        `;
        this.statsEl.appendChild(enemySection);

        if (elite) {
            this.statsEl.appendChild(Object.assign(document.createElement('div'), {className: 'divider'}));

            const eliteSection = document.createElement('div');
            eliteSection.className = 'section';
            eliteSection.innerHTML = `
            <div class="section-title">Элитные враги</div>
            <div class="sub-divider"></div>
            Шанс спавна: ${elite.chance}%<br>
            Голод: ${elite.hp}<br>
            Атака: ${elite.attack}<br>
            Награда: ${elite.reward}
          `;
            this.statsEl.appendChild(eliteSection);
        }
    }

    onStart() {
        this.startBtn.addEventListener('click', () => {
                this.hideAndStart();
            }
        );
    }

    async show() {
        this.panel.style.display = 'block';

        this.isActive = true;
        Game.pauseGame();

        await wait(1000);
    }

    hide() {
        if (!this.isActive) return;
        this.panel.style.display = 'none';
        this.isActive = false;
    }

    hideAndStart() {
        this.hide();
        Game.levelManager.startLevel();
    }
}