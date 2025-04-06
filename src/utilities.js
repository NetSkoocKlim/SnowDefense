
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

export function drawCircle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

export function drawPolygon(ctx, points, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fill();
}