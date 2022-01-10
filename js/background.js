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
                            center: [35.6809591, 139.7673068],
                            zoom: 17,
                        });
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                        }).addTo(backgroundObj);
                    }
                    catch {}
                }, 5);
                break;
            case 'gsi-map':
                loadLeaflet();
                id = setInterval(() => {
                    try {
                        L;
                        clearInterval(id);

                        backgroundObj = L.map('background', {
                            center: [35.6809591, 139.7673068],
                            zoom: 17,
                        });
                        L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
                            attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
                        }).addTo(backgroundObj);
                    }
                    catch{}
                }, 5);
                break;
        }
    })
}