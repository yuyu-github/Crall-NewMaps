import { centerX, centerY, elCenterX, elCenterY, elLeft, elTop } from "../map.js";
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

export function addArea(list) {
    let linkedPoints = [];
    for (let item of list) {
        linkedPoint.push(points.add({
            x: item[0],
            y: item[1],
        }))
    }
    return objects.add({
        type: 'area',
        linkedPoints: linkedPoints,
    });
}

document.getElementById('add-point').addEventListener('click', () => {
    document.getElementById('map').addEventListener('click', function fn(e) {
        draw(objects[addPoint(e.clientX - elLeft - elCenterX + centerX, e.clientY - elTop - elCenterY + centerY)]);
        e.currentTarget.removeEventListener('click', fn);
    })
})

document.getElementById('add-line').addEventListener('click', () => {
    let object = null;
    document.getElementById('map').addEventListener('click', function fn(e) {
        if (object == null) objects[addLine([])];
        object.linkedPoints.push(points.add({
            x: e.clientX - elLeft - elCenterX + centerX, 
            y: e.clientY - elTop - elCenterY + centerY,
        }));
        draw(object);
        e.currentTarget.removeEventListener('click', fn);
    })
})

document.getElementById('add-area').addEventListener('click', () => {
    document.getElementById('map').addEventListener('click', function fn(e) {
        if (object == null) objects[addLine([])];
        object.linkedPoints.push(points.add({
            x: e.clientX - elLeft - elCenterX + centerX, 
            y: e.clientY - elTop - elCenterY + centerY,
        }));
        draw(object);
        e.currentTarget.removeEventListener('click', fn);
    })
})