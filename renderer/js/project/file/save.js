import { background } from "../../map/background/background.js";
import { objects } from "../../map/object/object.js";
import { points } from "../../map/point/point.js";
import { path } from "../project.js";
import { elementsToErase } from "./elements_to_erase.js";

export const format = 1;

export function init() {
  api.onSave(save);
}

export function save(overwrite = false) {
  //軽量化
  let lightweightObjects = JSON.parse(JSON.stringify(objects)); //ディープコピー
  let lightweightPoints = JSON.parse(JSON.stringify(points));
  //objectsの軽量化
  for (let item in lightweightObjects) {
    //オブジェクト以外だった場合削除
    if (toString.call(lightweightObjects[item]) != '[object Object]') {
      delete lightweightObjects[item];
      continue;
    }

    //不要な要素を削除
    for (let el in lightweightObjects[item]) {
      if (el in elementsToErase.object) {
        delete lightweightObjects[item][el];
        continue;
      }
    }
  }
  //pointsの軽量化
  for (let item in lightweightPoints) {
    //オブジェクト以外だった場合削除
    if (toString.call(lightweightPoints[item]) != '[object Object]') {
      delete lightweightPoints[item];
      continue;
    }

    for (let el in lightweightPoints[item]) {
      if (el in elementsToErase.point) {
        delete lightweightPoints[item][el];
        continue;
      }
    }
  }

  let data = {
    'background': background,
    'objects': lightweightObjects,
    'points': lightweightPoints,
  }

  api.save(format, data, overwrite ? path : '');
}
