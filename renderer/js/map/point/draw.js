import { centerX, centerY, elCenterX, elCenterY, addSVGElement, zoomLevel } from '../map.js'
import { points } from './point.js';
import { addDragEvent } from './drag.js';

export const pointR = 5.5;
export const bigPointR = 8;

export function draw(hash, big = false, transparent = false) {
  if (hash != '') Array.from(document.getElementsByClassName('point-' + hash)).forEach(item => item.remove());
  let className = 'point ' + (hash == '' ? '' : 'point-' + hash);
  let point = points[hash];
  
  if (point?.x == null || point?.y == null) return;

  let el = addSVGElement('circle', {
    'class': className,
    'cx': elCenterX + (point.x - centerX) * 2 ** zoomLevel + 'px',
    'cy': elCenterY + (point.y - centerY) * 2 ** zoomLevel + 'px',
    'r': big ? bigPointR + 'px' : pointR + 'px',
    'stroke': 'black',
    'stroke-width': '0.5px',
    'fill': 'lightgray',
    'cursor': 'pointer',
    'opacity': transparent ? '0' : '1'
  }, 20003)

  addDragEvent(hash);

  return el;
}
