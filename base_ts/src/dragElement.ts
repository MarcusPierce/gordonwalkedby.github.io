
//来源： https://www.w3schools.com/howto/howto_js_draggable.asp
function dragElement(element: HTMLElement, header: HTMLElement) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
    header.style.userSelect = "none"
    header.onmousedown = dragMouseDown
    function dragMouseDown(e: MouseEvent) {
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e: MouseEvent) {
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        element.style.top = Math.min(Math.max(element.offsetTop - pos2, 1), window.innerHeight - element.offsetHeight).toFixed() + "px";
        element.style.left = Math.min(Math.max(element.offsetLeft - pos1, 1), window.innerWidth - element.offsetWidth).toFixed() + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}