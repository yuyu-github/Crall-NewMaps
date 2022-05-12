import { addEvent } from "./add_event.js";

export function init() {
  addEvent();

  //画面外がクリックされた時メニューを閉じる
  document.body.addEventListener('mousedown', e => {
    if (e.target.classList.contains('right-click-menu')) return;

    let el = document.getElementById('right-click-menu');
    el.style.display = 'none';
    el.innerHTML = '';

  })
}

export function display(content, clickedTarget, e) {
  let el = document.getElementById('right-click-menu');
  el.innerHTML = '';
  el.style.top = e.clientY + 'px';
  el.style.left = e.clientX + 'px';
  for (let item in content) {
    let tr = el.appendChild(document.createElement('tr'));
    tr.classList.add('right-click-menu');
    let td = tr.appendChild(document.createElement('td'));
    td.classList.add('right-click-menu');
    if (item == '-') {
      let hr = td.appendChild(document.createElement('hr'))
      hr.classList.add('right-click-menu');
    } else {
      let btn = td.appendChild(document.createElement('p'));
      btn.innerHTML = item;
      btn.addEventListener('click', content[item].bind(null, clickedTarget));
      btn.addEventListener('click', () => {
        let el = document.getElementById('right-click-menu')
        el.innerHTML = '';
        el.style.display = 'none';
      });
      btn.classList.add('right-click-menu');
    }
  }
  el.style.display = 'block';
}
