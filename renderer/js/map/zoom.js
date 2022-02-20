import { mapEl, zoomLevel, setZoomLevel } from "./map.js";

export function init() {
  mapEl.addEventListener('wheel', e => {
    setZoomLevel(zoomLevel - e.deltaY / 100);
    console.log(zoomLevel);
  })
}
