import { tiles } from "../tile.js";

import { init as initAddObject } from './add_object.js';

export * from "./add_object.js";
export * from "./draw.js";

export let points = {};
export let objects = {};

export function getHash(object) {
    return Object.keys(objects).reduce((r, key) => { 
        return objects[key] === object ? key : r 
    }, '');
}

export function init() {
    initAddObject();

    points.add = value => {
        let hash = api.getHash()
        points[hash] = value;
        return hash;
    }

    objects.add = value => {
        let hash = api.getHash();
        objects[hash] = value;
        //pointsのlinkedObjctsに追加
        for (let item of value?.linkedPoints ?? []) {
            let list = points[item]?.['linkedObjects'] ?? [];
            list.push(hash)
            points[item]['linkedObjects'] = list;
        }
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
        tiles.addPoint(objectHash, pointHash);
    }
}
