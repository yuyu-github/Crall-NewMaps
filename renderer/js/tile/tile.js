import { points, objects, draw as drawObject } from '../object/object.js';

export let tiles = [];

tiles.add = hash => {
    let addedTiles = [];
    for (let item of objects[hash]?.usePoints ?? []) {
        let point = points[item];
        let x = Math.floor((point?.x ?? 0) / 100) + 2147483648;
        let y = Math.floor((point?.y ?? 0) / 100) + 2147483648;
        if (!addedTiles.includes([x, y].join(','))) {
            if (tiles[x] == undefined) tiles[x] = [];
            if (tiles[x][y] == undefined) tiles[x][y] = [];
            tiles[x][y].push(hash);
            addedTiles.push([x, y].join(','));
        }
    }
}

tiles.get = (x, y) => {
    return tiles[x + 2147483648]?.[y + 2147483648] ?? [];
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