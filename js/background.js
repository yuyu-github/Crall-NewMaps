export let background = document.querySelector('#background-setting > select').value;
export let backgroundObj = null;

export function setEvents() {
    document.querySelector('#background-setting > select').addEventListener('change', e => {
        function loadLeaflet() {
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

        function loadMap(url, options, zoom = options['maxZoom'] ?? 18, center = [35.6809591, 139.7673068]) {
            loadLeaflet();
            //スクリプトが読み込めるまで繰り返す
            id = setInterval(() => {
                try {
                    //Lがあるか確認
                    L;
                    //インターバルを削除
                    clearInterval(id);

                    //地図読み込み
                    backgroundObj = L.map('background', {
                        center: center,
                        zoom: zoom,
                        zoomControl: false});
                    L.tileLayer(url, options).addTo(backgroundObj);
                }
                catch {}
            }, 5);
        }

        backgroundObj?.remove();
        document.getElementById('background').innerHTML = '';
        document.getElementById('background').getAttributeNames().forEach(item => {
            if (item != 'id') document.getElementById('background').removeAttribute(item);});
        background = e.currentTarget.value;
        backgroundObj = null;

        let id;
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
    })
}