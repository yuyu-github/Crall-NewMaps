import { centerX, centerY, elCenterX, elCenterY, elLeft, elTop, mapEl, zoomLevel } from '../map.js';
import { draw } from './draw.js';
import { getHash, objects } from './object.js';
import { points } from '../point/point.js'
import { borders } from './border/border.js';

export let isediting = false;

export function init() {
  document.getElementById('add-point').addEventListener('click', () => setTimeout(() => {
    if (!isediting) {
      isediting = true;
      mapEl.style.cursor = 'crosshair';

      let hash = addPoint([]);
      let object = objects[hash];
      object.isPreview = true;

      function end() {
        document.body.removeEventListener('click', bodyClickFn);
        mapEl.removeEventListener('mouseenter', enterFn);
        mapEl.removeEventListener('mouseleave', leaveFn);
        mapEl.removeEventListener('click', fn);
        mapEl.removeEventListener('mousemove', moveFn);
        mapEl.style.cursor = 'default';
        isediting = false;
      }

      mapEl.addEventListener('mouseleave', leaveFn);
      function leaveFn() {
        mapEl.addEventListener('mouseenter', enterFn);
        document.body.addEventListener('click', bodyClickFn);
      }
      function bodyClickFn() {
        end();
        objects.delete(hash);
      }
      function enterFn() {
        document.body.addEventListener('click', bodyClickFn);
      }

      mapEl.addEventListener('click', fn);
      function fn(e) {
        end();
        objects.addPoint(hash, points.add({
          x: (e.clientX - elLeft - elCenterX) * 2 ** -zoomLevel + centerX,
          y: (e.clientY - elTop - elCenterY) * 2 ** -zoomLevel+ centerY,
        }));
        object.isPreview = false;
        draw(object);
      }

      function moveFn(e) {
        object.previewX = (e.clientX - elLeft - elCenterX) * 2 ** -zoomLevel + centerX;
        object.previewY = (e.clientY - elTop - elCenterY) * 2 ** -zoomLevel + centerY;
        draw(object, true);
      }
      mapEl.addEventListener('mousemove', moveFn)
    }
  }, 50))

  document.getElementById('add-line').addEventListener('click', () => setTimeout(() => {
    if (!isediting) {
      mapEl.style.cursor = 'crosshair';
      isediting = true;

      let hash = addLine([], false)
      let object = objects[hash];

      function end() {
        document.body.removeEventListener('click', bodyClickFn);
        mapEl.removeEventListener('mouseenter', enterFn);
        mapEl.removeEventListener('mouseleave', leaveFn);
        mapEl.removeEventListener('click', clickFn);
        document.getElementsByClassName('point-' + object.linkedPoints.slice(-1)[0])[0]?.removeEventListener('click', finish);
        mapEl.removeEventListener('mousemove', moveFn);
        object.isPreview = false;
        mapEl.style.cursor = 'default';
        isediting = false;
      }

      mapEl.addEventListener('mouseleave', leaveFn);
      function leaveFn() {
        mapEl.addEventListener('mouseenter', enterFn);
        document.body.addEventListener('click', bodyClickFn);
      }
      function bodyClickFn() {
        end();
        objects.delete(hash);
      }
      function enterFn() {
        document.body.addEventListener('click', bodyClickFn);
      }

      function update() {
        draw(object, true);
        if (object.linkedPoints.length >= 2) {
          document.getElementsByClassName('point-' + object.linkedPoints.slice(-2)[0])[0]?.removeEventListener('mouseup', finish);
          document.getElementsByClassName('point-' + object.linkedPoints.slice(-1)[0])[0]?.addEventListener('mouseup', finish);
        }
      }

      mapEl.addEventListener('click', clickFn);
      function clickFn(e) {
        mapEl.removeEventListener('mouseleave', leaveFn);
        let pointHash = points.add({
          x: (e.clientX - elLeft - elCenterX) * 2 ** -zoomLevel + centerX,
          y: (e.clientY - elTop - elCenterY) * 2 ** -zoomLevel + centerY,
        });
        objects.addPoint(hash, pointHash);
        object.isPreview = false;
        draw(object, false, [pointHash]);
        update();
      }

      function finish() {
        end();
        draw(object);
      }

      function moveFn(e) {
        object.previewX = (e.clientX - elLeft - elCenterX) * 2 ** -zoomLevel + centerX;
        object.previewY = (e.clientY - elTop - elCenterY) * 2 ** -zoomLevel + centerY;
        object.isPreview = true;

        update();
      }
      mapEl.addEventListener('mousemove', moveFn);
    }
  }, 50))

  document.getElementById('add-area').addEventListener('click', () => setTimeout(() => {
    if (!isediting) {
      mapEl.style.cursor = 'crosshair';
      isediting = true;

      let hash = addArea([], false)
      let object = objects[hash];

      function end() {
        document.body.removeEventListener('click', bodyClickFn);
        mapEl.removeEventListener('mouseenter', enterFn);
        mapEl.removeEventListener('mouseleave', leaveFn);
        mapEl.removeEventListener('click', clickFn);
        document.getElementsByClassName('point-' + object.linkedPoints[0])[0]?.removeEventListener('click', finish);
        mapEl.removeEventListener('mousemove', moveFn);
        object.isPreview = false;
        mapEl.style.cursor = 'default';
        isediting = false;
      }

      mapEl.addEventListener('mouseleave', leaveFn);
      function leaveFn() {
        mapEl.addEventListener('mouseenter', enterFn);
        document.body.addEventListener('click', bodyClickFn);
      }
      function bodyClickFn() {
        end();
        objects.delete(hash);
      }
      function enterFn() {
        document.body.addEventListener('click', bodyClickFn);
      }

      function update() {
        draw(object, true);
        if (object.linkedPoints.length >= 3) {
          document.getElementsByClassName('point-' + object.linkedPoints[0])[0]?.addEventListener('click', finish);
        }
      }

      mapEl.addEventListener('click', clickFn);
      function clickFn(e) {
        mapEl.removeEventListener('mouseleave', leaveFn);
        let pointHash = points.add({
          x: (e.clientX - elLeft - elCenterX) * 2 ** -zoomLevel + centerX,
          y: (e.clientY - elTop - elCenterY) * 2 ** -zoomLevel + centerY,
        });
        objects.addPoint(hash, pointHash);
        object.isPreview = false;
        draw(object, false, [pointHash]);
      }

      function finish() {
        borders.add({
          point1: object.linkedPoints.slice(-1)[0],
          point2: object.linkedPoints[0],
          object: getHash(object),
        })

        end();
        object.closed = true;
        objects.update(hash);
        draw(object);
      }

      function moveFn(e) {
        object.previewX = (e.clientX - elLeft - elCenterX) * 2 ** -zoomLevel + centerX;
        object.previewY = (e.clientY - elTop - elCenterY) * 2 ** -zoomLevel + centerY;
        object.isPreview = true;

        update();
      }
      mapEl.addEventListener('mousemove', moveFn);
    }
  }, 50))
}

export function addPoint(position) {
  let linkedPoints = position.length != 0 ? [points.add({
    x: position[0],
    y: position[1],
  })] : []
  return objects.add({
    form: 'point',
    linkedPoints: linkedPoints,
  });
}

export function addLine(list) {
  let linkedPoints = [];
  for (let item of list) {
    linkedPoints.push(points.add({
      x: item[0],
      y: item[1],
    }))
  }
  return objects.add({
    form: 'line',
    linkedPoints: linkedPoints,
  });
}

export function addArea(list, closed = true) {
  let linkedPoints = [];
  for (let item of list) {
    linkedPoints.push(points.add({
      x: item[0],
      y: item[1],
    }));
  }
  return objects.add({
    form: 'area',
    linkedPoints: linkedPoints,
    closed: closed,
  });
}
