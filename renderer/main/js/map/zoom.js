import { mapEl, zoomLevel, setZoomLevel, draw } from "./map.js";

export function init() {
  mapEl.addEventListener('wheel', e => {
    setZoomLevel(zoomLevel - e.deltaY / 100);
    draw();
  })
}
