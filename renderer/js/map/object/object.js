import { init as initAddObject } from './add_object.js';
import { tiles } from '../tile.js';
import { points } from '../point/point.js';

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

  objects.addPoint = (objectHash, pointHash) => {
    objects[objectHash].linkedPoints ??= [];
    objects[objectHash].linkedPoints.push(pointHash);
    //pointsのlinkedObjctsに追加
    let list = points[pointHash]?.['linkedObjects'] ?? [];
    list.push(objectHash);
    points[pointHash]['linkedObjects'] = list;
    tiles.addObject(objectHash, pointHash);
  }

  objects.update = (hash) => {
    tiles.addObject(hash);
  }

  objects.delete = hash => {
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
