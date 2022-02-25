import { elCenterX, elCenterY, centerX, centerY, addSVGElement, zoomLevel, elHeight, elWidth } from './map.js';
import { points, objects } from './object/object.js';
import { draw as drawObject } from './object/draw.js';

export let tiles = [];
export const tileSize = 1000;

export function init() {
  tiles.addObject = hash => {
    let object = objects[hash];
    let type = object.type;

    //pointの座標を記録
    let pointPos = [];
    for (let item of object?.linkedPoints ?? []) {
      let point = points[item];
      let x = Math.floor((point?.x ?? 0) / tileSize);
      let y = Math.floor((point?.y ?? 0) / tileSize);

      addObjectTo(x, y, hash);
      pointPos.push({ x: point?.x, y: point?.y });
    }

    if (type == 'line' || type == 'area') {
      //一つの直線ごとに実行
      for (let i = 0; i < pointPos.length - 1; i++) {
        let startPointPos = pointPos[i];
        let endPointPos = pointPos[i + 1];

        let length = {
          x: endPointPos.x - startPointPos.x,
          y: endPointPos.y - startPointPos.y
        };

        let longer = Math.abs(length.x) > Math.abs(length.y) ? 'x' : 'y';
        let shorter = Math.abs(length.x) < Math.abs(length.y) ? 'x' : 'y';

        //longerに対するshorterの移動量の割合
        let movingRate = Math.abs(length[shorter] / length[longer]);
        if (Number.isNaN(movingRate)) movingRate = 1;

        //最も近いタイルの境界を通る地点を求める
        let remainder = Math.abs(startPointPos[longer]) % tileSize;
        let rangeToTile = ((length[longer] >= 0 ^ startPointPos[longer] <= 0 ? tileSize : 0
          /*正の方向へ動いている場合左端、負の方向の場合は右端までの距離*/) - remainder) *
          (startPointPos[longer] >= 0 ? 1 : -1 /*始点が負の位置の場合、マイナスにする*/);
        let startPosOnTileBorder = {}; //最も近いタイルの境界上にある点
        startPosOnTileBorder[longer] = startPointPos[longer] + rangeToTile;
        startPosOnTileBorder[shorter] = startPointPos[shorter] + rangeToTile * movingRate;

        let previousPos;
        for (let pos = startPosOnTileBorder; length[longer] >= 0 ^ pos[longer] > endPointPos[longer];) {
          previousPos = { ...pos };
          pos[longer] += (length[longer] >= 0 ? tileSize : -tileSize);
          pos[shorter] += (length[shorter] >= 0 ? tileSize : -tileSize) * movingRate;
          
          let negativeBorder = (length[longer] >= 0 ? pos[longer] - tileSize : pos[longer]) //負の方向のタイル境界の座標
          let tilePos = {};
          tilePos[longer] = Math.floor(negativeBorder / tileSize);
          tilePos[shorter] = Math.floor(pos[shorter] / tileSize);

          addObjectTo(tilePos.x, tilePos.y, hash);
          if (Math.floor(previousPos[shorter] / tileSize) != tilePos[shorter] /*shorterが違った場合、隣のタイルにも追加*/) {
            addObjectTo(tilePos.x, tilePos.y + (length[shorter] < 0 ? 1 : -1), hash);
            addObjectTo(tilePos.x, tilePos.y + (length[longer] < 0 ? 1 : -1), hash);
          }
        }
      }
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

  for (let i = -Math.floor(horizontalCount / 2); i <= Math.floor(horizontalCount / 2); i++) {
    addSVGElement('line', {
      'class': 'tileborder',
      'x1': elCenterX + ((Math.floor(centerX / tileSize) + i) * tileSize - centerX) * 2 ** zoomLevel + 'px',
      'y1': '0px',
      'x2': elCenterX + ((Math.floor(centerX / tileSize) + i) * tileSize - centerX) * 2 ** zoomLevel + 'px',
      'y2': '100%',
      'stroke': 'black',
      'stroke-width': '1px',
    }, 30001)
  }
  for (let i = -Math.floor(verticalCount / 2); i <= Math.floor(verticalCount) / 2; i++) {
    addSVGElement('line', {
      'class': 'tileborder',
      'x1': '0px',
      'y1': elCenterY + ((Math.floor(centerY / tileSize) + i) * tileSize - centerY) * 2 ** zoomLevel + 'px',
      'x2': '100%',
      'y2': elCenterY + ((Math.floor(centerY / tileSize) + i) * tileSize - centerY) * 2 ** zoomLevel + 'px',
      'stroke': 'black',
      'stroke-width': '1px',
    }, 30001)
  }
}
