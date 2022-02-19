import { elCenterX, elCenterY, centerX, centerY, addSVGElement } from './map.js';
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

export function drawTileBorder() {
    document.querySelectorAll('.tileborder').forEach(item => item.remove());
    for (let i = -6; i <= 6; i++) {
        addSVGElement('line', {
            'class': 'tileborder',
            'x1': elCenterX + (Math.floor(centerX / 100) + i) * 100 - centerX + 'px',
            'y1': '0px',
            'x2': elCenterX + (Math.floor(centerX / 100) + i) * 100 - centerX + 'px',
            'y2': '100%',
            'stroke': 'black',
            'stroke-width': '1px',
        }, 1)
        addSVGElement('line', {
            'class': 'tileborder',
            'x1': elCenterX + (Math.ceil(centerX / 100) + i) * 100 - centerX + 'px',
            'y1': '0px',
            'x2': elCenterX + (Math.ceil(centerX / 100) + i) * 100 - centerX + 'px',
            'y2': '100%',
            'stroke': 'black',
            'stroke-width': '1px',
        }, 1)
        addSVGElement('line', {
            'class': 'tileborder',
            'x1': '0px',
            'y1': elCenterY + (Math.floor(centerY / 100) + i) * 100 - centerY + 'px',
            'x2': '100%',
            'y2': elCenterY + (Math.floor(centerY / 100) + i) * 100 - centerY + 'px',
            'stroke': 'black',
            'stroke-width': '1px',
        }, 1)
        addSVGElement('line', {
            'class': 'tileborder',
            'x1': '0px',
            'y1': elCenterY + (Math.ceil(centerY / 100) + i) * 100 - centerY + 'px',
            'x2': '100%',
            'y2': elCenterY + (Math.ceil(centerY / 100) + i) * 100 - centerY + 'px',
            'stroke': 'black',
            'stroke-width': '1px',
        }, 1)
    }
}
