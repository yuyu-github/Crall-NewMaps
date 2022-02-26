import { centerX, centerY, elCenterX, elCenterY, mapEl, addSVGElement, zoomLevel } from '../map.js'
import { mode } from '../../mode.js'
import { getHash, objects, points } from './object.js';

export function draw(object) {
  let hash = getHash(object);
  if (hash != '') Array.from(document.getElementsByClassName('object-' + hash)).forEach(item => item.remove());
  let className = 'object ' + (hash == '' ? '' : 'object-' + hash);
  switch (object.type) {
    case 'point': {
      if (object.linkedPoints.length != 0 || object.isPreview) {
        let point = points[object.linkedPoints[0]];
        return addSVGElement('circle', {
          'class': className,
          'cx': elCenterX + ((object.isPreview ? object.previewX : point.x) - centerX) * 2 ** zoomLevel + 'px',
          'cy': elCenterY + ((object.isPreview ? object.previewY : point.y) - centerY) * 2 ** zoomLevel + 'px',
          'r': '8px',
          'stroke': 'red',
          'stroke-width': '1.5px',
          'stroke-opacity': object.isPreview ? '0.5' : '1',
          'fill': 'red',
          'fill-opacity': object.isPreview ? '0.15' : '0.3',
          'style': object.isPreview ? 'pointer-events: none;' : '',
        }, 20002);
      } else return null;
    }
    case 'line': {
      let returnValue = [[], []];
      
      if (object.linkedPoints.length != 0) {
        let SVGPoints = '';
        let lastPoint = [];

        [...object.linkedPoints, ...(object.isPreview ? [null] : []) /*プレビューなら一要素追加*/].forEach((hash, i) => {
          let point = points[hash];

          if (!(object.isPreview && i == object.linkedPoints.length)) returnValue[1].push(addSVGElement('circle', {
            'class': className,
            'cx': elCenterX + (point.x - centerX) * 2 ** zoomLevel + 'px',
            'cy': elCenterY + (point.y - centerY) * 2 ** zoomLevel + 'px',
            'r': '5px',
            'stroke': 'black',
            'stroke-width': '0.5px',
            'fill': 'lightgray',
          }, 20003));

          //プレビューしている線の場合、色を薄くする
          if (object.isPreview && i == object.linkedPoints.length) {
            //最後の線のみ別で描画
            returnValue[0][1] = addSVGElement('line', {
              'class': className,
              'x1': elCenterX + (lastPoint.x - centerX) * 2 ** zoomLevel + 'px',
              'y1': elCenterY + (lastPoint.y - centerY) * 2 ** zoomLevel + 'px',
              'x2': elCenterX + (object.previewX - centerX) * 2 ** zoomLevel + 'px',
              'y2': elCenterY + (object.previewY - centerY) * 2 ** zoomLevel + 'px',
              'stroke': 'blue',
              'stroke-width': '4px',
              'stroke-opacity': '0.5',
              'style': 'pointer-events: none;',
            }, 20000);
          } else {
            SVGPoints += `${elCenterX + (point.x - centerX) * 2 ** zoomLevel},${elCenterY + (point.y - centerY) * 2 ** zoomLevel} `;
            lastPoint = { x: point.x, y: point.y };
          }
        });

        if (object.linkedPoints.length > 1) {
          returnValue[0][0] = addSVGElement('polyline', {
            'class': className,
            'points': SVGPoints,
            'stroke': 'blue',
            'stroke-width': '4px',
            'fill': 'none',
          }, 20000);
        }
      }

      return returnValue;
    }
    case 'area': {
      let returnValue = [[], []];

      if (object.linkedPoints.length != 0) {
        let SVGPoints = '';
        let lastPoint = [];

        [...object.linkedPoints, ...(object.isPreview ? [null] : [])].forEach((hash, i) => {
          let point = points[hash];

          if (!(object.isPreview && i == object.linkedPoints.length)) returnValue[1].push(addSVGElement('circle', {
            'class': className,
            'cx': elCenterX + (point.x - centerX) * 2 ** zoomLevel + 'px',
            'cy': elCenterY + (point.y - centerY) * 2 ** zoomLevel + 'px',
            'r': '5px',
            'stroke': 'black',
            'stroke-width': '0.5px',
            'fill': 'lightgray',
          }, 20003));
          
          //プレビューしている線の場合、色を薄くする
          if (object.isPreview && i == object.linkedPoints.length) {
            //最後の線のみ別で描画
            returnValue[0][1] = addSVGElement('line', {
              'class': className,
              'x1': elCenterX + (lastPoint.x - centerX) * 2 ** zoomLevel + 'px',
              'y1': elCenterY + (lastPoint.y - centerY) * 2 ** zoomLevel + 'px',
              'x2': elCenterX + (object.previewX - centerX) * 2 ** zoomLevel + 'px',
              'y2': elCenterY + (object.previewY - centerY) * 2 ** zoomLevel + 'px',
              'stroke': 'limegreen',
              'stroke-width': '4px',
              'stroke-opacity': '0.5',
              'style': 'pointer-events: none;',
            }, 20000);
          } else {
            SVGPoints += `${elCenterX + (point.x - centerX) * 2 ** zoomLevel},${elCenterY + (point.y - centerY) * 2 ** zoomLevel} `;
            lastPoint = { x: point.x, y: point.y };
          }
        });
  
        if (object.closed) {
          returnValue[0][0] = addSVGElement('polygon', {
            'class': className,
            'points': SVGPoints,
            'stroke': 'limegreen',
            'stroke-width': '4px',
            'fill': 'limegreen',
            'fill-opacity': '0.3',
          }, 20000);
        } else {
          returnValue[0][0] = addSVGElement('polyline', {
            'class': className,
            'points': SVGPoints,
            'stroke': 'limegreen',
            'stroke-width': '4px',
            'fill': 'none',
          }, 20000);
        }
      }

      return returnValue;
    }
  }
}
