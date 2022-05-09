import { borders } from "./border.js";
import { objects } from "../object.js";
import { points } from "../../point/point.js";
import { elLeft, elTop, elCenterX, elCenterY, zoomLevel, centerX, centerY } from "../../map.js";
import { dragEvent, isDraggingPoint } from "../../point/drag.js";
import { draw } from "../draw.js";

export function addDragEvent(hash) {
  let el = document.getElementsByClassName("border-" + hash)[0];
  let obj = borders[hash];

  el.addEventListener('mousedown', e => {
    if (!(isDraggingPoint)) {
      let pointHash = points.add({
        x: (e.clientX - elLeft - elCenterX) * 2 ** -zoomLevel + centerX,
        y: (e.clientY - elTop - elCenterY) * 2 ** -zoomLevel + centerY,
      })
      objects.addPoint(obj.object, pointHash, obj.point1);
      draw(objects[obj.object]);
      dragEvent(pointHash, e, document.getElementsByClassName("point-" + pointHash)[0]);
    }
  })
}
