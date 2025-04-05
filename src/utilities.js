export class ObjectType {
    static Base = Symbol('base');
    static Enemy = Symbol('enemy');
    static Path = Symbol('path');
}

export function rotatePoint(point, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: point.x * cos - point.y * sin,
        y: point.x * sin + point.y * cos
    };
}

export function getRectangleBorders(width, height) {
    return [
        {x: 0, y: 0},
        {x: width, y: 0},
        {x: width, y: height},
        {x: 0, y: height},
    ]
}

export function getTriangleBorder(width, height) {
    return [
        {x: width, y: -height / 2},
        {x: width, y: height / 2},
        {x: 0, y: 0}
    ];
}

export function createDivElement(parent, position, width, height, className) {
    const div = document.createElement('div');
    div.classList.add(className);
    div.style.width = width + 'px';
    div.style.height = height + 'px';
    div.style.left = position.x + 'px';
    div.style.top = position.y + 'px';
    div.style.position = 'absolute';
    parent.appendChild(div);
    return div;
}