import { draw as drawObject } from "../object/draw.js";
import { objects } from "../object/object.js";

export let points = {};

export function init() {
  points.add = value => {
    let hash = api.getHash()
    points[hash] = value;
    return hash;
  }

  points.delete = hash => {
    for (let item of points[hash].linkedObjects) {
      let obj = objects[item];
      obj.linkedPoints.splice(obj.linkedPoints.indexOf(hash), 1);

      objects.update(item);
      drawObject(obj);
    }

    Array.from(document.getElementsByClassName('point-' + hash)).forEach(item => item.remove());
    delete points[hash];
  }
}
