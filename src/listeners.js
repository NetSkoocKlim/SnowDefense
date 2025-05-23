import {Scene} from "./entities/scene/";
import {Canvas} from "./entities/canvas/";
import {Game} from "./game.js";

export const addInteractionEscapeMenu = () => {
    window.addEventListener("keydown", event =>{
        if (event.code === "Escape") {
            if (Game.mainMenu.isActive === true) {

            }
            else if (Game.endLevelPanel.isActive === true) {

            }
            else {
                if (!Game.escapeMenu.isActive) {
                    document.querySelector(".escapeMenu").style.display = "block";
                    Game.pauseGame();
                    Game.escapeMenu.isActive = true;

                    Game.base.basePanel.show();
                    Game.countDown.stop();
                }
                else {
                    document.querySelector(".escapeMenu").style.display = "none";
                    Game.escapeMenu.isActive = false;
                    if (!Game.end && !Game.hintManager.current) Game.countDown.start();
                }
            }
        }

    });

    Game.escapeMenu.continueButton.addEventListener("click", () => {
        document.querySelector(".escapeMenu").style.display = "none";
        Game.escapeMenu.isActive = false;
        if (!Game.end && !Game.hintManager.current) Game.countDown.start();
    });

    Game.escapeMenu.exitButton.addEventListener("click", () => {
        document.querySelector(".escapeMenu").style.display = "none";
        Game.mainMenu.show();
    });
}


export const addInteractionMainMenu = ()=> {
    Game.mainMenu.button.addEventListener("click", (event)=>{
        Game.mainMenu.hideAndRestartGame();
    })
}

export const addPauseListeners = () => {
    window.addEventListener('blur', () => {
        if (Game.mainMenu.isActive || Game.endLevelPanel.isActive) {return}
        Game.escapeMenu.isActive = true;
        document.querySelector(".escapeMenu").style.display = "block";
        Game.pauseGame();
        Game.base.basePanel.upgradePanel.hide();
        Game.base.basePanel.shopPanel.hide();
        Game.base.basePanel.show();
        Game?.countDown.stop();
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
            Game.points.currentPoints -= cost;
            upgrade.upgrade();
            if (upgrade.name === "Время перезарядки") {
                Game.base.gun.reloadTimer.reset({startTime: upgrade.value.value});
            }
            Game.base.basePanel.upgradePanel.updateAll();
            Game.panel.update({ gold: Game.points.currentPoints });
        });
    });

    Game.base.basePanel.onExtraClick(() => {
        Game.base.basePanel.hide();
        Game.base.basePanel.shopPanel.show();
    });


    Game.base.basePanel.shopPanel.onBackClick(() => {
        Game.base.basePanel.shopPanel.hide();
        Game.base.basePanel.show();
    });
};