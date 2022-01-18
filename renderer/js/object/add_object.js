import { centerX, centerY, elCenterX, elCenterY, elLeft, elTop, mapEl } from "../map.js";
import { draw } from "./draw.js";
import { objects, points } from "./object.js";

export function addPoint(position) {
    let linkedPoints = position.length != 0 ? [points.add({
        x: position[0],
        y: position[1],
    })] : []
    return objects.add({
        type: 'point',
        linkedPoints: linkedPoints,
    });
}

export function addLine(list) {
    let linkedPoints = [];
    for (let item of list) {
        linkedPoints.push(points.add({
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
        linkedPoints.push(points.add({
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

    let object = objects[addPoint([])];
    object.isPreview = true;
    mapEl.addEventListener('click', function fn(e) {
        mapEl.removeEventListener('click', fn);
        mapEl.removeEventListener('mousemove', moveFn);
        object.linkedPoints.push(points.add({
            x: e.clientX - elLeft - elCenterX + centerX, 
            y: e.clientY - elTop - elCenterY + centerY,
        }));
        object.isPreview = false;
        draw(object);
        mapEl.style.cursor = 'default';
    });
    function moveFn(e) {
        object.previewX = e.clientX - elLeft - elCenterX + centerX;
        object.previewY = e.clientY - elTop - elCenterY + centerY;
        draw(object);
    }
    mapEl.addEventListener('mousemove', moveFn)
})

document.getElementById('add-line').addEventListener('click', () => {
    mapEl.style.cursor = 'crosshair';

    let object = objects[addLine([])];
    let lastPoint = null;
    mapEl.addEventListener('click', clickFn);

    function clickFn(e) {
        object.linkedPoints.push(points.add({
            x: e.clientX - elLeft - elCenterX + centerX, 
            y: e.clientY - elTop - elCenterY + centerY,
        }));
        object.isPreview = false;
    }

    function end() {
        mapEl.removeEventListener('click', clickFn);
        lastPoint.removeEventListener('click', end);
        mapEl.removeEventListener('mousemove', moveFn);
        object.isPreview = false;
        draw(object);
        mapEl.style.cursor = 'default';
        if (lastPoint != null) lastPoint.style.cursor = 'default';
    }

    function moveFn(e) {
        object.previewX = e.clientX - elLeft - elCenterX + centerX;
        object.previewY = e.clientY - elTop - elCenterY + centerY;
        object.isPreview = true;

        lastPoint?.removeEventListener('click', end)
        if (lastPoint != null) lastPoint.style.cursor = 'default';
        lastPoint = draw(object)[1].slice(-1)[0];
        lastPoint?.addEventListener('click', end);
        if (lastPoint != null) lastPoint.style.cursor = 'pointer';
    }
    mapEl.addEventListener('mousemove', moveFn);
})

document.getElementById('add-area').addEventListener('click', () => {
    mapEl.style.cursor = 'crosshair';

    let object = objects[addArea([], false)];
    let firstPoint = null;
    mapEl.addEventListener('click', clickFn);

    function clickFn(e) {
        object.linkedPoints.push(points.add({
            x: e.clientX - elLeft - elCenterX + centerX, 
            y: e.clientY - elTop - elCenterY + centerY,
        }));
        object.isPreview = false;
    }

    function end() {
        mapEl.removeEventListener('click', clickFn);
        firstPoint.removeEventListener('click', end);
        mapEl.removeEventListener('mousemove', moveFn);
        object.isPreview = false;
        object.closed = true;
        draw(object);
        mapEl.style.cursor = 'default';
        if (firstPoint != null) firstPoint.style.cursor = 'default';
    }

    function moveFn(e) {
        object.previewX = e.clientX - elLeft - elCenterX + centerX;
        object.previewY = e.clientY - elTop - elCenterY + centerY;
        object.isPreview = true;

        firstPoint = draw(object)[1][0];
        firstPoint?.addEventListener('click', end);
        if (firstPoint != null) firstPoint.style.cursor = 'pointer'
    }
    mapEl.addEventListener('mousemove', moveFn);
})