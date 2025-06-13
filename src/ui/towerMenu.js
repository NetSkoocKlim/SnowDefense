import {TowerUpgrade} from "../upgrade/towerUpgrade.js";
import {TowerPlace} from "../entities/tower/towerPlace.js";
import {Game} from "../game.js";

export class TowerMenu {
    tower;

    constructor(position) {
        this.isActive = false;
        this.attack = TowerUpgrade.startUpgrades.attack.value.value;
        this.cooldown = TowerUpgrade.startUpgrades.reloadTime.value.value;

        this.container = document.createElement('div');
        this.container.classList.add('tower-menu', 'hidden');
        this.container.style.top = `${position.y}px`;
        this.container.style.left = `${position.x}px`;

        this.titleBlock = document.createElement('div');
        this.titleBlock.classList.add('title');
        this.titleBlock.innerText = 'Раздатчик мороженного';
        this.container.appendChild(this.titleBlock);

        this.descBlock = document.createElement('div');
        this.descBlock.classList.add('section', 'desc');
        this.descBlock.innerText =
            "Выстреливает мороженным прямо в пасти голодных песцов, чтобы те наелись до отвала и утратили силу для штурма!";
        this.container.appendChild(this.descBlock);

        this.statsBlock = document.createElement('div');
        this.statsBlock.classList.add('section', 'stats-block');

        this.statsHeader = document.createElement('div');
        this.statsHeader.classList.add('stats-header');
        this.statsHeader.innerText = 'Характеристики';
        this.statsBlock.appendChild(this.statsHeader);

        this.statsValues = document.createElement('div');
        this.statsValues.classList.add('stats-values');

        this.atkRow = document.createElement('div');
        this.atkRow.classList.add('stat-row');
        this.atkLabel = document.createElement('span');
        this.atkLabel.classList.add('stat-label');
        this.atkLabel.innerText = 'АТК:';
        this.atkValue = document.createElement('span');
        this.atkValue.classList.add('stat-value');
        this.atkValue.innerText = this.attack;
        this.atkRow.append(this.atkLabel, this.atkValue);
        this.statsValues.appendChild(this.atkRow);

        this.cdRow = document.createElement('div');
        this.cdRow.classList.add('stat-row');
        this.cdLabel = document.createElement('span');
        this.cdLabel.classList.add('stat-label');
        this.cdLabel.innerText = 'КД:';
        this.cdValue = document.createElement('span');
        this.cdValue.classList.add('stat-value');
        this.cdValue.innerText = `${this.cooldown}с`;
        this.cdRow.append(this.cdLabel, this.cdValue);
        this.statsValues.appendChild(this.cdRow);

        this.statsBlock.appendChild(this.statsValues);
        this.container.appendChild(this.statsBlock);

        this.buttonsBlock = document.createElement('div');
        this.buttonsBlock.classList.add('section');

        this.buyRow = document.createElement('div');
        this.buyRow.classList.add('action-row');

        this.buyLabel = document.createElement('span');
        this.buyLabel.classList.add('action-label');
        this.buyLabel.innerText = 'Купить:';

        this.buyBtn = document.createElement('button');
        this.buyBtn.classList.add('btn');
        this.buyBtn.addEventListener('click', () => this.buyTower());
        this.buyRow.appendChild(this.buyLabel);
        this.buyRow.appendChild(this.buyBtn);

        this.sellRow = document.createElement('div');
        this.sellRow.classList.add('action-row');
        this.sellRow.style.display = 'none';

        this.sellLabel = document.createElement('span');
        this.sellLabel.classList.add('action-label');
        this.sellLabel.innerText = 'Продать:';

        this.sellBtn = document.createElement('button');
        this.sellBtn.classList.add('btn');
        this.sellBtn.addEventListener('click', () => this.sellTower());
        this.sellRow.appendChild(this.sellLabel);
        this.sellRow.appendChild(this.sellBtn);

        this.buttonsBlock.appendChild(this.buyRow);
        this.buttonsBlock.appendChild(this.sellRow);
        this.container.appendChild(this.buttonsBlock);

        Game.gameDiv.appendChild(this.container);
    }

    setPosition(position){
        this.container.style.top = `${position.y}px`;
        this.container.style.left = `${position.x}px`;
    }

    updateBuyButton() {
        const cost = TowerPlace.towerCost;
        const currentPoints = Game.points.currentPoints;
        if (currentPoints < cost) {
            this.buyBtn.disabled = true;
            this.buyBtn.classList.add('disabled');
        } else {
            this.buyBtn.disabled = false;
            this.buyBtn.classList.remove('disabled');
        }
        this.buyBtn.innerText = `${cost}`;
    }

    show() {
        if (!this.isActive) {
            this.container.classList.remove('hidden');
            this.isActive = true;
            this.updateBuyButton();
        }
    }

    hide() {
        if (this.isActive) {
            this.container.classList.add('hidden');
            this.isActive = false;
            this.buyBtn.innerText = `${TowerPlace.towerCost}`;
            this.updateBuyButton();
        }
    }

    buyTower() {
        if (Game.points.value < TowerPlace.towerCost) return;
        Game.points.decrease(TowerPlace.towerCost);
        this.sellPrice = Math.floor(TowerPlace.towerCost * 0.75);
        TowerPlace.towerPlacedCount++;
        this.tower.place.placeTower();

        this.buyRow.style.display = 'none';
        this.sellBtn.innerText = `${this.sellPrice}`;
        this.sellRow.style.display = 'flex';
    }

    sellTower() {
        this.tower.isActive = false;
        this.tower.place.towerIsPlaced = false;
        TowerPlace.towerPlacedCount--;
        Game.points.increase(this.sellPrice);

        this.buyRow.style.display = 'flex';
        this.sellRow.style.display = 'none';

        this.updateBuyButton();
    }
}
