import { mapEl, zoomLevel } from '../map.js';
import { points } from './point.js';
import { objects } from '../object/object.js';
import { draw as drawObject } from '../object/draw.js';

export let isDragging = false;

export function addDragEvent(hash) {
  let el = document.getElementsByClassName("point-" + hash)[0];
  let point = points[hash];
  el?.addEventListener('mousedown', e => {
    if (!isDragging) {
      let x;
      let y;
      let startX = point.x;
      let startY = point.y;
      let startMouseX = e.clientX;
      let startMouseY = e.clientY;
      let startElX = parseInt(e.currentTarget.getAttribute('cx'));
      let startElY = parseInt(e.currentTarget.getAttribute('cy'));
      isDragging = true;

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
        for (let hash of point.linkedObjects) {
          let object = objects[hash];
          objects.update(hash);
          if (!object.isPreview) drawObject(object);
        }
      }

      mapEl.addEventListener('mouseup', function fn() {
        mapEl.removeEventListener('mousemove', moveFn);
        mapEl.removeEventListener('mouseup', fn);  
        isDragging = false;
      })
    }
  })
}
