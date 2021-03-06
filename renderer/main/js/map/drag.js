import { centerX, centerY, elLeft, elTop, mapEl, setCenterX, setCenterY, draw, zoomLevel } from "./map.js";
import { isDraggingPoint } from "./point/drag.js";

export let isDraggingMap = false;

export function init() {
  mapEl.addEventListener('mousedown', e => {
    if (e.button != 0) return;
    if (e.target.classList.contains('point')) return;
    if (isDraggingPoint) return;

    isDraggingMap = true;

    const dragStartPosX = e.clientX - elLeft;
    const dragStartPosY = e.clientY - elTop;
    const startPosX = centerX;
    const startPosY = centerY;


    mapEl.addEventListener('mousemove', moveFn);
    function moveFn(e) {
      setCenterX(startPosX - (e.clientX - elLeft - dragStartPosX) * 2 ** -zoomLevel /*zoomLevelによって移動量を変化*/);
      setCenterY(startPosY - (e.clientY - elTop - dragStartPosY) * 2 ** -zoomLevel);
      draw();
    }

    mapEl.addEventListener('mouseup', end)
    mapEl.addEventListener('mouseleave', end);
    function end() {
      mapEl.removeEventListener('mouseup', end);
      mapEl.removeEventListener('mouseleave', end);
      mapEl.removeEventListener('mousemove', moveFn);

      isDraggingMap = false;
      draw();
    }
  })
}
