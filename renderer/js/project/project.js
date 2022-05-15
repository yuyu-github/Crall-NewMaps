import { init as initFile } from './file/file.js';

export let path;

export function init() {
  initFile();

  setPath('');
}

export function setPath(val) {
  path = val;
}
