import { objects } from "../object.js";

export let borders = {}

borders.add = value => {
  let hash = api.getHash();
  borders[hash] = value;

  objects[value.object].borders ??= [];
  objects[value.object].borders.push(hash);

  return hash;
}
