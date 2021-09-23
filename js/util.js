
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
    let dragElem = options.dragElem || elem;
    const mousedown = e => {
        let offsetX = dragElem.getBoundingClientRect().left - e.clientX;
        let offsetY = dragElem.getBoundingClientRect().top - e.clientY;
        const mousemove = e => {
            if ((options.drag != null) && options.drag == false) return;
            dragElem.style.right = "";
            dragElem.style.bottom = "";
            dragElem.style.left = (e.clientX + offsetX) + 'px';
            dragElem.style.top = (e.clientY + offsetY) + 'px';
        };
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", e => {
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
                options.resizing = true;
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



export default {
    makeDraggable,
    makeResizable,
    makeScrollable,
}