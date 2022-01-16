import { centerX, centerY, elCenterX, elCenterY, mapEl, addSVGElement } from '../map.js'
import { mode } from '../mode.js'
import { getHash, objects, points } from './object.js';

export function draw(object) {
    let hash = getHash(object);
    if (hash != '') Array.from(document.getElementsByClassName('object-' + hash)).forEach(item => item.remove());
    let className = hash == '' ? '' : 'object-' + hash;
    switch (object.type) {
        case 'point': {
            let point = points[object.linkedPoints[0]];
            return addSVGElement('circle', {
                'class': className,
                'cx': elCenterX + point.x - centerX + 'px',
                'cy': elCenterY + point.y - centerY + 'px',
                'r': '8px',
                'stroke': 'red',
                'stroke-width': '1.5px',
                'fill': 'red',
                'fill-opacity': '0.3',
            }, 4);
        }
        case 'line': {
            let returnValue = [[], []];
            let previousPoint = null;
            for (let hash of object.linkedPoints) {
                let point = points[hash];
                returnValue[1].push(addSVGElement('circle', {
                    'class': className,
                    'cx': elCenterX + point.x - centerX + 'px',
                    'cy': elCenterY + point.y - centerY + 'px',
                    'r': '4px',
                    'stroke': 'black',
                    'stroke-width': '0.5px',
                    'fill': 'lightgray',
                }, 3));
                if (previousPoint != null) {
                    returnValue[0].push(addSVGElement('line', {
                        'class': className,
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
        case 'area': {
            let returnValue = [[], []];
            let pathD = 'M';
            let previousPoint = null;
            for (let hash of object.linkedPoints) {
                let point = points[hash];
                returnValue[1].push(addSVGElement('circle', {
                    'class': className,
                    'cx': elCenterX + point.x - centerX + 'px',
                    'cy': elCenterY + point.y - centerY + 'px',
                    'r': '4px',
                    'stroke': 'black',
                    'stroke-width': '0.5px',
                    'fill': 'lightgray',
                }, 2));
                if (object.closed) pathD += ` ${elCenterX + point.x - centerX},${elCenterY + point.y - centerY}`;
                else {
                    if (previousPoint != null) {
                        returnValue[0].push(addSVGElement('line', {
                            'class': className,
                            'x1': elCenterX + previousPoint.x - centerX + 'px',
                            'y1': elCenterY + previousPoint.y - centerY + 'px',
                            'x2': elCenterX + point.x - centerX + 'px',
                            'y2': elCenterY + point.y - centerY + 'px',
                            'stroke': 'lime',
                            'stroke-width': '4px',
                        }, 1));
                    }
                    previousPoint = point;
                }
            }
            if (object.closed) {
                pathD += ' z';
                returnValue[0] = addSVGElement('path', {
                    'class': className,
                    'd': pathD,
                    'stroke': 'lime',
                    'stroke-width': '4px',
                    'fill': 'lime',
                    'fill-opacity': '0.3',
                }, 0)
            }
            return returnValue;
        }
    }
}