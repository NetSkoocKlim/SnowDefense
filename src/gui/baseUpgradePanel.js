import { BaseUpgrade } from "../entities/upgrade/baseUpgrade.js";
import { Canvas } from "../entities/canvas";

export class BaseUpgradePanel {
    constructor() {
        this.container = document.getElementById("game");
        this.panel = document.createElement('div');
        this.panel.id = 'upgrade-panel';
        this.panel.classList.add('hidden');
        this.panel.style.position = 'absolute';
        this.panel.style.top = 5 * Canvas.scale + 'px';
        this.panel.style.left = 5 * Canvas.scale + 'px';
        this.panel.style.width = 210 * Canvas.scale + 'px';
        this.panel.style.fontSize = 12 * Canvas.scale + 'px';


        const title = document.createElement('h3');
        title.textContent = 'Улучшение базы';
        title.className = 'upgrade-title';
        title.style.fontSize = 14 * Canvas.scale + 'px';
        this.panel.appendChild(title);

        this.list = document.createElement('div');
        this.list.className = 'upgrade-list';

        this.upgradeEntries = {};
        Object.keys(BaseUpgrade.startUpgrades).forEach(key => {
            const upgrade = BaseUpgrade.startUpgrades[key];
            const entry = this.createEntry(upgrade, key);
            this.list.appendChild(entry.container);
            this.upgradeEntries[key] = entry;
        });
        this.panel.appendChild(this.list);

        this.backBtn = document.createElement('button');
        this.backBtn.textContent = 'Назад';
        this.backBtn.className = 'back-button';
        this.panel.appendChild(this.backBtn);

        this.container.appendChild(this.panel);

        this.active = false;
    }

    createEntry(upgrade, key) {
        const wrapper = document.createElement('div');
        wrapper.className = 'upgrade-entry';

        // Title of this upgrade
        const entryTitle = document.createElement('div');
        entryTitle.className = 'entry-title';
        entryTitle.textContent = upgrade.name;
        wrapper.appendChild(entryTitle);

        // Info row with icon and description
        const infoRow = document.createElement('div');
        infoRow.className = 'entry-info-row';

        const infoText = document.createElement('div');
        infoText.className = 'upgrade-name';
        infoText.textContent = upgrade.upgradeDescription;
        infoRow.appendChild(infoText);

        // Control column with circles, button
        const controlCol = document.createElement('div');
        controlCol.className = 'entry-control-col';

        // Circles for levels
        const circlesContainer = document.createElement('div');
        circlesContainer.className = 'level-circles';
        const circles = [];
        for (let i = 0; i < upgrade.maxLevel - 1; i++) {
            const circle = document.createElement('span');
            circle.className = 'level-circle';
            circlesContainer.appendChild(circle);
            circles.push(circle);
        }
        controlCol.appendChild(circlesContainer);

        // Upgrade button with cost and currency icon
        const button = document.createElement('button');
        button.className = 'upgrade-button';
        controlCol.appendChild(button);

        infoRow.appendChild(controlCol);
        wrapper.appendChild(infoRow);

        return { container: wrapper, upgrade, circles, button };
    }

    show() {
        this.panel.classList.remove('hidden');
        this.updateAll();
        this.active = true;
    }

    hide() {
        this.panel.classList.add('hidden');
        this.active = false;
    }

    updateAll() {
        Object.values(this.upgradeEntries).forEach(entry => {
            const { upgrade, circles, button } = entry;
            const lvl = upgrade.currentLevel;

            // Update circles fill
            circles.forEach((circle, idx) => {
                circle.classList.toggle('filled', idx < lvl);
                circle.classList.toggle('empty', idx >= lvl);
            });

            // Update button content
            const next = upgrade.levels[lvl];
            if (!next || next.nextUpgradeCost === 0) {
                button.disabled = true;
                button.innerHTML = 'Максимум';
            } else {
                const cost = next.nextUpgradeCost;
                const iconSrc = "./assets/ice-coins/gold.svg";
                button.disabled = false;
                button.innerHTML = `<img src='${iconSrc}' class='currency-icon' alt='currency'/>${cost}`;
            }
        });
    }

    onBackClick(callback) {
        this.backBtn.addEventListener('click', callback);
    }

    onUpgrade(key, callback) {
        const entry = this.upgradeEntries[key];
        if (entry) entry.button.addEventListener('click', () => callback(key));
    }
}