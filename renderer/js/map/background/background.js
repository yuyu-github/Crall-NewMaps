import { loadMap, moveTo as worldMapMoveTo } from "./leaflet.js";

export let background = document.querySelector('#background-setting > select').value;
export let backgroundType = '';
export let backgroundObj = null;

export let init = () => document.querySelector('#background-setting > select').addEventListener('change', e => setBackground(e.currentTarget.value));

export let setBackgroundType = val => backgroundType = val;
export let setBackgroundObj = val => backgroundObj = val;

export function setBackground(name) {
    backgroundObj?.remove();
    document.getElementById('background').innerHTML = '';
    document.getElementById('background').getAttributeNames().forEach(item => {
        if (item != 'id') document.getElementById('background').removeAttribute(item);});
    background = name;
    backgroundType = '';
    backgroundObj = null;

    switch (background) {
        case '':
            break;
        case 'openstreetmap':
            loadMap('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            })
            break;
        case 'gsi-map':
        case 'gsi-map-photo':
        case 'gsi-map-pale':
        case 'gsi-map-blank':
            loadMap('https://cyberjapandata.gsi.go.jp/xyz/{maptype}/{z}/{x}/{y}.{extension}', {
                maptype: ({'': 'std', 'photo': 'seamlessphoto'})[background.replace(/^gsi-map-?/, '')] ?? background.replace(/^gsi-map-/, ''),
                extension: ['photo'].includes(background.replace(/^gsi-map-?/, '')) ? 'jpg' : 'png',
                attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>',
                maxZoom: ({'blank': 14})[background.replace(/^gsi-map-?/, '')] ?? 18,
                minZoom: ({'photo': 2, 'pale': 2, 'blank': 5})[background.replace(/^gsi-map-?/, '')] ?? 0,
            })
            break;
    }
}

export function moveTo(x, y) {
    switch (backgroundType) {
        case 'worldmap':
            worldMapMoveTo(x, y);
            break;
    }
}
