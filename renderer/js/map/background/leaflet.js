import { centerX, centerY } from "../map.js";
import { backgroundType, setBackgroundType, backgroundObj, setBackgroundObj } from "./background.js";

export const latScale = 0.000069648;
export const lngScale = 0.000085808;

export function loadLeaflet() {
  if (document.getElementById('leaflet-style') == null) {
    let el = document.createElement('link');
    el.id = 'leaflet-style';
    el.rel = 'stylesheet';
    el.href = 'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css';
    document.head.appendChild(el);
  }
  if (document.getElementById('leaflet-script') == null) {
    let el = document.createElement('script');
    el.id = 'leaflet-script';
    el.src = 'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js';
    document.head.appendChild(el);
  }
}

export function loadMap(url, options, zoom = options['maxZoom'] ?? 18) {
  loadLeaflet();
  //スクリプトが読み込めるまで繰り返す
  let id = setInterval(() => {
    try {
      //Lがあるか確認
      L;
      //インターバルを削除
      clearInterval(id);

      //地図読み込み
      setBackgroundType('realitymap')
      setBackgroundObj(L.map('background', {
        center: [0, 0],
        zoom: zoom,
        zoomControl: false,
      }));
      L.tileLayer(url, options).addTo(backgroundObj);

      moveTo(centerX, centerY);
      setZoom(0);
    }
    catch {}
  }, 5);
}

export let getLatLng = (x, y) => [35.6809591 - y * latScale, 139.7673068 + x * lngScale]

export function moveTo(x, y) {
  backgroundObj.panTo([35.6809591 - y * latScale, 139.7673068 + x * lngScale], { animate: false });
}

export function setZoom(zoomLevel) {
  backgroundObj.setZoom(zoomLevel + 14, { animate: false });
}
