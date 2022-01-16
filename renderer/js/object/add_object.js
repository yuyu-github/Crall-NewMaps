import { centerX, centerY, elCenterX, elCenterY, elLeft, elTop, mapEl } from "../map.js";
import { draw } from "./draw.js";
import { objects, points } from "./object.js";

export function addPoint(x, y) {
    let linkedPoint = points.add({
        x: x,
        y: y,
    })
    return objects.add({
        type: 'point',
        linkedPoints: [linkedPoint],
    });
}

export function addLine(list) {
    let linkedPoints = [];
    for (let item of list) {
        linkedPoint.push(points.add({
            x: item[0],
            y: item[1],
        }))
    }
    return objects.add({
        type: 'line',
        linkedPoints: linkedPoints,
    });
}

export function addArea(list, closed = true) {
    let linkedPoints = [];
    for (let item of list) {
        linkedPoint.push(points.add({
            x: item[0],
            y: item[1],
        }));
    }
    return objects.add({
        type: 'area',
        linkedPoints: linkedPoints,
        closed: closed,
    });
}

document.getElementById('add-point').addEventListener('click', () => {
    mapEl.style.cursor = 'crosshair';
    mapEl.addEventListener('click', function fn(e) {
        draw(objects[addPoint(e.clientX - elLeft - elCenterX + centerX, e.clientY - elTop - elCenterY + centerY)]);
        mapEl.style.cursor = 'default';
        mapEl.removeEventListener('click', fn);
    })
})

document.getElementById('add-line').addEventListener('click', () => {
    mapEl.style.cursor = 'crosshair';

    let object = null;
    let lastPoint = null;
    mapEl.addEventListener('click', function fn(e) {
        if (object == null) object = objects[addLine([])];
        object.linkedPoints.push(points.add({
            x: e.clientX - elLeft - elCenterX + centerX, 
            y: e.clientY - elTop - elCenterY + centerY,
        }));

        function end() {
            mapEl.style.cursor = 'default';
            mapEl.removeEventListener('click', fn);
            lastPoint.style.cursor = 'default';
            lastPoint.removeEventListener('click', end);
        }
        if (lastPoint != null) lastPoint.style.cursor = 'default';
        lastPoint?.removeEventListener('click', end)
        lastPoint = draw(object)[1].slice(-1)[0];
        lastPoint.style.cursor = 'pointer';
        lastPoint.addEventListener('click', end);
    })
})

document.getElementById('add-area').addEventListener('click', () => {
    mapEl.style.cursor = 'crosshair';

    let object = null;
    let firstPoint = null;
    mapEl.addEventListener('click', function fn(e) {
        if (object == null) object = objects[addArea([], false)];
        object.linkedPoints.push(points.add({
            x: e.clientX - elLeft - elCenterX + centerX, 
            y: e.clientY - elTop - elCenterY + centerY,
        }));

        function end() {
            object.closed = true;
            draw(object);

            mapEl.style.cursor = 'default';
            mapEl.removeEventListener('click', fn);
            firstPoint.style.cursor = 'default';
            firstPoint.removeEventListener('click', end);
        }
        firstPoint = draw(object)[1][0];
        firstPoint.style.cursor = 'pointer'
        firstPoint.addEventListener('click', end);
    })
})