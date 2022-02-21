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
      let previousPoint = null;
      [...object.linkedPoints, ...(object.isPreview ? [null] : []) /*プレビューなら一要素追加*/].forEach((hash, i) => {
        let point = points[hash];
        if (!(object.isPreview && i == object.linkedPoints.length)) returnValue[1].push(addSVGElement('circle', {
          'class': className,
          'cx': elCenterX + (point.x - centerX) * 2 ** zoomLevel + 'px',
          'cy': elCenterY + (point.y - centerY) * 2 ** zoomLevel + 'px',
          'r': '4px',
          'stroke': 'black',
          'stroke-width': '0.5px',
          'fill': 'lightgray',
        }, 20003));
        if (previousPoint != null) {
          returnValue[0].push(addSVGElement('line', {
            'class': className,
            'x1': elCenterX + (previousPoint.x - centerX) * 2 ** zoomLevel + 'px',
            'y1': elCenterY + (previousPoint.y - centerY) * 2 ** zoomLevel + 'px',
            'x2': elCenterX + ((object.isPreview && i == object.linkedPoints.length ? object.previewX : point.x) - centerX) * 2 ** zoomLevel + 'px',
            'y2': elCenterY + ((object.isPreview && i == object.linkedPoints.length ? object.previewY : point.y) - centerY) * 2 ** zoomLevel + 'px',
            'stroke': 'blue',
            'stroke-width': '4px',
            'stroke-opacity': object.isPreview && i == object.linkedPoints.length ? '0.5' : '1',
            'style': object.isPreview && i == object.linkedPoints.length ? 'pointer-events: none;' : '',
          }, 20001));
        }
        previousPoint = point;
      });
      return returnValue;
    }
    case 'area': {
      let returnValue = [[], []];
      let SVGPoints = '';
      let previousPoint = null;
      [...object.linkedPoints, ...(object.isPreview ? [null] : [])].forEach((hash, i) => {
        let point = points[hash];
        if (!(object.isPreview && i == object.linkedPoints.length)) returnValue[1].push(addSVGElement('circle', {
          'class': className,
          'cx': elCenterX + (point.x - centerX) * 2 ** zoomLevel + 'px',
          'cy': elCenterY + (point.y - centerY) * 2 ** zoomLevel + 'px',
          'r': '4px',
          'stroke': 'black',
          'stroke-width': '0.5px',
          'fill': 'lightgray',
        }, 20003));
        if (object.closed) SVGPoints += `${elCenterX + (point.x - centerX) * 2 ** zoomLevel},${elCenterY + (point.y - centerY) * 2 ** zoomLevel} `;
        else {
          if (previousPoint != null) {
            returnValue[0].push(addSVGElement('line', {
              'class': className,
              'x1': elCenterX + (previousPoint.x - centerX) * 2 ** zoomLevel + 'px',
              'y1': elCenterY + (previousPoint.y - centerY) * 2 ** zoomLevel + 'px',
              'x2': elCenterX + ((object.isPreview && i == object.linkedPoints.length ? object.previewX : point.x) - centerX) * 2 ** zoomLevel + 'px',
              'y2': elCenterY + ((object.isPreview && i == object.linkedPoints.length ? object.previewY : point.y) - centerY) * 2 ** zoomLevel + 'px',
              'stroke': 'limegreen',
              'stroke-width': '4px',
              'stroke-opacity': object.isPreview && i == object.linkedPoints.length ? '0.5' : '1',
              'style': object.isPreview && i == object.linkedPoints.length ? 'pointer-events: none;' : '',
            }, 20000));
          }
          previousPoint = point;
        }
      });
      if (object.closed) {
        returnValue[0] = addSVGElement('polygon', {
          'class': className,
          'points': SVGPoints,
          'stroke': 'limegreen',
          'stroke-width': '4px',
          'fill': 'limegreen',
          'fill-opacity': '0.3',
        }, 20000)
      }
      return returnValue;
    }
  }
}
