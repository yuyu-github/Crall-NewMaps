import { elCenterX, elCenterY, centerX, centerY, addSVGElement, zoomLevel, elHeight, elWidth } from './map.js';
import { points, objects } from './object/object.js';
import { draw as drawObject } from './object/draw.js';

export let tiles = [];
export const tileSize = 1000;

export function init() {
  tiles.addObject = hash => {
    for (let item of objects[hash]?.linkedPoints ?? []) {
      let point = points[item];
      let x = Math.floor((point?.x ?? 0) / tileSize);
      let y = Math.floor((point?.y ?? 0) / tileSize);

      addObjectTo(x, y, hash);
    }
  }

  tiles.get = (x, y) => {
    let tileX = x + 1000000000000;
    let tileY = y + 1000000000000;

    if (tiles[tileX] == undefined) tiles[tileX] = [];
    if (tiles[tileX][tileY] == undefined) tiles[tileX][tileY] = [];
    return tiles[tileX][tileY];
  }
}

export function addObjectTo(x, y, hash) {
  let tile = tiles.get(x, y);
  if (!tile.includes(hash)) {
    tile.push(hash);
    objects[hash].linkedTiles ??= [];
    objects[hash].linkedTiles.push([x, y]);
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

  const horizontalCount = elWidth / (tileSize * 2 ** zoomLevel) + 1;
  const verticalCount = elHeight / (tileSize * 2 ** zoomLevel) + 1;
  let displayTileSize = tileSize * 2 ** zoomLevel

  for (let i = -Math.floor(horizontalCount / 2); i <= Math.floor(horizontalCount / 2); i++) {
    addSVGElement('line', {
      'class': 'tileborder',
      'x1': elCenterX + (Math.floor(centerX / displayTileSize) + i) * displayTileSize - centerX + 'px',
      'y1': '0px',
      'x2': elCenterX + (Math.floor(centerX / displayTileSize) + i) * displayTileSize - centerX + 'px',
      'y2': '100%',
      'stroke': 'black',
      'stroke-width': '1px',
    }, 1)
  }
  for (let i = -Math.floor(verticalCount / 2); i <= Math.floor(verticalCount) / 2; i++) {
    addSVGElement('line', {
      'class': 'tileborder',
      'x1': '0px',
      'y1': elCenterY + (Math.floor(centerY / displayTileSize) + i) * displayTileSize - centerY + 'px',
      'x2': '100%',
      'y2': elCenterY + (Math.floor(centerY / displayTileSize) + i) * displayTileSize - centerY + 'px',
      'stroke': 'black',
      'stroke-width': '1px',
    }, 1)
  }
}
