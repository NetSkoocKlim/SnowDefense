import {Collision} from "../../collision.js";
import {Canvas} from "../canvas/";
import {TowerPlace} from "../tower/towerPlace.js";
import {Way} from "./way.js";
import {Game} from "../../game.js";


export class Scene {
    static ways = [];
    static towerPlaces = [];

    constructor() {
        this.sceneSize = Canvas.width;
        this.sceneImg = new Image();
        this.sceneImg.src = "./assets/map/map.jpg";
        this.createPathes();
        this.createTowerPlaces();
    }

    createPathes() {
        let pathWidth =  Game.base.size * 0.85;
        let pathLength = this.sceneSize / 2 - Game.base.size / 2 + Game.base.size * 0.1;
        Scene.ways.push(
            new Way({
                x: 0,
                y: this.sceneSize / 2 - Game.base.size / 2 + Game.base.size * 0.1
            }, pathLength, pathWidth, 1),
            new Way( {
                x: this.sceneSize / 2 - Game.base.size / 2 + Game.base.size * 0.1,
                y: this.sceneSize / 2 + Game.base.size / 2 - Game.base.size * 0.1,
            }, pathWidth, pathLength, 2),
            new Way( {
                x: this.sceneSize / 2 + Game.base.size / 2 - Game.base.size * 0.1,
                y: this.sceneSize / 2 - Game.base.size / 2 + Game.base.size * 0.1
            }, pathLength, pathWidth, 3),
            new Way( {
                x: this.sceneSize / 2 - Game.base.size / 2 + Game.base.size * 0.1,
                y: 0
            }, pathWidth, pathLength, 4),
        );
    }

    createTowerPlaces() {
        const baseSize = Game.base.size;
        const towerSize = baseSize / 4;
        const {x, y} = Game.base.position;
        const towerPosition1 = {
            x: x - towerSize*1.5,
            y: y - towerSize*1.5
        };
        const towerPosition2 = {
            x: x - towerSize*1.5,
            y: y + baseSize + towerSize/2
        };
        const towerPosition3 = {
            x: x + baseSize + towerSize/2,
            y: y - towerSize*1.5
        };
        const towerPosition4 = {
            x: x + baseSize + towerSize/2,
            y: y + baseSize + towerSize/2
        };
        Scene.towerPlaces.push(
            new TowerPlace(towerPosition1, towerSize),
            new TowerPlace(towerPosition2, towerSize),
            new TowerPlace(towerPosition3, towerSize),
            new TowerPlace(towerPosition4, towerSize)
        );
    }

    draw({collision=false}) {
        // Canvas.ctx.fillStyle = '#ad5f3e';
        // Canvas.ctx.fillRect(0, 0, this.sceneSize, this.sceneSize);
        Canvas.ctx.drawImage(this.sceneImg, 0,0, 1024, 1024, 0,0, this.sceneSize, this.sceneSize);

        Scene.ways.forEach(way => {
            way.draw();
        });

        Scene.towerPlaces.forEach((towerPlace) => {
            if (!towerPlace.towerIsPlaced)
            towerPlace.draw();
        });

        if (collision) Collision.pathCollisions.forEach(pathCollision => {
            pathCollision.draw();
        });
    }

}