import data from './data.js';
import { display } from './right_click_menu.js';

export function addEvent(ids = []) {
  if (!Array.isArray(ids)) ids = [ids]
  if (ids.length == 0) ids = Object.keys(data);

  for (let key of ids) {
    if (!key in data) continue;

    document.querySelectorAll(key).forEach(el => {
      el.removeEventListener('contextmenu', display.bind(null, data[key], el));
      el.addEventListener('contextmenu', display.bind(null, data[key], el));
    })
  }
}
