import {Scene} from "./entities/scene/";
import {Canvas} from "./entities/canvas/";
import {Game} from "./game.js";

export const addInteractionEscapeMenu = () => {
    window.addEventListener("keydown", event =>{
        if (event.code === "Escape") {
            if (document.querySelector(".mainMenu").style.display !== "none") {
                //Находимся в главном меню, предлагаем выйти из игры
            }
            else {
                if (!Game.escapeMenu.isActive) {
                    document.querySelector(".escapeMenu").style.display = "block";
                    Game.pauseGame();
                    Game.escapeMenu.isActive = true;
                    Game.base.basePanel.upgradePanel.hide();
                }
                else {
                    document.querySelector(".escapeMenu").style.display = "none";
                    Game.escapeMenu.isActive = false;
                    Game.resumeGame();
                }
            }
        }

    });

    Game.escapeMenu.continueButton.addEventListener("click", () => {
        document.querySelector(".escapeMenu").style.display = "none";
        Game.escapeMenu.isActive = false;
        Game.resumeGame();
    });

    Game.escapeMenu.exitButton.addEventListener("click", () => {
        document.querySelector(".escapeMenu").style.display = "none";
        document.querySelector(".mainMenu").style.display = "block";
        Game.escapeMenu.isActive = false;
        Game.mainMenu.isActive = true;
});
}

export const addInteractionMainMenu = ()=> {
    Game.mainMenu.button.addEventListener("click", (event)=>{
        event.stopPropagation();
        if (Game.mainMenu.isActive){
            Game.mainMenu.isActive = false;
            document.querySelector(".mainMenu").style.display = "none";
            Game.resumeGame();
        }
    })
}

export const addPauseListeners = () => {
    window.addEventListener('blur', () => {
        Game.escapeMenu.isActive = true;
        document.querySelector(".escapeMenu").style.display = "block";
        Game.pauseGame();
    });
}

export const addGunInteractionListeners = () => {
    Canvas.canvas.addEventListener('click', () => {
        Game.base.gun.fire();
    })

    Canvas.canvas.addEventListener('mousemove', (event) => {
        const rect = Canvas.canvas.getBoundingClientRect();
        Game.base.gun.updateRotation(event.clientX - rect.left, event.clientY - rect.top);
    })
}

export const addTowerInteractionListeners = () => {
    Scene.towerPlaces.forEach(place => {
        place.towerPlaceDiv.addEventListener('mouseover', (event) => {
            place.isSelected = true;
        })

        place.towerPlaceDiv.addEventListener('mouseout', (event) => {
            place.isSelected = false;
        })

        place.towerPlaceDiv.addEventListener('click', () => {
            place.handleTowerPlaceClick();
        });
    })
}

export const addBasePanelListeners = () => {
    Game.base.basePanel.upgradeBtn.addEventListener('click', () => {
        Game.base.basePanel.hide();
        Game.base.basePanel.upgradePanel.show();
    });

    Game.base.basePanel.upgradePanel.onBackClick(() => {
        Game.base.basePanel.upgradePanel.hide();
        Game.base.basePanel.show();
    });

    Object.keys(Game.base.gun.stats).forEach(key => {
        Game.base.basePanel.upgradePanel.onUpgrade(key, (upgradeKey) => {
            const upgrade = Game.base.gun.stats[upgradeKey];
            const currentLevel = upgrade.currentLevel;
            const next = upgrade.levels[currentLevel];
            if (!next || next.nextUpgradeCost === 0) return;
            const cost = next.nextUpgradeCost;
            if (Game.points.currentPoints >= cost) {
                Game.points.currentPoints -= cost;
                upgrade.upgrade();
                if (upgrade.name === "Время перезарядки") {
                    Game.base.gun.reloadTimer.reset({startTime: upgrade.value.value});
                }
                Game.base.basePanel.upgradePanel.updateAll();
                Game.panel.update({ gold: Game.points.currentPoints });
            } else {
                console.warn('Недостаточно золота для прокачки базы');
            }
        });
    });

    Game.base.basePanel.onExtraClick(() => {
        console.log('Extra upgrades clicked');
        // TODO: open extra-upgrades dialogue
    });
};