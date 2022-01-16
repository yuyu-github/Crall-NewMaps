import { centerX, centerY, elCenterX, elCenterY, mapEl, addSVGElement } from '../map.js'
import { mode } from '../mode.js'
import { points } from './object.js';

export function draw(object) {
    switch (object.type) {
        case 'point':
            let point = points[object.linkedPoints[0]];
            return addSVGElement('circle', {
                'cx': elCenterX + point.x - centerX + 'px',
                'cy': elCenterY + point.y - centerY + 'px',
                'r': '8px',
                'stroke': 'red',
                'stroke-width': '1.5px',
                'fill': 'red',
                'fill-opacity': '0.3',
            }, 4);
        case 'line':
            let returnValue = [[], []];
            let previousPoint = null;
            for (let hash of object.linkedPoints) {
                let point = points[hash];
                returnValue[1].push(addSVGElement('circle', {
                    'cx': elCenterX + point.x - centerX + 'px',
                    'cy': elCenterY + point.y - centerY + 'px',
                    'r': '4px',
                    'stroke': 'black',
                    'stroke-width': '0.5px',
                    'fill': 'lightgray',
                }, 3));
                if (previousPoint != null) {
                    returnValue[0].push(addSVGElement('line', {
                        'x1': elCenterX + previousPoint.x - centerX + 'px',
                        'y1': elCenterY + previousPoint.y - centerY + 'px',
                        'x2': elCenterX + point.x - centerX + 'px',
                        'y2': elCenterY + point.y - centerY + 'px',
                        'stroke': 'blue',
                        'stroke-width': '4px',
                    }, 1));
                }
                previousPoint = point;
            }
            return returnValue;
    }
}