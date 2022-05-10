import data from './data.js';
import { display } from './right_click_menu.js';

export function addEvent() {
  for (let key in data) {
    document.querySelectorAll(key).forEach(el => {
      el.removeEventListener('contextmenu', display.bind(null, data[key]));
      el.addEventListener('contextmenu', display.bind(null, data[key]));
    })
  }
}
