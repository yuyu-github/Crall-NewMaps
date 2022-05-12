import data from './data.js';
import { display } from './right_click_menu.js';

export function addEvent(ids = []) {
  if (ids.length == 0) ids = data;
  for (let key in ids) {
    if (!key in data) continue;

    document.querySelectorAll(key).forEach(el => {
      el.removeEventListener('contextmenu', display.bind(null, data[key]));
      el.addEventListener('contextmenu', display.bind(null, data[key]));
    })
  }
}
