import {createDivElement, getRectangleBorders} from "../../utilities.js";
import {Collision, PolygonCollision} from "../../collision.js";
import {Base} from "../base/";
import {Canvas} from "../canvas/";
import {Tower} from "../tower";
import {Game} from "../../game.js";

class Way {
    constructor(position, width, height) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.collision = new PolygonCollision(this.position, getRectangleBorders(this.width, this.height),
            0);
        Collision.pathCollisions.push(this.collision);
    }

    draw() {
        Canvas.ctx.fillStyle = '#fff';
        Canvas.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class TowerPlace {
    constructor(position, size) {
        this.position = position;
        this.size = size;
        this.towerIsPlaced = false;
        this.collision = new PolygonCollision({x: this.position.x - 5,
            y: this.position.y - 5}, getRectangleBorders(this.size + 10, this.size + 10), 0);
        this.towerPlaceDiv = createDivElement(document.querySelector('#game'), this.collision.position, this.size, this.size, 'towerPlace');
        this.isSelected = false;
    }

    draw() {
        if (!this.isSelected && ! this.towerIsPlaced)
            Canvas.ctx.fillStyle = '#ff0000';
        else
            Canvas.ctx.fillStyle =  'rgba(255, 0, 0, 0.5)';
        Canvas.ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
        this.collision.draw();
    }

    get center() {
        return {
            x: this.position.x + this.size / 2,
            y: this.position.y + this.size / 2
        }
    }

    setTower() {
        if (!this.towerIsPlaced && Game.points.currentPoints >= Tower.cost) {
            Tower.buyTower(this);
        }
    }
}

export class Map {
    static ways = [];
    static towerPlaces = [];
    static towers = [];

    constructor() {
        this.sceneSize = Canvas.width;
        this.base = new Base();
        this.createPathes();
        this.createTowerPlaces();
    }

    createPathes() {
        let pathSize =  (this.sceneSize - this.base.size) / 2;
        Map.ways.push(
            new Way({
                x: 0,
                y: 0
            }, pathSize, pathSize),
            new Way( {
                x: pathSize + this.base.size,
                y: 0
            }, pathSize, pathSize),
            new Way( {
                x: pathSize + this.base.size,
                y: pathSize + this.base.size
            }, pathSize, pathSize),
            new Way( {
                x: 0,
                y: pathSize + this.base.size
            }, pathSize, pathSize),
        );
    }

    createTowerPlaces() {
        const baseSize = this.base.size;
        const towerSize = baseSize / 3;
        const {x, y} = this.base.position;
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
        Map.towerPlaces.push(
            new TowerPlace(towerPosition1, towerSize),
            new TowerPlace(towerPosition2, towerSize),
            new TowerPlace(towerPosition3, towerSize),
            new TowerPlace(towerPosition4, towerSize)
        );
    }

    draw({collision=false}) {
        Canvas.ctx.fillStyle = '#ad5f3e';
        Canvas.ctx.fillRect(0, 0, this.sceneSize, this.sceneSize);

        Map.ways.forEach(way => {
            way.draw();
        });

        Map.towerPlaces.forEach((towerPlace) => {
            towerPlace.draw();
        });

        if (collision) Collision.pathCollisions.forEach(pathCollision => {
            pathCollision.draw();
        });
    }

}