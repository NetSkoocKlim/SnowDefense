
import {Canvas} from "./canvas/canvas.js";


export class ObjType {
    static Base = Symbol();
    static Tower = Symbol();
}

export function wait(ms) {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '800',
        backgroundColor: 'transparent',
    });
    document.body.appendChild(overlay);

    const blockEvent = e => {
        e.stopPropagation();
        e.preventDefault();
        return false;
    };

    const events = [
        'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove',
        'touchstart', 'touchmove', 'touchend',
        'keydown', 'keyup', 'keypress',
    ];

    events.forEach(evt =>
        document.addEventListener(evt, blockEvent, { capture: true })
    );

    return new Promise(resolve => {
        setTimeout(() => {
            document.body.removeChild(overlay);
            events.forEach(evt =>
                document.removeEventListener(evt, blockEvent, { capture: true })
            );
            resolve();
        }, ms);
    });
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

export function createImg(src, parent, className){
    const img = document.createElement("img");
    img.src = src;
    img.classList.add(className);
    parent.appendChild(img);

    return img;
}

export function createButton(text, parent, className){
    const Button = document.createElement("button");
    Button.innerText = text;
    Button.classList.add(className);
    parent.appendChild(Button);
    return Button;
}

export function createDivElement(parent, position, width, height, className) {
    const div = document.createElement('div');
    div.classList.add(className);
    div.style.width = width + 'px';
    div.style.height = height + 'px';
    if (position) {
        div.style.left = position.x + 'px';
        div.style.top = position.y + 'px';
    }
    div.style.position = 'absolute';
    parent.appendChild(div);
    return div;
}

export function drawCircle(x, y, radius, color, stroke) {
    Canvas.ctx.fillStyle = color;
    Canvas.ctx.beginPath();
    Canvas.ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );
    Canvas.ctx.fill();
    if (stroke) {
        Canvas.ctx.stroke();
    }
}

export function drawPolygon(points, color) {
    Canvas.ctx.fillStyle = color;
    Canvas.ctx.beginPath();
    Canvas.ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(p => Canvas.ctx.lineTo(p.x, p.y));
    Canvas.ctx.closePath();
    Canvas.ctx.fill();
}


export function deepClone(obj, hash = new WeakMap()) {
    if (Object(obj) !== obj) return obj;

    if (hash.has(obj)) return hash.get(obj);

    if (typeof obj.clone === 'function') {
        const cloned = obj.clone();
        hash.set(obj, cloned);
        return cloned;
    }

    const result = Array.isArray(obj)
        ? []
        : obj.constructor
            ? new obj.constructor()
            : {};

    hash.set(obj, result);

    for (const key of Reflect.ownKeys(obj)) {
        result[key] = deepClone(obj[key], hash);
    }
    return result;
}

