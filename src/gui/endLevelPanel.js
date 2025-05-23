import {Game} from "../game.js";

export class  EndLevelPanel {

    constructor({ parent, stats = {},  onContinue }) {
        this.parent = parent;
        this.stats = { ...stats };
        this.onContinue = onContinue;
        this._render();
    }

    _render() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'elp-overlay';

        this.panel = document.createElement('div');
        this.panel.className = 'elp-panel';

        const titleEl = document.createElement('div');
        titleEl.className = 'elp-title';
        titleEl.textContent = this.title;
        this.panel.appendChild(titleEl);

        this.statsContainer = document.createElement('div');
        this.statsContainer.className = 'elp-stats';
        this.panel.appendChild(this.statsContainer);
        this._updateStats();

        const btnWrapper = document.createElement('div');
        btnWrapper.className = 'elp-buttons';

        this.btnMain = document.createElement('button');
        this.btnMain.className = 'elp-btn';
        this.btnMain.textContent = 'В главное меню';
        this.btnMain.onclick = () => this.toMainMenu();

        this.btnCont = document.createElement('button');
        this.btnCont.className = 'elp-btn';
        this.btnCont.textContent = 'Продолжить';
        this.btnCont.onclick = () => this.onContinue && this.onContinue();

        btnWrapper.append(this.btnMain, this.btnCont);
        this.panel.appendChild(btnWrapper);

        this.overlay.appendChild(this.panel);
        this.parent.appendChild(this.overlay);
        this.hide();
    }

    _updateStats() {
        this.statsContainer.innerHTML = '';
        Object.entries(this.stats).forEach(([key, value]) => {
            const row = document.createElement('div');
            row.className = 'elp-row';

            const label = document.createElement('div');
            label.className = 'elp-key';
            label.textContent = key;

            const val = document.createElement('div');
            val.className = 'elp-value';
            val.textContent = value;

            row.append(label, val);
            this.statsContainer.appendChild(row);
        });
    }

    setStats(stats) {
        Object.keys(stats).forEach(key => {
            if (key==="Уровень") {
                this.title = key + " " + stats[key] + " " + "пройден";
                document.querySelector(".elp-title").textContent = this.title;
            }
            else {
                this.stats[key] = stats[key];
            }
        })
        this._updateStats();
    }

    toMainMenu() {
        this.hide();
        Game.mainMenu.show();
    }

    show() {
        this.overlay.style.display = 'flex';
        this.isActive = true;
        requestAnimationFrame(() => this.panel.classList.add('elp-panel--show'));
    }

    hide() {
        this.panel.classList.remove('elp-panel--show');
        this.overlay.style.display = 'none';
        this.isActive = false;
    }
}