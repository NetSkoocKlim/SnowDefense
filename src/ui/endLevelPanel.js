import {Game} from "../game.js";
import {wait} from "../utilities.js";

export class  EndLevelPanel {

    constructor({ parent, stats = {} }) {
        this.parent = parent;
        this.stats = { ...stats };
        this.render();
    }

    render() {
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
        this.updateStats();

        const btnWrapper = document.createElement('div');
        btnWrapper.className = 'elp-buttons';

        this.btnMain = document.createElement('button');
        this.btnMain.className = 'elp-btn';
        this.btnMain.textContent = 'В главное     меню';
        this.btnMain.onclick = () => this.toMainMenu();

        this.btnCont = document.createElement('button');
        this.btnCont.className = 'elp-btn';
        this.btnCont.textContent = 'Следующий уровень';

        this.btnCont.onclick = () => {
            this.hide();
            Game.continueGame();
            wait(500).then(() => {
                Game.startLevelPanel.show();
            })
        }

        btnWrapper.append(this.btnCont, this.btnMain);
        this.panel.appendChild(btnWrapper);

        this.overlay.appendChild(this.panel);
        this.parent.appendChild(this.overlay);
        this.hide();
    }

    updateStats() {
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
        this.updateStats();
    }

    async toMainMenu() {
        this.hide();
        await Game.mainMenu.show();
    }

    show() {
        this.btnCont.style.display = 'block';
        Game.statsPanel.el.classList.add('collapsed');
        this.overlay.style.display = 'flex';
        this.isActive = true;
        requestAnimationFrame(() => this.panel.classList.add('elp-panel--show'));
        Game.base.basePanel.show();
    }

    showLast() {
        Game.statsPanel.el.classList.add('collapsed');
        Game.endLevelPanel.statsContainer.innerHTML = '';
        Game.endLevelPanel.title = "Последний уровень пройден! Поздравляем!";
        document.querySelector(".elp-title").innerHTML = Game.endLevelPanel.title;
        this.btnCont.style.display = 'none';
        this.overlay.style.display = 'flex';
        this.isActive = true;
        Game.gameIsNotStarted = true;
        requestAnimationFrame(() => this.panel.classList.add('elp-panel--show'));
    }

    hide() {
        this.panel.classList.remove('elp-panel--show');
        this.overlay.style.display = 'none';
        this.isActive = false;
    }
}