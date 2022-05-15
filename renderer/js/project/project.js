import { init as initFile } from './file/file.js';

export let path;

export function init() {
  initFile();

  setPath('');
  api.onSetPath((e, val) => setPath(val));
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
