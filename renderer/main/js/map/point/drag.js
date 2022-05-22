import { mapEl, zoomLevel } from '../map.js';
import { points } from './point.js';
import { objects } from '../object/object.js';
import { draw as drawObject } from '../object/draw.js';

export let isDraggingPoint = false;

export function addDragEvent(hash) {
  let el = document.getElementsByClassName("point-" + hash)[0];
  el?.addEventListener('mousedown', e => {
    if (e.button != 0) return;
    
    dragEvent(hash, e)
  })
}

export function dragEvent(hash, e, pointObj = e.currentTarget) {
  let point = points[hash];

  if (!(isDraggingPoint)) {
    isDraggingPoint = true;
    
    let x;
    let y;
    let startX = point.x;
    let startY = point.y;
    let startMouseX = e.clientX;
    let startMouseY = e.clientY;
    let startElX = parseInt(pointObj.getAttribute('cx'));
    let startElY = parseInt(pointObj.getAttribute('cy'));

    mapEl.addEventListener('mousemove', moveFn);
    function moveFn(e) {
      let movingDistanceX = (e.clientX - startMouseX) * 2 ** -zoomLevel;
      let movingDistanceY = (e.clientY - startMouseY) * 2 ** -zoomLevel;

      x = startX + Math.floor(movingDistanceX);
      y = startY + Math.floor(movingDistanceY);

      let el = document.getElementsByClassName('point-' + hash)[0]
      el.setAttribute('cx', startElX + Math.floor(movingDistanceX) + 'px');
      el.setAttribute('cy', startElY + Math.floor(movingDistanceY) + 'px');
      point.x = x;
      point.y = y;
      for (let objectHash of point.linkedObjects) {
        let object = objects[objectHash];
        drawObject(object, false, [hash]);
      }
    }

    mapEl.addEventListener('mouseup', function fn() {
      mapEl.removeEventListener('mousemove', moveFn);
      mapEl.removeEventListener('mouseup', fn);
      isDraggingPoint = false;

      for (let objectHash of point.linkedObjects) {
        let object = objects[objectHash];
        objects.update(objectHash);
        drawObject(object);
      }
    })
  }
}
