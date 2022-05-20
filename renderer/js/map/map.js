import { init as initDrag } from './drag.js';
import { init as initBackground, moveTo, setZoom } from './background/background.js';
import { init as initTile, tiles, draw as drawTile, drawTileBorder, tileSize } from './tile.js';
import { init as initObject } from './object/object.js';
import { init as initZoom } from './zoom.js';
import { init as initPoint } from './point/point.js';

export const mapEl = document.getElementById('map');
export const elCenterX = mapEl.clientWidth / 2;
export const elCenterY = mapEl.clientHeight / 2;
export const elWidth = mapEl.clientWidth;
export const elHeight = mapEl.clientHeight;
export const elTop = mapEl.getBoundingClientRect().top;
export const elLeft = mapEl.getBoundingClientRect().left;
export let centerX = 0;
export let centerY = 0;
export let zoomLevel = 0;

export function init() {
  initDrag();
  initBackground();
  initTile();
  initObject();
  initZoom();
  initPoint();
}

export let setCenterX = val => centerX = val;
export let setCenterY = val => centerY = val;
export let setZoomLevel = val => {
  if (val > 4) zoomLevel = 4;
  else if (val < -14) zoomLevel = -14;
  else zoomLevel = val;

  if (zoomLevel < -6) {
    document.getElementById('add-point').classList.add('disabled');
    document.getElementById('add-line').classList.add('disabled');
    document.getElementById('add-area').classList.add('disabled');
  } else {
    document.getElementById('add-point').classList.remove('disabled');
    document.getElementById('add-line').classList.remove('disabled');
    document.getElementById('add-area').classList.remove('disabled');
  }
}

export function draw() {
  document.querySelectorAll('.object').forEach(item => item.remove());
  document.querySelectorAll('.point').forEach(item => item.remove());

  if (zoomLevel >= -6) {
    let tileX = Math.floor(centerX / tileSize);
    let tileY = Math.floor(centerY / tileSize);
    const horizontalCount = elWidth / (tileSize * 2 ** zoomLevel) + 1;
    const verticalCount = elHeight / (tileSize * 2 ** zoomLevel) + 1;

    let drew = [];
    for (let i = tileX - Math.ceil(horizontalCount / 2); i <= tileX + Math.ceil(horizontalCount / 2); i++) {
      for (let j = tileY - Math.ceil(verticalCount / 2); j <= tileY + Math.ceil(verticalCount / 2); j++) {
        drew = drawTile(tiles.get(i, j), drew);
      }
    }
  }

  moveTo(centerX, centerY);
  setZoom(zoomLevel)
}

export function isOffScreen(x, y, distance) {
  let isXOffScreen = Math.abs((x - centerX) * 2 ** zoomLevel) - distance > elCenterX;
  let isYOffScreen = Math.abs((y - centerY) * 2 ** zoomLevel) - distance > elCenterY;
  return isXOffScreen || isYOffScreen;
}

export function createSVGElement(name, attrs) {
  let el = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (let attr in attrs) {
    el.setAttribute(attr, attrs[attr]);
  }
  return el;
}

export function addSVGElement(name, attrs, index) {
  attrs.index = index;
  for (let el of mapEl.children) {
    if (el.getAttribute('index') >= index) return mapEl.insertBefore(createSVGElement(name, attrs), el);
  }
  return mapEl.appendChild(createSVGElement(name, attrs));
}
