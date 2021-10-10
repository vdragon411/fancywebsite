
export function mouseOnEdge(e, win, zoneSize = 5) {
    const winRect = win.getBoundingClientRect();
    const left = Math.abs((winRect.left - e.clientX)) <= zoneSize
    const top = Math.abs((winRect.top - e.clientY)) <= zoneSize
    const right = Math.abs((winRect.right - e.clientX)) <= zoneSize
    const bottom = Math.abs((winRect.bottom - e.clientY)) <= zoneSize

    const horz = (e.clientY >= (winRect.top - zoneSize / 2)) && (e.clientY < (winRect.bottom + zoneSize / 2));
    const vert = (e.clientX >= (winRect.left - zoneSize / 2)) && (e.clientX < (winRect.right + zoneSize / 2));

    let res = "";

    res += vert ? top ? "top " : bottom ? "bottom " : "" : "";
    res += horz ? (left ? ("left ") : (right ? "right " : "")) : "";

    return res;
}
export function makeDraggable(elem, options = {}) {
    options.dragging = false;
    options.shouldDrag = true;
    let dragElem = options.dragElem || elem;
    const mousedown = e => {
        options.dragging = true;
        let offsetX = dragElem.getBoundingClientRect().left - e.clientX;
        let offsetY = dragElem.getBoundingClientRect().top - e.clientY;
        const mousemove = e => {
            if ((options.shouldDrag != null) && options.shouldDrag == false) return;
            dragElem.style.right = "";
            dragElem.style.bottom = "";
            dragElem.style.left = (e.clientX + offsetX) + 'px';
            dragElem.style.top = (e.clientY + offsetY) + 'px';
        };
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", e => {
            options.dragging = false;
            document.removeEventListener("mousemove", mousemove);
        }, { once: true });
    };
    elem.addEventListener("mousedown", mousedown);

    options.enable = () => elem.addEventListener("mousedown", mousedown);
    options.disable = () => elem.removeEventListener("mousedown", mousedown);
    return options;
}

export function makeResizable(win, options = {}) {
    options.resizing = false;
    const mousedown = e => {
        let anchorX = null;
        let anchorY = null;

        const isMouseInside = (e, elem) => {
            const rect = elem.getBoundingClientRect();
            return e.clientX >= rect.left && e.clientX < rect.right
                && e.clientY >= rect.top && e.clientY < rect.bottom;
        }

        let edge = "";
        if (options.edges == null || options.edges)
            edge = mouseOnEdge(e, win);
        ["left", "right", "top", "bottom"].forEach(side => {
            options[side] && options[side] != null && options[side].forEach(el => {
                if (isMouseInside(e, el))
                    edge += " " + side + " ";
            })
        })
        if (edge != "") {
            options.resizing = true;
            const oldRect = win.getBoundingClientRect();
            const oldX = e.clientX;
            const oldY = e.clientY;
            const errorX = (oldX - oldRect.left);
            const errorY = (oldY - oldRect.top);

            const borderX = parseFloat(window.getComputedStyle(win).borderLeftWidth)
                + parseFloat(window.getComputedStyle(win).borderRightWidth);
            const borderY = parseFloat(window.getComputedStyle(win).borderTopWidth)
                + parseFloat(window.getComputedStyle(win).borderBottomWidth);

            // let width = Math.ceil(parseFloat(window.getComputedStyle(win).width))
            // let height = Math.round(parseFloat(window.getComputedStyle(win).height))
            const width = oldRect.width - borderX;
            const height = oldRect.height - borderY;


            const mousemove = e => {
                if ((options.shouldResize != null) && options.shouldResize == false) return;
                let left = false, right = false, top = false, bottom = false;

                left = edge.includes("left")
                right = edge.includes("right")
                top = edge.includes("top")
                bottom = edge.includes("bottom")

                // if (options.edges == null || options.edges == true)
                {
                    // console.log(options.edges)
                    left &= (!anchorX || e.clientX < anchorX && oldX < anchorX - 5) && (e.clientX < oldRect.right);
                    right &= (!anchorX || e.clientX > anchorX && oldX > anchorX + 5);
                    top &= (!anchorY || e.clientY < anchorY && oldY < anchorY - 5) && (e.clientY < oldRect.bottom);
                    bottom &= (!anchorY || e.clientY > anchorY && oldY > anchorY + 5);
                }

                const minWidth = parseFloat(window.getComputedStyle(win).minWidth);
                const minHeight = parseFloat(window.getComputedStyle(win).minHeight);

                if (left) {
                    const newWidth = (width - (e.clientX - (oldX)));
                    if (newWidth > minWidth) {
                        win.style.width = newWidth + "px";
                        win.style.left = e.clientX - errorX + "px";
                    }
                }
                if (right) {
                    const newWidth = (width + (e.clientX - (oldX)));
                    if (newWidth > minWidth) {
                        win.style.width = newWidth + "px";
                    }
                }
                if (top) {
                    const newHeight = (height - (e.clientY - (oldY)));
                    if (newHeight > minHeight) {
                        win.style.height = newHeight + "px";
                        win.style.top = e.clientY - errorY + "px";
                    }
                }
                if (bottom) {
                    const newHeight = (height + (e.clientY - (oldY)));
                    if (newHeight > minHeight) {
                        win.style.height = newHeight + "px";
                    }
                }
                e.stopPropagation();
            };
            document.addEventListener("mousemove", mousemove);
            document.addEventListener("mouseup", e => {
                options.resizing = false;
                document.removeEventListener("mousemove", mousemove);
            }, { once: true });
        }
    };

    document.addEventListener("mousedown", mousedown);

    options.enable = () => document.addEventListener("mousedown", mousedown);
    options.disable = () => document.removeEventListener("mousedown", mousedown);
    return options;
}

