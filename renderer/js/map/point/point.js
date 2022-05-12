export let points = {};

export function init() {
  points.add = value => {
    let hash = api.getHash()
    points[hash] = value;
    return hash;
  }

  points.delete = hash => {
    Array.from(document.getElementsByClassName('point-' + hash)).forEach(item => item.remove());
    delete points[hash];
  }
}
