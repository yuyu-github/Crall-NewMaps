import { centerX, centerY, elCenterX, elCenterY, elLeft, elTop, mapEl, zoomLevel } from '../map.js';
import { draw } from './draw.js';
import { objects } from './object.js';
import { points } from '../point/point.js'

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
        draw(object);
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
      let lastPoint = null;

      function end() {
        document.body.removeEventListener('click', bodyClickFn);
        mapEl.removeEventListener('mouseenter', enterFn);
        mapEl.removeEventListener('mouseleave', leaveFn);
        mapEl.removeEventListener('click', clickFn);
        lastPoint?.removeEventListener('click', finish);
        mapEl.removeEventListener('mousemove', moveFn);
        object.isPreview = false;
        mapEl.style.cursor = 'default';
        if (lastPoint != null) lastPoint.style.cursor = 'default';
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

      mapEl.addEventListener('click', clickFn);
      function clickFn(e) {
        mapEl.removeEventListener('mouseleave', leaveFn);
        objects.addPoint(hash, points.add({
          x: (e.clientX - elLeft - elCenterX) * 2 ** -zoomLevel + centerX, 
          y: (e.clientY - elTop - elCenterY) * 2 ** -zoomLevel + centerY,
        }));
        object.isPreview = false;
      }

      function finish() {
        end();
        draw(object);
      }

      function moveFn(e) {
        object.previewX = (e.clientX - elLeft - elCenterX) * 2 ** -zoomLevel + centerX;
        object.previewY = (e.clientY - elTop - elCenterY) * 2 ** -zoomLevel + centerY;
        object.isPreview = true;

        let drawresult = draw(object);
        if (drawresult[1].length > 1) {
          lastPoint?.removeEventListener('click', finish)
          if (lastPoint != null) lastPoint.style.cursor = 'default';
          lastPoint = drawresult[1].slice(-1)[0];
          lastPoint?.addEventListener('click', finish);
          if (lastPoint != null) lastPoint.style.cursor = 'pointer';
        }
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
      let firstPoint = null;

      function end() {
        document.body.removeEventListener('click', bodyClickFn);
        mapEl.removeEventListener('mouseenter', enterFn);
        mapEl.removeEventListener('mouseleave', leaveFn);
        mapEl.removeEventListener('click', clickFn);
        firstPoint?.removeEventListener('click', finish);
        mapEl.removeEventListener('mousemove', moveFn);
        object.isPreview = false;
        mapEl.style.cursor = 'default';
        if (firstPoint != null) firstPoint.style.cursor = 'default';
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

      mapEl.addEventListener('click', clickFn);
      function clickFn(e) {
        mapEl.removeEventListener('mouseleave', leaveFn);
        objects.addPoint(hash, points.add({
          x: (e.clientX - elLeft - elCenterX) * 2 ** -zoomLevel + centerX, 
          y: (e.clientY - elTop - elCenterY) * 2 ** -zoomLevel + centerY,
        }));
        object.isPreview = false;
      }

      function finish() {
        end();
        object.closed = true;
        objects.update(hash);
        draw(object);
      }

      function moveFn(e) {
        object.previewX = (e.clientX - elLeft - elCenterX) * 2 ** -zoomLevel + centerX;
        object.previewY = (e.clientY - elTop - elCenterY) * 2 ** -zoomLevel + centerY;
        object.isPreview = true;

        let drawresult = draw(object);
        if (drawresult[1].length > 2) {
          firstPoint = drawresult[1][0];
          firstPoint?.addEventListener('click', finish);
          if (firstPoint != null) firstPoint.style.cursor = 'pointer'
        }
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
    type: 'point',
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
    type: 'line',
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
    type: 'area',
    linkedPoints: linkedPoints,
    closed: closed,
  });
}
