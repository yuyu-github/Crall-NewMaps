import { centerX, centerY, elCenterX, elCenterY, mapEl, addSVGElement, zoomLevel, isOffScreen, isLineOffScreen } from '../map.js'
import { mode } from '../../mode.js'
import { getHash, objects } from './object.js';
import { points } from '../point/point.js';
import { bigPointR, draw as drawPoint, pointR } from '../point/draw.js'
import { draw as drawBorder } from './border/draw.js';
import { isDraggingPoint } from '../point/drag.js';
import { isDraggingMap } from '../drag.js';
import { borders } from './border/border.js';

export const lineWidth = 5;

export function draw(object, onlyPreview = false, pointToDraw = null) {
  let hash = getHash(object);
  if (hash != '') {
    if (!onlyPreview) {
      Array.from(document.getElementsByClassName('object-' + hash)).forEach(item => item.remove());
      Array.from(document.getElementsByClassName('object-' + hash + '-border')).forEach(item => item.remove());
    } else Array.from(document.querySelectorAll('.object-' + hash + '.preview')).forEach(item => item.remove());

    let className = 'object ' + (hash == '' ? '' : 'object-' + hash);
    switch (object.form) {
      case 'point': {
        if (object.linkedPoints.length != 0 || object.isPreview) {
          let point = points[object.linkedPoints[0]];
          addSVGElement('circle', {
            'class': className + ' preview',
            'cx': elCenterX + ((object.isPreview ? object.previewX : point.x) - centerX) * 2 ** zoomLevel + 'px',
            'cy': elCenterY + ((object.isPreview ? object.previewY : point.y) - centerY) * 2 ** zoomLevel + 'px',
            'r': bigPointR + 'px',
            'stroke': 'red',
            'stroke-width': '1.5px',
            'stroke-opacity': object.isPreview ? '0.5' : '1',
            'fill': 'red',
            'fill-opacity': object.isPreview ? '0.15' : '0.3',
            'style': object.isPreview ? 'pointer-events: none;' : '',
          }, 20002);
          drawPoint(object.linkedPoints[0], true, true);

          break;
        } else return;
      }
      case 'line': {
        if (object.linkedPoints.length != 0) {
          let SVGPoints = '';
          let lastPoint = [];

          [...object.linkedPoints, ...(object.isPreview ? [null] : []) /*プレビューなら一要素追加*/].forEach((hash, i) => {
            let point = points[hash];

            if (!(object.isPreview && i == object.linkedPoints.length) &&
              ((!onlyPreview && pointToDraw == null) || pointToDraw?.includes(hash))) {
              if (!isOffScreen(point.x, point.y, pointR)) drawPoint(hash);
            }

            //プレビューしている線の場合、色を薄くする
            if (object.isPreview && i == object.linkedPoints.length) {
              //最後の線のみ別で描画
              addSVGElement('line', {
                'class': className + ' preview',
                'x1': elCenterX + (lastPoint.x - centerX) * 2 ** zoomLevel + 'px',
                'y1': elCenterY + (lastPoint.y - centerY) * 2 ** zoomLevel + 'px',
                'x2': elCenterX + (object.previewX - centerX) * 2 ** zoomLevel + 'px',
                'y2': elCenterY + (object.previewY - centerY) * 2 ** zoomLevel + 'px',
                'stroke': 'blue',
                'stroke-width': lineWidth + 'px',
                'stroke-opacity': '0.5',
                'style': 'pointer-events: none;',
              }, 20000);
            } else {
              if (!onlyPreview) SVGPoints += `${elCenterX + (point.x - centerX) * 2 ** zoomLevel},${elCenterY + (point.y - centerY) * 2 ** zoomLevel} `;
              lastPoint = { x: point.x, y: point.y };
            }
          });

          if (object.linkedPoints.length > 1 && !onlyPreview) {
            addSVGElement('polyline', {
              'class': className,
              'points': SVGPoints,
              'stroke': 'blue',
              'stroke-width': lineWidth + 'px',
              'fill': 'none',
            }, 20000);
          }
        }

        if (!onlyPreview || pointToDraw != null) dragObjectBorder(hash, pointToDraw);

        break;
      }
      case 'area': {
        if (object.linkedPoints.length != 0) {
          let SVGPoints = '';
          let lastPoint = [];

          [...object.linkedPoints, ...(object.isPreview ? [null] : [])].forEach((hash, i) => {
            let point = points[hash];

            if (!(object.isPreview && i == object.linkedPoints.length) &&
              ((!onlyPreview && pointToDraw == null) || pointToDraw?.includes(hash))) {
              if (!isOffScreen(point.x, point.y, pointR)) drawPoint(hash);
            }
            
            //プレビューしている線の場合、色を薄くする
            if (object.isPreview && i == object.linkedPoints.length) {
              //最後の線のみ別で描画
              addSVGElement('line', {
                'class': className + ' preview',
                'x1': elCenterX + (lastPoint.x - centerX) * 2 ** zoomLevel + 'px',
                'y1': elCenterY + (lastPoint.y - centerY) * 2 ** zoomLevel + 'px',
                'x2': elCenterX + (object.previewX - centerX) * 2 ** zoomLevel + 'px',
                'y2': elCenterY + (object.previewY - centerY) * 2 ** zoomLevel + 'px',
                'stroke': 'limegreen',
                'stroke-width': lineWidth + 'px',
                'stroke-opacity': '0.5',
                'style': 'pointer-events: none;',
              }, 20000);
            } else {
              if (!onlyPreview) SVGPoints += `${elCenterX + (point.x - centerX) * 2 ** zoomLevel},${elCenterY + (point.y - centerY) * 2 ** zoomLevel} `;
              lastPoint = { x: point.x, y: point.y };
            }
          });
    
          if (!onlyPreview) {
            if (object.closed) {
              addSVGElement('polygon', {
                'class': className,
                'points': SVGPoints,
                'stroke': 'limegreen',
                'stroke-width': lineWidth + 'px',
                'fill': 'limegreen',
                'fill-opacity': '0.3',
              }, 20000);
            } else {
              addSVGElement('polyline', {
                'class': className,
                'points': SVGPoints,
                'stroke': 'limegreen',
                'stroke-width': lineWidth + 'px',
                'fill': 'none',
              }, 20000);
            }
          }
        }

        if (!onlyPreview || pointToDraw != null) dragObjectBorder(hash, pointToDraw);

        break;
      }
    }
  }
}

export function dragObjectBorder(objectHash, pointToDraw = null) {
  if (!(isDraggingPoint || isDraggingMap)) {
    objects[objectHash].borders?.forEach(item => {
      let obj = borders[item];
      if (pointToDraw == null || (pointToDraw.includes(obj.point1) || pointToDraw.includes(obj.point2))) {
        if (!isLineOffScreen(points[obj.point1].x, points[obj.point1].y, points[obj.point2].x, points[obj.point2].y, pointR))
          drawBorder(item);
      }
    });
  }
}
