import {Game} from "../game.js";
import {wait} from "../utilities.js";

export class LevelStartPanel {
    constructor() {
        this.container = document.querySelector("#game");
        this.isActive = false;
        this.createOverlay();
        this.createPanel();
    }

    createOverlay() {
        this.overlay = document.createElement("div");
        this.overlay.className = "level-overlay";
        this.overlay.style.display = "none";
        this.container.appendChild(this.overlay);
    }

    createPanel() {
        this.panel = document.createElement("div");
        this.panel.className = "start-level-panel";

        this.titleEl = document.createElement("div");
        this.titleEl.className = "title";
        this.panel.appendChild(this.titleEl);

        this.statsEl = document.createElement("div");
        this.statsEl.className = "stats";
        this.panel.appendChild(this.statsEl);

        this.startBtn = document.createElement("button");
        this.startBtn.textContent = "Начать";
        this.attachStartHandler();
        this.panel.appendChild(this.startBtn);

        this.overlay.appendChild(this.panel);
    }

    setData({level, money, income, hp, attack, reward, elite}) {
        this.titleEl.textContent = `Уровень ${level}`;
        this.statsEl.innerHTML = "";

        const financeSection = document.createElement("div");
        financeSection.className = "section";
        financeSection.innerHTML = `
      <div class="section-title">Ресурсы</div>
      <div class="sub-divider"></div>
      Начальные Ледышки: ${money}<br>
      Доход: ${income}
    `;
        this.statsEl.appendChild(financeSection);

        this.statsEl.appendChild(
            Object.assign(document.createElement("div"), {className: "divider"})
        );

        const enemySection = document.createElement("div");
        enemySection.className = "section";
        enemySection.innerHTML = `
      <div class="section-title">Песцы</div>
      <div class="sub-divider"></div>
      Голод: ${hp}<br>
      Атака: ${attack}<br>
      Награда: ${reward}
    `;
        this.statsEl.appendChild(enemySection);

        if (elite) {
            this.statsEl.appendChild(
                Object.assign(document.createElement("div"), {className: "divider"})
            );

            const eliteSection = document.createElement("div");
            eliteSection.className = "section";
            eliteSection.innerHTML = `
        <div class="section-title">Элитные враги</div>
        <div class="sub-divider"></div>
        Голод: ${elite.hp}<br>
        Атака: ${elite.attack}<br>
        Награда: ${elite.reward}
      `;
            this.statsEl.appendChild(eliteSection);
        }
    }

    attachStartHandler() {
        this.startBtn.addEventListener("click", () => {
            this.hideAndStart();
        });
    }

    async show() {
        this.overlay.style.display = "flex";
        this.isActive = true;
        Game.pauseGame();
        await wait(1000);
    }

    hide() {
        this.overlay.style.display = "none";
        this.isActive = false;
    }

    hideAndStart() {
        this.hide();
        Game.levelManager.startLevel();
        Game.resumeGame();
    }
}
