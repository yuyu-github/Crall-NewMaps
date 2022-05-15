import { init as initFile } from './file/file.js';

export let path;
export let saved = false;

export function init() {
  initFile();

  setPath('');
  api.onSetPath((e, val) => setPath(val));
  api.onSetSaved((e, val) => setSaved(val));
}

export function setPath(val) {
  path = val;

  let title;
  let matches = path.match(/\\([^\\]+)$/);
  if (matches != null) {
    title = matches[1];
  }
  else title = '新規プロジェクト';
  title += ' - Crall NewMaps';
  api.setTitle(title);
}

export function setSaved(val) {
  saved = val;
}
