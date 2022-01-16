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
    mapEl.addEventListener('click', function fn(e) {
        draw(objects[addPoint(e.clientX - elLeft - elCenterX + centerX, e.clientY - elTop - elCenterY + centerY)]);
        mapEl.removeEventListener('click', fn);
    })
})

document.getElementById('add-line').addEventListener('click', () => {
    let object = null;
    let lastPoint = null;
    mapEl.addEventListener('click', function fn(e) {
        if (object == null) object = objects[addLine([])];
        object.linkedPoints.push(points.add({
            x: e.clientX - elLeft - elCenterX + centerX, 
            y: e.clientY - elTop - elCenterY + centerY,
        }));

        function end() {
            mapEl.removeEventListener('click', fn);
            lastPoint.removeEventListener('click', end);
        }
        lastPoint?.removeEventListener('click', end)
        lastPoint = draw(object)[1].slice(-1)[0];
        lastPoint.addEventListener('click', end);
    })
})

document.getElementById('add-area').addEventListener('click', () => {
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

            mapEl.removeEventListener('click', fn);
            firstPoint.removeEventListener('click', end);
        }
        firstPoint = draw(object)[1][0];
        firstPoint.addEventListener('click', end);
    })
})