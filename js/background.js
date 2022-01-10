export let background = document.querySelector('#background-setting > select').value;
export let backgroundObj = null;

export function setEvents() {
    document.querySelector('#background-setting > select').addEventListener('change', e => {
        background = e.currentTarget.value;
        switch (e.currentTarget.value) {
            case '':
                document.getElementById('background').innerHTML = '';
                backgroundEl = null;
                break;
            case 'openstreetmap':
                //スタイルとスクリプトの読み込み
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
                //地図読み込み
                function tryInitMap() {
                    try {
                        //Lがあるか確認
                        L;
                        //インターバルを削除
                        clearInterval(id);

                        backgroundObj = L.map('background', {
                            center: [35.6809591, 139.7673068],
                            zoom: 17,
                        })
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                        }).addTo(backgroundObj);
                    }
                    catch {}
                }
                //スクリプトが読み込めるまで繰り返す
                let id = setInterval(tryInitMap, 5);
                break;
        }
    })
}