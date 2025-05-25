import {Canvas} from "../../canvas";
import {MineSpawner} from "../../entities/mine/mineSpawner.js";
import {Game} from "../../game.js";

export class ShopPanel {
    constructor() {
        this.container = document.getElementById("game");
        this.panel = document.createElement('div');
        this.panel.id = 'shop-panel';
        this.panel.classList.add('hidden');
        this.panel.style.position = 'absolute';
        this.panel.style.top = 5 * Canvas.scale + 'px';
        this.panel.style.left = 5 * Canvas.scale + 'px';
        this.panel.style.width = 210 * Canvas.scale + 'px';
        this.panel.style.fontSize = 10 * Canvas.scale + 'px';

        const title = document.createElement('h3');
        title.textContent = 'Магазин';
        title.className = 'shop-title';
        title.style.fontSize = 14 * Canvas.scale + 'px';
        this.panel.appendChild(title);

        this.list = document.createElement('div');
        this.list.className = 'shop-list';
        this.panel.appendChild(this.list);

        this.entries = {};

        this.addEntry('mine', {
            name: 'Минки-тортики',
            cost: MineSpawner.mineUnlockCost,
            type: 'purchase'
        });

        this.backBtn = document.createElement('button');
        this.backBtn.textContent = 'Назад';
        this.backBtn.className = 'back-button';
        this.panel.appendChild(this.backBtn);

        this.container.appendChild(this.panel);
    }

    addEntry(key, config) {
        const wrapper = document.createElement('div');
        wrapper.className = 'shop-entry';

        const title = document.createElement('div');
        title.className = 'entry-title';
        title.textContent = config.name;
        wrapper.appendChild(title);

        const desc = document.createElement('div');
        desc.className = 'entry-desc';
        wrapper.appendChild(desc);

        const controlCol = document.createElement('div');
        controlCol.className = 'entry-control-col';

        const circlesContainer = document.createElement('div');
        circlesContainer.className = 'level-circles';
        controlCol.appendChild(circlesContainer);

        const button = document.createElement('button');
        button.className = 'entry-button';
        controlCol.appendChild(button);

        wrapper.appendChild(controlCol);

        this.entries[key] = { wrapper, titleEl: title, desc, button, circles: [], circlesContainer, config };

        this.list.appendChild(wrapper);
        button.onclick = () => this.buySpawnUnlock();
        this.updateEntry(key);
    }

    updateEntry(key) {
        const entry = this.entries[key];
        const { desc, button, config, circles, circlesContainer } = entry;

        if (config.type === 'purchase') {
            circlesContainer.style.display = 'none';

            desc.innerHTML = `Дай возможность врагам вдоволь наесться тортиками!`;
            button.disabled = Game.points.currentPoints < config.cost;
            const iconSrc = "./assets/ice-coins/gold.svg";
            button.innerHTML = `<img src='${iconSrc}' class='currency-icon' alt='currency'/>${config.cost}`;
        } else if (config.type === 'upgrade') {
            const upgrade = MineSpawner.mineStats.grades;
            const maxLevel = upgrade.levels.length;
            if (circles.length === 0) {
                circlesContainer.innerHTML = '';
                for (let i = 0; i < maxLevel - 1; i++) {
                    const circle = document.createElement('span');
                    circle.className = 'level-circle';
                    circlesContainer.appendChild(circle);
                    circles.push(circle);
                }
            }
            circlesContainer.style.display = 'flex';

            const lvl = upgrade.currentLevel;
            circles.forEach((circle, idx) => {
                circle.classList.toggle('filled', idx < lvl);
                circle.classList.toggle('empty', idx >= lvl);
            });

            const next = upgrade.levels[lvl];
            this.showCurrentValues(key);

            if (!next || next.nextUpgradeCost === 0) {
                button.disabled = true;
                button.textContent = 'Максимум';
            } else {
                button.disabled = Game.points.currentPoints < next.nextUpgradeCost;
                const iconSrc = "./assets/ice-coins/gold.svg";
                button.innerHTML = `<img src='${iconSrc}' class='currency-icon' alt='currency'/>${next.nextUpgradeCost}`;
            }
        }
    }

    showCurrentValues(key) {
        const entry = this.entries[key];
        const stats = MineSpawner.mineStats;
        ['explosionDamage', 'explosionRadius', 'spawnRate'].forEach(statKey => {
            const stat = stats[statKey];
            entry[`text_${statKey}`].nodeValue = `${stat.upgradeDescription}: ${stat.value.value}`;
            entry[`arrow_${statKey}`].style.display = 'none';
        });
    }

    showNextValues(key) {
        const entry = this.entries[key];
        const stats = MineSpawner.mineStats;
        ['explosionDamage', 'explosionRadius', 'spawnRate'].forEach(statKey => {
            const stat = stats[statKey];
            const nextVal = stat.levels[stat.currentLevel + 1]?.value;
            entry[`text_${statKey}`].nodeValue = `${stat.upgradeDescription}: ${stat.value.value}`;
            if (nextVal !== undefined) {
                entry[`arrow_${statKey}`].textContent = ` → ${nextVal}`;
                entry[`arrow_${statKey}`].style.display = 'inline';
            }
        });
    }

    buySpawnUnlock() {
        const cost = MineSpawner.mineUnlockCost;
        if (Game.points.currentPoints >= cost) {
            Game.points.currentPoints -= cost;
            MineSpawner.spawnTimer.isShouldContinue = true;
            MineSpawner.setSpawnRate(MineSpawner.spawnRate);
            Game.panel.update({ gold: Game.points.currentPoints });

            const entry = this.entries['mine'];
            entry.config.type = 'upgrade';
            entry.desc.innerHTML = '';

            const stats = MineSpawner.mineStats;
            const statKeys = ['explosionDamage', 'explosionRadius', 'spawnRate'];
            entry.statLines = statKeys.map(statKey => {
                const stat = stats[statKey];
                const line = document.createElement('div');
                entry[`text_${statKey}`] = document.createTextNode('');
                line.appendChild(entry[`text_${statKey}`]);
                const arrow = document.createElement('span');
                arrow.style.display = 'none';
                entry[`arrow_${statKey}`] = arrow;
                line.appendChild(arrow);
                entry.desc.appendChild(line);
                return line;
            });

            entry.button.onmouseenter = () => this.showNextValues('mine');
            entry.button.onmouseleave = () => this.showCurrentValues('mine');
            entry.button.onclick = () => this.buyGradesUpgrade();

            this.updateEntry('mine');
        }
    }

    buyGradesUpgrade() {
        const upgrade = MineSpawner.mineStats.grades;
        const level = upgrade.currentLevel;
        const next = upgrade.levels[level];
        if (next && Game.points.currentPoints >= next.nextUpgradeCost) {
            Game.points.currentPoints -= next.nextUpgradeCost;
            Object.values(MineSpawner.mineStats).forEach(u => u.upgrade());
            MineSpawner.setSpawnRate(MineSpawner.spawnRate);
            Game.panel.update({ gold: Game.points.currentPoints });
            this.updateEntry('mine');
        }
    }

    show() {
        this.panel.classList.remove('hidden');
        this.updateAll();
    }

    hide() {
        this.panel.classList.add('hidden');
    }

    updateAll() {
        Object.keys(this.entries).forEach(key => this.updateEntry(key));
    }

    onBackClick(callback) {
        this.backBtn.addEventListener('click', callback);
    }
}
