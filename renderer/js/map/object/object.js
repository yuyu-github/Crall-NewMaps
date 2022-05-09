import { init as initAddObject } from './add_object.js';
import { tiles } from '../tile.js';
import { points } from '../point/point.js';
import { borders } from './border/border.js';

export let objects = {};

export function getHash(object) {
  return Object.keys(objects).reduce((r, key) => { 
    return objects[key] === object ? key : r 
  }, '');
}

export function init() {
  initAddObject();

  objects.add = value => {
    let hash = api.getHash();
    objects[hash] = value;
    //pointsのlinkedObjctsに追加
    for (let item of value?.linkedPoints ?? []) {
      let list = points[item]?.['linkedObjects'] ?? [];
      list.push(hash)
      points[item]['linkedObjects'] = list;
    }
    //タイルに追加
    tiles.addObject(hash);
    return hash;
  }

  objects.addPoint = (objectHash, pointHash, pos = null) => {
    objects[objectHash].linkedPoints ??= [];
    let index = objects[objectHash].linkedPoints.indexOf(pos)
    objects[objectHash].linkedPoints.splice(index == -1 ? objects[objectHash].linkedPoints.length : index + 1, 0, pointHash) //nullなら末尾に追加

    //pointsのlinkedObjctsに追加
    let list = points[pointHash]?.['linkedObjects'] ?? [];
    list.push(objectHash);
    points[pointHash]['linkedObjects'] = list;

    tiles.addObject(objectHash, pointHash);

    if (objects[objectHash].linkedPoints.length > 1) {
      Array.from(document.getElementsByClassName('object-' + objectHash + '-border')).forEach(item => item.remove());
      objects[objectHash].linkedPoints.forEach((item, i) => {
        if (objects[objectHash].linkedPoints.length - 1 > i) {
          borders.add({
            point1: item,
            point2: objects[objectHash].linkedPoints[i + 1],
            object: objectHash,
          });
        }
      });
      if (objects[objectHash].type == 'area' && objects[objectHash].closed) {
        borders.add({
          point1: objects[objectHash].linkedPoints.slice(-1)[0],
          point2: objects[objectHash].linkedPoints[0],
          object: objectHash,
        })
      }
    }
  }

  objects.update = (hash) => {
    tiles.addObject(hash);
  }

  objects.delete = hash => {
    (object[hash]?.borders ?? []).forEach(item => delete borders[item]);
    Array.from(document.getElementsByClassName('object-' + hash + '-border')).forEach(item => item.remove());

    for (let item of objects[hash]?.linkedPoints ?? []) {
      if (points[item].linkedObjects.length == 1) delete points[item];
      else points[item].linkedObjects.splice(points[item].linkedObjects.indexOf(hash), 1);
    }
    for (let item of objects[hash]?.linkedTiles ?? []) {
      if (tiles[item[0]][item[1]].length == 1) delete tiles[item[0]][item[1]];
      else tiles[item[0]][item[1]].splice(tiles[item[0]][item[1]].indexOf(hash), 1)
    }
    delete objects[hash];
    Array.from(document.getElementsByClassName('object-' + hash)).forEach(item => item.remove());
  }
}
