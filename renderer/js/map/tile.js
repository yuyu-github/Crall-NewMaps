import { points, objects, draw as drawObject } from './object/object.js';

export let tiles = [];

export function init() {
    tiles.addObject = hash => {
        let addedTiles = [];
        for (let item of objects[hash]?.linkedPoints ?? []) {
            let point = points[item];
            let x = Math.floor((point?.x ?? 0) / 100) + 1000000000000;
            let y = Math.floor((point?.y ?? 0) / 100) + 1000000000000;
            if (!addedTiles.includes([x, y].join(','))) {
                if (tiles[x] == undefined) tiles[x] = [];
                if (tiles[x][y] == undefined) tiles[x][y] = [];
                tiles[x][y].push(hash);
                addedTiles.push([x, y].join(','));
            }
        }
    }

    tiles.addPoint = (objectHash, pointHash) => {
        let point = points[pointHash];
        let x = Math.floor((point?.x ?? 0) / 100) + 1000000000000;
        let y = Math.floor((point?.y ?? 0) / 100) + 1000000000000;
        if (tiles[x] == undefined) tiles[x] = [];
        if (tiles[x][y] == undefined) tiles[x][y] = [];
        
        if (!tiles[x][y].includes(objectHash)) tiles[x][y].push(objectHash);
    }

    tiles.get = (x, y) => {
        return tiles[x + 1000000000000]?.[y + 1000000000000] ?? [];
    }
}

export function draw(tile, drew) {
    for (let hash of tile ?? []) {
        if (!drew?.includes(hash)) {
            drawObject(objects[hash]);
            drew.push(hash);
        }
    }
    return drew;
}
