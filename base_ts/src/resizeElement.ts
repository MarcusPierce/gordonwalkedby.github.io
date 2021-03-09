//来源　https://htmldom.dev/make-a-resizable-element/
function SetElementResizable(ele: HTMLElement, minX: number, minY: number) {
    let r1 = document.createElement("div")
    r1.className = "resizer-r"
    ele.appendChild(r1)

    let r2 = document.createElement("div")
    r2.className = "resizer-b"
    ele.appendChild(r2)

    // The current position of mouse
    let x = 0;
    let y = 0;

    // The dimension of the element
    let w = 0;
    let h = 0;

    // Handle the mousedown event
    // that's triggered when user drags the resizer
    const mouseDownHandler = function (e: MouseEvent) {
        // Get the current mouse position
        x = e.clientX;
        y = e.clientY;

        // Calculate the dimension of element
        const styles = window.getComputedStyle(ele);
        w = parseInt(styles.width, 10);
        h = parseInt(styles.height, 10);

        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e: MouseEvent) {
        // How far the mouse has been moved
        const dx = e.clientX - x;
        const dy = e.clientY - y;

        let fx = Math.min(Math.max(w + dx, minX), window.innerWidth)
        let fy = Math.min(Math.max(h + dy, minY), window.innerHeight)
        ele.dispatchEvent(new Event("resize"))
        // Adjust the dimension of element
        ele.style.width = `${fx}px`;
        ele.style.height = `${fy}px`;
    };

    const mouseUpHandler = function () {
        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
    r1.onmousedown = mouseDownHandler
    r2.onmousedown = mouseDownHandler
}
