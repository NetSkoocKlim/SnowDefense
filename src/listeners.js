import {Scene} from "./scene/scene.js";
import {Canvas} from "./canvas/canvas.js";
import {Game} from "./game.js";

export const addInteractionEscapeMenu = () => {
    window.addEventListener("keydown", event => {
        if (event.code === "Escape") {
            if (Game.mainMenu.isActive === true) {

            }
            else if (Game.endLevelPanel.isActive === true) {

            }
            else if (Game.gameOverPanel.isActive === true) {

            }
            else {
                if (!Game.escapeMenu.isActive) {
                    Game.escapeMenu.show();
                    Game.pauseGame();
                } else {
                    Game.escapeMenu.hideConfirmation();
                    Game.escapeMenu.hide();
                    if (!Game.levelManager.levelIsFinished && !Game.hintManager.current && !Game.startLevelPanel.isActive) Game.countDown.start();
                }
            }
        }

    });

    Game.escapeMenu.continueButton.addEventListener("click", () => {
        Game.escapeMenu.hide();
        if (!Game.levelManager.levelIsFinished && !Game.hintManager.current && !Game.startLevelPanel.isActive) Game.countDown.start();
    });

    Game.escapeMenu.exitButton.addEventListener("click", () => {
        Game.escapeMenu.showConfirmation();
    });
}

export const addInteractionMainMenu = () => {
    Game.mainMenu.newGameButton.addEventListener("click", async () => {
        if (Game.mainMenu.isActive === true) {
            await Game.mainMenu.hideAndRestartGame();
        }
    })

    Game.mainMenu.continueButton.addEventListener("click", async () => {
        if (Game.mainMenu.isActive === true) {
            if (!Game.gameIsNotStarted) await Game.mainMenu.hideAndContinueGame();
        }

    })
}

export const addPauseListeners = () => {
    window.addEventListener('blur', () => {
        if (Game.mainMenu.isActive || Game.escapeMenu.isActive || Game.endLevelPanel.isActive || Game.gameOverPanel.isActive || Game.startLevelPanel.isActive) {
            return
        }
        Game.escapeMenu.show();
        Game.pauseGame();
    });
}

export const addGunInteractionListeners = () => {
    Canvas.canvas.addEventListener('click', () => {
        Game.towers.forEach((tower) => {
            tower.towerMenu.hide();
        })
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
            if (place.placedTower.towerMenu.isActive) {
                place.placedTower.towerMenu.hide();
            }
            else {
                Scene.towerPlaces.forEach(place => {
                    place.placedTower.towerMenu.hide();
                })
                place.placedTower.towerMenu.show();
            }
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
            Game.statsPanel.update({gold: Game.points.currentPoints});
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