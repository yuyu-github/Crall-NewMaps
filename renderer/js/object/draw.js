import { centerX, centerY, elCenterX, elCenterY, mapEl, createSVGElement } from '../map.js'
import { mode } from '../mode.js'
import { points } from './object.js';

export function draw(object) {
    switch (object.type) {
        case 'point':
            let point = points[object.linkedPoints[0]];
            mapEl.appendChild(createSVGElement('circle', {
                'cx': elCenterX + point.x - centerX + 'px',
                'cy': elCenterY + point.y - centerY + 'px',
                'r': '8px',
                'stroke': 'red',
                'stroke-width': '1.5px',
                'fill': 'red',
                'fill-opacity': '0.3',
            }));
            break;
    }
}