import { objects } from "../object.js";

export let borders = {}

export function init() {
  initBorders();
}

export function initBorders() {
  borders.add = value => {
    let hash = api.getHash();
    borders[hash] = value;
    objects[value.object].borders ??= [];
    objects[value.object].borders.push(hash);
    
    return hash;
  }

  borders.delete = hash => {
    objects[borders[hash].object].borders.splice(objects[borders[hash].object].borders.indexOf(hash))

    delete borders[hash];
  }
}

export function setBorders(data) {
  borders = data;
  initBorders();
}
