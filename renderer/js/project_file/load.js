import { elementsToErase } from "./elements_to_erase.js";
import { setBackground } from "../map/background/background.js";
import { setTiles, tiles } from "../map/tile.js";
import { objects, setObjects } from "../map/object/object.js";
import { points, setPoints } from "../map/point/point.js";
import { setBorders } from "../map/object/border/border.js";
import { draw } from "../map/map.js";

export function init() {
  api.onLoad(load);
  api.onLoadResult((e, data) => loadData(data.format, data.data));
}

export function load() {
  api.load(); 
}

export function loadData(format, data) {
  setBackground(data.background);

  setTiles([]);
  setBorders([]);

  //軽量化した部分を復元
  let orgPoints = data.points;
  let orgObjects = data.objects;

  for (let item in orgPoints) {
    for (let el in elementsToErase.point) {
      orgPoints[item][el] = JSON.parse(JSON.stringify(elementsToErase.point[el])) //ディープコピー;
    }
  }

  for (let item in orgObjects) {
    for (let el in elementsToErase.object) {
      orgObjects[item][el] = JSON.parse(JSON.stringify(elementsToErase.object[el]));
    }

    for (let hash of orgObjects[item].linkedPoints) {
      orgPoints[hash].linkedObjects.push(item);
    }
  }

  setPoints(JSON.parse(JSON.stringify(orgPoints)));
  setObjects(JSON.parse(JSON.stringify(orgObjects)));

  for (let item in orgObjects) objects.update(item);

  draw();
}
