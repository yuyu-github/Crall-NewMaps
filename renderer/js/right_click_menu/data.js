import { objects } from "../map/object/object.js";

export default {
  '.border': {
    '削除': (target) => {
      for (let name of target.classList) {
        let matches = name.match(/object-([^\-]+)-border/);
        if (matches != null) {
          objects.delete(matches[1]);
          return;
        }
      }
    }
  }
}