export function makeScrollable(main, scroll, bar) {
    const rect = elem => elem.getBoundingClientRect();
    const cstyle = elem => window.getComputedStyle(elem);

    const maxScroll = () => (main.scrollHeight - rect(main).height);
    const maxScrollbarHeight = () => rect(scroll).height - rect(bar).height;
    const calcScrollBarHeight = () => rect(scroll).height * (1.0 - (maxScroll() / main.scrollHeight));

    const updateBarHeight = () => {
        let ratio = (parseFloat(cstyle(bar).marginTop)) / maxScrollbarHeight();
        bar.style.height = calcScrollBarHeight() + 'px';
        bar.style.marginTop = maxScrollbarHeight() * ratio + "px";
        if (rect(bar).bottom > rect(main).bottom) {
            const diff = rect(bar).bottom - rect(main).bottom;
            let ratio = (parseFloat(cstyle(bar).marginTop) - diff) / maxScrollbarHeight();
            main.scrollTo(0, maxScroll() * ratio);
            bar.style.marginTop = parseFloat(cstyle(bar).marginTop) - diff + 'px'
        }
    }
    updateBarHeight();

    const resobs = new ResizeObserver(entries => {
        entries.forEach(e => {
            updateBarHeight();
        })
    })
    resobs.observe(scroll);

    main.addEventListener("scroll", e => {
        let ratio = main.scrollTop / maxScroll();
        bar.style.marginTop = maxScrollbarHeight() * ratio + "px";
    })

    bar.addEventListener("mousedown", e => {
        // e.stopPropagation();
        let offsetY = e.clientY - rect(bar).top;
        const mousemove = e => {
            e.stopPropagation();
            let newTop = (e.clientY - rect(scroll).top);
            newTop = Math.max(offsetY, newTop);
            newTop = Math.min(maxScrollbarHeight() + offsetY, newTop)
            let ratio = (newTop - offsetY) / maxScrollbarHeight();
            main.scrollTo(0, maxScroll() * ratio);
        }
        const mouseup = e => {
            document.removeEventListener("mousemove", mousemove);
        }
        document.addEventListener("mouseup", mouseup, { once: true });
        document.addEventListener("mousemove", mousemove);
    });
    
    bar.addEventListener("click", e => {
        // e.stopPropagation();
    })

    scroll.addEventListener("click", e => {
        const barHeight = calcScrollBarHeight();
        const offsetY = rect(bar).height/2;
        let newTop =  e.clientY - rect(scroll).top - rect(bar).height/2;
        newTop = Math.max(0, newTop);
        newTop = Math.min(maxScrollbarHeight() + offsetY, newTop)
        let ratio = newTop / maxScrollbarHeight();
        main.scrollTo({
            left:0,
            top:maxScroll() * ratio,
            behaviour: 'smooth'
        });
    })
}








/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                             WORK IN PROGRESS                                        //
/////////////////////////////////////////////////////////////////////////////////////////////////////////






class DragAction {
    constructor(elem) {
        this.status = "";
        const mousemove = e => {
            if (this.premousemove) this.premousemove(e);
            this.mousemove(e);
            if (this.postmousemove) this.postmousemove(e);
        }
        this.mouseupEvent = e => {
            if (this.status != "down") return;
            if (e != null) if (this.premouseup) this.premouseup(e);
            if (e != null) this.mouseup(e);
            document.removeEventListener("mousemove", mousemove);
            document.removeEventListener("mouseup", this.mouseupEvent)
            if (e != null) if (this.postmouseup) this.postmouseup(e);
            this.status = "";
        };
        this.mousedownEvent = e => {
            if (this.status != "") return;
            this.status = "down";
            if (this.premousedown) this.premousedown(e);
            this.mousedown(e);
            document.addEventListener("mousemove", mousemove);
            document.addEventListener("mouseup", this.mouseupEvent)

            if (this.postmousedown) this.postmousedown(e);
        }
        this.elem = elem;
        this.enable();
    }
    enable() {
        this.elem.addEventListener("mousedown", this.mousedownEvent)
    }
    disable() {
        this.elem.removeEventListener("mousedown", this.mousedownEvent)
        this.mouseupEvent();
    }
    mousedown(e) { }
    mousemove(e) { }
    mouseup(e) { }
}

