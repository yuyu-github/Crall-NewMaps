import { borders } from "./border.js";
import { addSVGElement, elCenterX, elCenterY, centerX, centerY, zoomLevel } from "../../map.js";
import { points } from "../../point/point.js";
import { addDragEvent } from "./drag.js";

export const borderWidth = 6

export function draw(hash) {
  let obj = borders[hash];
  if (hash != '') Array.from(document.getElementsByClassName('border-' + hash)).forEach(item => item.remove());
  let className = `object-${obj.object}-border border ${hash == '' ? '' : 'border-' + hash}`;
  
  let el = addSVGElement('line', {
    'class': className,
    'x1': elCenterX + (points[obj.point1].x - centerX) * 2 ** zoomLevel + 'px',
    'y1': elCenterY + (points[obj.point1].y - centerY) * 2 ** zoomLevel + 'px',
    'x2': elCenterX + (points[obj.point2].x - centerX) * 2 ** zoomLevel + 'px',
    'y2': elCenterY + (points[obj.point2].y - centerY) * 2 ** zoomLevel + 'px',
    'stroke': 'black',
    'stroke-width': borderWidth + 'px',
    'opacity': '0',
  }, 20003)

  addDragEvent(hash);

  return el;
}
