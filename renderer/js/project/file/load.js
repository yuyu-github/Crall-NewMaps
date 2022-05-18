import { elementsToErase } from "./elements_to_erase.js";
import { setBackground } from "../../map/background/background.js";
import { setTiles, tiles } from "../../map/tile.js";
import { objects, setObjects } from "../../map/object/object.js";
import { points, setPoints } from "../../map/point/point.js";
import { setBorders } from "../../map/object/border/border.js";
import { draw, mapEl } from "../../map/map.js";
import { path, saved, setPath, setSaved } from "../project.js";
import { format, save } from "./save.js";

export function init() {
  api.onLoad(load);
  api.onLoadResult((e, data) => loadData(data.format, data.data, data.path));
  api.onConfirmSave(async e => e.sender.send('confirmSaveResult', await confirmSave()));

  api.onCreateNew(() => loadData(format, {
    background: '',
    objects: {},
    points: {},
  }, '', true))
}

export async function load() {
  if (!(await confirmSave())) return;
  api.load(); 
}

export async function loadData(format, data, path, isConfirmSave = false) {
  if (isConfirmSave && !(await confirmSave())) return;

  mapEl.innerHTML = '';

  setTiles([]);
  setBorders([]);

  setBackground(data.background);

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

    //formatが1の場合typeをformに変更
    if (format == 1) {
      orgObjects[item].form = orgObjects[item].type;
      delete orgObjects[item].type;
    }
  }

  setPoints(JSON.parse(JSON.stringify(orgPoints)));
  setObjects(JSON.parse(JSON.stringify(orgObjects)));

  for (let item in orgObjects) objects.update(item);

  draw();

  setPath(path);
  setSaved(true);
}

export async function confirmSave() {
  if (!saved) {
    let result = await api.showMessageBox({
      type: 'warning',
      title: '保存されていません',
      message: (await api.getTitle()).replace(/\*? - Crall NewMaps$/, '') + 'は保存されていません',
      buttons: ['保存', '保存しない', 'キャンセル'],
      cancelId: 2,
    })

    if (result.response == 0) save(path);

    return (result.response != 2); //キャンセルされたかどうか
  }
  else return true;
}