class Draggable extends DragAction {
    constructor(elem, dragElem) {
        super(elem)
        this.dragElem = dragElem != null ? dragElem : elem;
    }
    mousedown(e) {
        this.offsetX = this.dragElem.getBoundingClientRect().left - e.clientX;
        this.offsetY = this.dragElem.getBoundingClientRect().top - e.clientY;
    }
    mousemove(e) {
        this.dragElem.style.right = "";
        this.dragElem.style.bottom = "";
        this.dragElem.style.left = (e.clientX + this.offsetX) + 'px';
        this.dragElem.style.top = (e.clientY + this.offsetY) + 'px';
    }
}

class Resizable extends DragAction {
    constructor(elem) {
        super(elem);
        this.anchorX = null;
        this.anchorY = null;
        this.sides = {};
    }
    enable() {
        document.addEventListener("mousedown", this.mousedownEvent);
    }
    disable() {
        document.removeEventListener("mousedown", this.mousedownEvent);
        this.mouseupEvent();
    }
    mousedown(e) {
        const isMouseInside = (e, elem) => {
            const rect = elem.getBoundingClientRect();
            return e.clientX >= rect.left && e.clientX < rect.right
                && e.clientY >= rect.top && e.clientY < rect.bottom;
        }
        let edge = "";
        if (this.useEdges == null || this.useEdges)
            edge = mouseOnEdge(e, this.elem);
        ["left", "right", "top", "bottom"].forEach(side => {
            this.sides[side] && this.sides[side] != null && this.sides[side].forEach(el => {
                if (isMouseInside(e, el))
                    edge += " " + side + " ";
            })
        })
        if (edge != "") {
            this.oldRect = this.elem.getBoundingClientRect();
            this.oldX = e.clientX;
            this.oldY = e.clientY;
            this.errorX = (this.oldX - this.oldRect.left);
            this.errorY = (this.oldY - this.oldRect.top);

            const borderX = parseFloat(window.getComputedStyle(this.elem).borderLeftWidth)
                + parseFloat(window.getComputedStyle(this.elem).borderRightWidth);
            const borderY = parseFloat(window.getComputedStyle(this.elem).borderTopWidth)
                + parseFloat(window.getComputedStyle(this.elem).borderBottomWidth);

            this.width     = this.oldRect.width - borderX;
            this.height    = this.oldRect.height - borderY;
        }
        this.edge = edge;
        this.isResizing = (this.edge == "")? false : true;
    }
    mousemove(e) {
        if (this.edge == "") return;
        let left = false, right = false, top = false, bottom = false;

        left    = this.edge.includes("left")
        right   = this.edge.includes("right")
        top     = this.edge.includes("top")
        bottom  = this.edge.includes("bottom")
        {
            left    &= (!this.anchorX || e.clientX < this.anchorX && this.oldX < this.anchorX - 5) && (e.clientX < this.oldRect.right);
            right   &= (!this.anchorX || e.clientX > this.anchorX && this.oldX > this.anchorX + 5);
            top     &= (!this.anchorY || e.clientY < this.anchorY && this.oldY < this.anchorY - 5) && (e.clientY < this.oldRect.bottom);
            bottom  &= (!this.anchorY || e.clientY > this.anchorY && this.oldY > this.anchorY + 5);
        }

        const minWidth = parseFloat(window.getComputedStyle(this.elem).minWidth);
        const minHeight = parseFloat(window.getComputedStyle(this.elem).minHeight);

        const newWidth = this.width - (e.clientX - (this.oldX)) * (right?-1:1);
        if (newWidth > minWidth && (left || right)) {
            this.elem.style.width = newWidth + "px";
            if (left) this.elem.style.left  = e.clientX - this.errorX + "px";
        }

        const newHeight = this.height - (e.clientY - (this.oldY)) * (bottom?-1:1);
        if (newHeight > minHeight && (top || bottom)) {
            this.elem.style.height = newHeight + "px";
            if (top) this.elem.style.top    = e.clientY - this.errorY + "px";
        }
    }
}
















export default {
    makeDraggable,
    makeResizable,
    makeScrollable,
    mouseOnEdge,

    Draggable,
    Resizable
}
