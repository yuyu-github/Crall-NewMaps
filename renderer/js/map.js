export const mapEl = document.getElementById('map');
export const elCenterX = mapEl.clientWidth / 2;
export const elCenterY = mapEl.clientHeight / 2;
export const elWidth = mapEl.clientWidth;
export const elHeight = mapEl.clientHeight;
export const elTop = mapEl.getBoundingClientRect().top;
export const elLeft = mapEl.getBoundingClientRect().left;
export let centerX = 0;
export let centerY = 0;

export function createSVGElement(name, attrs) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", name);
    for (let attr in attrs) {
        el.setAttribute(attr, attrs[attr]);
    }
    return el;
}

export function addSVGElement(name, attrs, index) {
    attrs.index = index;
    for (let el of mapEl.children) {
        if (el.getAttribute('index') >= index) return mapEl.insertBefore(createSVGElement(name, attrs), el);
    }
    return mapEl.appendChild(createSVGElement(name, attrs));
}