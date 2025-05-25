import {Game} from "../../game.js";
import {Canvas} from "../../canvas";
import {BaseUpgradePanel} from "./baseUpgradePanel.js";
import {ShopPanel} from "./shopPanel.js";

export class BasePanel {
    static panelHasBeenInited = false;

    constructor() {
        if (BasePanel.panelHasBeenInited === false) {
            this.initPanel();
        }
        this.upgradePanel = new BaseUpgradePanel();
        this.shopPanel = new ShopPanel();
    }


    reset() {
        this.upgradePanel.reset();
    }

    initPanel() {
        this.panel = document.getElementById("base-panel");
        this.panel.classList.add('hidden');
        this.panel.style.left = 5 * Canvas.scale + 'px';
        this.panel.style.top = 5 * Canvas.scale + 'px';
        this.panel.style.width = 205 * Canvas.scale + 'px';


        const hpWrapper = document.createElement('div');
        hpWrapper.className = 'hp-bar-container';
        this.hpFill = document.createElement('div');
        this.hpFill.className = 'hp-bar-fill';
        this.hpText = document.createElement('div');
        this.hpText.className = 'bar-text';
        this.hpText.textContent = '0 / 0';
        hpWrapper.append(this.hpFill, this.hpText);

        const reloadWrapper = document.createElement('div');
        reloadWrapper.className = 'reload-bar-container';
        this.reloadFill = document.createElement('div');
        this.reloadFill.className = 'reload-bar-fill';
        this.reloadText = document.createElement('div');
        this.reloadText.className = 'bar-text';
        reloadWrapper.append(this.reloadFill, this.reloadText);

        const btnRow = document.createElement('div');
        btnRow.className = 'button-row';
        this.upgradeBtn = document.createElement('button');
        this.upgradeBtn.textContent = 'Прокачка базы';
        this.extraBtn = document.createElement('button');
        this.extraBtn.textContent = 'Перейти в магазин';
        btnRow.append(this.upgradeBtn, this.extraBtn);

        this.panel.append(hpWrapper, reloadWrapper, btnRow);

        this.visible = false;
        BasePanel.panelHasBeenInited = true;
    }

    show() {
        Game.base.basePanel.upgradePanel.hide();
        Game.base.basePanel.shopPanel.hide();
        this.panel.classList.remove('hidden');
        this.visible = true;
    }

    update() {
        this.updateHP();
        this.updateReload();
    }

    hide() {
        this.panel.classList.add('hidden');
        this.visible = false;
    }

    updateHP() {
        const pct = Math.max(0, Math.min(1, Game.base.healthPoints / Game.base.maxHealthPoints)) * 100;
        this.hpFill.style.width = pct + '%';
        this.hpText.innerText = `${Game.base.healthPoints}`;
    }

    updateReload() {
        const timeLeft = Game.base.gun.reloadTimer.time;
        const totalTime = Game.base.gun.reloadTimer.startTime;
        if (Game.base.gun.canFire) {
            this.reloadFill.style.width = '100%';
            this.reloadText.textContent = "Готово!";
        } else {
            const pct = Math.max(0, Math.min(1, (totalTime - timeLeft) / totalTime)) * 100;
            this.reloadFill.style.width = pct + '%';
            this.reloadText.textContent = timeLeft.toFixed(1) + 'с';
        }
    }

    onExtraClick(callback) {
        this.extraBtn.addEventListener('click', callback);
    }
}