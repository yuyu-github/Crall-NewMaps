import { centerX, centerY, elCenterX, elCenterY, elLeft, elTop, mapEl } from "../map.js";
import { draw } from "./draw.js";
import { objects, points } from "./object.js";

export let editing = false;

export function init() {
    document.getElementById('add-point').addEventListener('click', () => {
        if (!editing) {
            editing = true;
            mapEl.style.cursor = 'crosshair';

            let hash = addPoint([]);
            let object = objects[hash];
            object.isPreview = true;
            mapEl.addEventListener('click', function fn(e) {
                mapEl.removeEventListener('click', fn);
                mapEl.removeEventListener('mousemove', moveFn);
                objects.addPoint(hash, points.add({
                    x: e.clientX - elLeft - elCenterX + centerX, 
                    y: e.clientY - elTop - elCenterY + centerY,
                }));
                object.isPreview = false;
                draw(object);
                mapEl.style.cursor = 'default';
                editing = false;
            });
            function moveFn(e) {
                object.previewX = e.clientX - elLeft - elCenterX + centerX;
                object.previewY = e.clientY - elTop - elCenterY + centerY;
                draw(object);
            }
            mapEl.addEventListener('mousemove', moveFn)
        }
    })

    document.getElementById('add-line').addEventListener('click', () => {
        if (!editing) {
            mapEl.style.cursor = 'crosshair';
            editing = true;

            let hash = addLine([], false)
            let object = objects[hash];
            let lastPoint = null;
            mapEl.addEventListener('click', clickFn);

            function clickFn(e) {
                objects.addPoint(hash, points.add({
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
                lastPoint.style.cursor = 'default';
                editing = false;
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
        }
    })

    document.getElementById('add-area').addEventListener('click', () => {
        if (!editing) {
            mapEl.style.cursor = 'crosshair';
            editing = true;

            let hash = addArea([], false)
            let object = objects[hash];
            let firstPoint = null;
            mapEl.addEventListener('click', clickFn);

            function clickFn(e) {
                objects.addPoint(hash, points.add({
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
                firstPoint.style.cursor = 'default';
                editing = false;
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
        }
    })
}

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
