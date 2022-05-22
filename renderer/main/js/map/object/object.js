import { init as initAddObject } from './add_object.js';
import { init as initBorder } from './border/border.js';
import { tiles } from '../tile.js';
import { points } from '../point/point.js';
import { borders } from './border/border.js';
import { setSaved } from '../../project/project.js';

export let objects = {};

export function getHash(object) {
  return Object.keys(objects).reduce((r, key) => { 
    return objects[key] === object ? key : r 
  }, '');
}

export function init() {
  initAddObject();
  initBorder();

  initObjects();
}

export function initObjects() {
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
  
    setSaved(false);

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

    objects.update(objectHash);
  }

  objects.update = (hash) => {
    tiles.addObject(hash);

    Array.from(document.getElementsByClassName('object-' + hash + '-border')).forEach(item => {
      for (let name of item.classList) {
        let matches = name.match(/border-([^\-]+)/);
        if (matches != null) {
          borders.delete(matches[1]);
          break;
        }
      }

      item.remove()
    });

    objects[hash].borders?.forEach(item => borders.delete(item))
    objects[hash].borders = [];

    objects[hash].linkedPoints.forEach((item, i) => {
      if (objects[hash].linkedPoints.length - 1 > i) {
        borders.add({
          point1: item,
          point2: objects[hash].linkedPoints[i + 1],
          object: hash,
        });
      }
    });
    if (objects[hash].form == 'area' && objects[hash].closed) {
      borders.add({
        point1: objects[hash].linkedPoints.slice(-1)[0],
        point2: objects[hash].linkedPoints[0],
        object: hash,
      })
    }

    setSaved(false);
  }

  objects.delete = hash => {
    (objects[hash]?.borders ?? []).forEach(item => delete borders[item]);
    Array.from(document.getElementsByClassName('object-' + hash + '-border')).forEach(item => item.remove());

    for (let item of objects[hash]?.linkedPoints ?? []) {
      if (points[item].linkedObjects.length == 1) points.delete(item, false);
      else points[item].linkedObjects.splice(points[item].linkedObjects.indexOf(hash), 1);
    }
    for (let item of objects[hash]?.linkedTiles ?? []) {
      if (tiles.get(item[0], item[1]).length == 1) tiles.delete(item[0], item[1]);
      else tiles.get(item[0], item[1]).splice(tiles.get(item[0], item[1]).indexOf(hash), 1)
    }
    delete objects[hash];
    Array.from(document.getElementsByClassName('object-' + hash)).forEach(item => item.remove());
  }
}

export function setObjects(data) {
  objects = data;
  initObjects();
}
