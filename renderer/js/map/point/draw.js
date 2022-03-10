import { centerX, centerY, elCenterX, elCenterY, addSVGElement, zoomLevel } from '../map.js'
import { points } from './point.js';

export function draw(hash) {
  if (hash != '') Array.from(document.getElementsByClassName('point-' + hash)).forEach(item => item.remove());
  let className = 'point ' + (hash == '' ? '' : 'point-' + hash);
  
  let point = points[hash];
  return addSVGElement('circle', {
    'class': className,
    'cx': elCenterX + (point.x - centerX) * 2 ** zoomLevel + 'px',
    'cy': elCenterY + (point.y - centerY) * 2 ** zoomLevel + 'px',
    'r': '5px',
    'stroke': 'black',
    'stroke-width': '0.5px',
    'fill': 'lightgray',
  }, 20003)
}
