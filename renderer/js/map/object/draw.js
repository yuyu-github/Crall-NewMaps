import { centerX, centerY, elCenterX, elCenterY, mapEl, addSVGElement, zoomLevel } from '../map.js'
import { mode } from '../../mode.js'
import { getHash, objects } from './object.js';
import { points } from '../point/point.js';
import { bigPointR, draw as drawPoint } from '../point/draw.js'
import { draw as drawBorder } from './border/draw.js';
import { isDraggingPoint } from '../point/drag.js';
import { isDraggingMap } from '../drag.js';

export const lineWidth = 5;

export function draw(object, onlyPreview = false) {
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
          return [[addSVGElement('circle', {
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
          }, 20002)], drawPoint(object.linkedPoints[0], true, true)];
        } else return null;
      }
      case 'line': {
        let returnValue = [[], []];
        
        if (object.linkedPoints.length != 0) {
          let SVGPoints = '';
          let lastPoint = [];

          [...object.linkedPoints, ...(object.isPreview ? [null] : []) /*プレビューなら一要素追加*/].forEach((hash, i) => {
            let point = points[hash];

            if (!(object.isPreview && i == object.linkedPoints.length) && !onlyPreview) returnValue[1].push(drawPoint(hash));

            //プレビューしている線の場合、色を薄くする
            if (object.isPreview && i == object.linkedPoints.length) {
              //最後の線のみ別で描画
              returnValue[0][1] = addSVGElement('line', {
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
            returnValue[0][0] = addSVGElement('polyline', {
              'class': className,
              'points': SVGPoints,
              'stroke': 'blue',
              'stroke-width': lineWidth + 'px',
              'fill': 'none',
            }, 20000);
          }
        }

        if (!onlyPreview) returnValue[2] = dragObjectBorder(hash);

        return returnValue;
      }
      case 'area': {
        let returnValue = [[], []];

        if (object.linkedPoints.length != 0) {
          let SVGPoints = '';
          let lastPoint = [];

          [...object.linkedPoints, ...(object.isPreview ? [null] : [])].forEach((hash, i) => {
            let point = points[hash];

            if (!(object.isPreview && i == object.linkedPoints.length) && !onlyPreview) returnValue[1].push(drawPoint(hash));
            
            //プレビューしている線の場合、色を薄くする
            if (object.isPreview && i == object.linkedPoints.length) {
              //最後の線のみ別で描画
              returnValue[0][1] = addSVGElement('line', {
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
              returnValue[0][0] = addSVGElement('polygon', {
                'class': className,
                'points': SVGPoints,
                'stroke': 'limegreen',
                'stroke-width': lineWidth + 'px',
                'fill': 'limegreen',
                'fill-opacity': '0.3',
              }, 20000);
            } else {
              returnValue[0][0] = addSVGElement('polyline', {
                'class': className,
                'points': SVGPoints,
                'stroke': 'limegreen',
                'stroke-width': lineWidth + 'px',
                'fill': 'none',
              }, 20000);
            }
          }
        }

        if (!onlyPreview) returnValue[2] = dragObjectBorder(hash);

        return returnValue;
      }
    }
  }
}

export function dragObjectBorder(objectHash) {
  let returnValue = [];
  if (!(isDraggingPoint || isDraggingMap)) {
    objects[objectHash].borders?.forEach(item => {
      returnValue.push(drawBorder(item));
    });
  }
}
