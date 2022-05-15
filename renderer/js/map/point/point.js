import { draw as drawObject } from "../object/draw.js";
import { objects } from "../object/object.js";

export let points = {};

export function init() {
  initPoints();
}

export function initPoints() {
  points.add = value => {
    let hash = api.getHash()
    points[hash] = value;
    return hash;
  }

  points.delete = hash => {
    for (let item of points[hash].linkedObjects) {
      let obj = objects[item];
      obj.linkedPoints.splice(obj.linkedPoints.indexOf(hash), 1);

      //中継点の数がポイントの場合0個、ラインの場合1個以下、エリアの場合2個以下のときオブジェクトを削除
      if (obj.type == 'point' && obj.linkedPoints.length == 0) objects.delete(item);
      else if (obj.type == 'line' && obj.linkedPoints.length <= 1) objects.delete(item);
      else if (obj.type == 'area' && obj.linkedPoints.length <= 2) objects.delete(item);
      else {
        objects.update(item);
        drawObject(obj);
      }
    }

    Array.from(document.getElementsByClassName('point-' + hash)).forEach(item => item.remove());
    delete points[hash];
  }
}

export function setPoints(data) {
  points = data;
  initPoints();
}
