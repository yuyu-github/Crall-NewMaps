import { init as initSave } from "./save.js";
import { init as initLoad } from "./load.js";

export function init() {
  initSave();
  initLoad();
}
