import { centerX, centerY, elLeft, elTop, mapEl, setCenterX, setCenterY } from "./map.js";

export function init() {
    mapEl.addEventListener('mousedown', e => {
        const dragStartPosX = e.clientX - elLeft;
        const dragStartPosY = e.clientY - elTop;
        const startPosX = centerX;
        const startPosY = centerY;

        mapEl.addEventListener('mousemove', moveFn);
        function moveFn(e) {
            setCenterX(startPosX + ((e.clientX - elLeft) - dragStartPosX));
            setCenterY(startPosY + ((e.clientY - elTop) - dragStartPosY));
        }
        mapEl.addEventListener('mouseup', function fn() {
            mapEl.removeEventListener('mouseup', fn);
            mapEl.removeEventListener('mousemove', moveFn);
        })
    })
}
