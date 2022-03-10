export let points = {};

export function init() {
  points.add = value => {
    let hash = api.getHash()
    points[hash] = value;
    return hash;
  }
}
