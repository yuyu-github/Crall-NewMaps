import { centerX, centerY, elLeft, elTop, mapEl, setCenterX, setCenterY, draw, zoomLevel } from "./map.js";

export function init() {
  mapEl.addEventListener('mousedown', e => {
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
    mapEl.addEventListener('mouseup', function fn() {
      mapEl.removeEventListener('mouseup', fn);
      mapEl.removeEventListener('mousemove', moveFn);
    })
  })
}
