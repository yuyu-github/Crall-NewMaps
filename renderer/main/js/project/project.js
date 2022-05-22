import { init as initFile } from './file/file.js';

export let path;
export let saved;

export function init() {
  initFile();

  setPath('');
  setSaved(true);
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

export async function setSaved(val) {
  if (saved == val) return;

  saved = val;

  let title = await api.getTitle();
  if (saved) title = title.replace(/\*(?= - Crall NewMaps$)/, '');
  else title = title.replace(/(?= - Crall NewMaps$)/, '*');
  api.setTitle(title);
}
