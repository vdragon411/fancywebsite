import { makeDraggable, makeResizable, mouseOnEdge, makeScrollable } from "./util.js";

const info = document.createElement("div");
info.classList.add("window");
info.style.position = "absolute";
info.style.width = "200px";
info.style.height = "300px";
info.style.right = 0;
info.style.bottom = "40px";
info.style.overflowY = "hidden";
document.body.firstElementChild.insertAdjacentElement("afterend", info);
makeResizable(info);

function addInfo(obj) {
    info.innerHTML = "";
    for (let key in obj) {
        info.innerHTML += `${key}: ${obj[key]} <br>`
    }
}



let cursorElement = null;

const wins = document.querySelectorAll(".window");
wins.forEach(win => {
    if (win == info) return;

    win.addEventListener("mousedown", e => {
        if (win.parentElement.lastElementChild != win)
            win.parentElement.appendChild(win);
        // e.stopPropagation();
    })

    let winDrag = makeDraggable(win.querySelector(".window-titlebar"), {
        dragElem: win,
    });

    const getID = val => win.querySelector(val);

    let winResize = makeResizable(win, {
        // edges: false,
        // left:   [ getID("#resizer-ll"), getID("#resizer-lt"), getID("#resizer-lb") ],
        // right:  [ getID("#resizer-rr"), getID("#resizer-rt"), getID("#resizer-rb") ],
        // top:    [ getID("#resizer-tt"), getID("#resizer-rt"), getID("#resizer-lt") ],
        // bottom: [ getID("#resizer-bb"), getID("#resizer-rb"), getID("#resizer-lb") ],
    });

    let resizers = [getID("#resizer-ll"), getID("#resizer-lt"), getID("#resizer-lb"),
    getID("#resizer-rr"), getID("#resizer-rt"), getID("#resizer-rb"),
    getID("#resizer-tt"), getID("#resizer-rt"), getID("#resizer-lt"),
    getID("#resizer-bb"), getID("#resizer-rb"), getID("#resizer-lb"),];

    resizers.forEach(r => {
        r.style.display = "none";
    })
    // win.addEventListener("mouseenter", e => {
    //     resizers.forEach(r => {
    //         r.style.display = "";
    //     })
    // });
    // win.addEventListener("mouseleave", e => {
    //     resizers.forEach(r => {
    //         r.style.display = "none";
    //     })
    // });
    // document.addEventListener("mousemove", e => {
    //     if (mouseOnEdge(e, win)) {
    //             resizers.forEach(r => {
    //                 r.style.display = "";
    //             })
    //     } else {
    //         resizers.forEach(r => {
    //             if (!winResize.resizing)
    //             r.style.display = "none";
    //         })
    //     }
    // });

    let maximized = false;
    let origWidth, origHeight, origLeft, origTop;

    win.querySelector("#max").addEventListener("click", e => {
        const par = document.body.querySelector(".window-area");

        if (!maximized) {
            origWidth = window.getComputedStyle(win).width;
            origHeight = window.getComputedStyle(win).height;
            origLeft = window.getComputedStyle(win).left;
            origTop = window.getComputedStyle(win).top;

            // win.style.width = window.getComputedStyle(par).width;
            // win.style.height = window.getComputedStyle(par).height;
            win.style.left = window.getComputedStyle(par).left;
            win.style.top = window.getComputedStyle(par).top;
            // win.style.right = "";
            // win.style.bottom = "";

            win.style.width = "unset";
            win.style.height = "unset";
            // win.style.left = window.getComputedStyle(par).left;
            // win.style.top = window.getComputedStyle(par).top;

            win.style.flex = "1";

            // win.style.position = "static";
            // win.style.width     = window.getComputedStyle(par).width;
            // win.style.height    = window.getComputedStyle(par).height;
            maximized = true;
        } else {
            win.style.width = origWidth;
            win.style.height = origHeight;
            win.style.left = origLeft;
            win.style.top = origTop;
            win.style.position = "absolute";
            maximized = false;
        }

    })


    document.addEventListener("mousemove", e => {
        // info.innerHTML = `
        //     width: ${window.getComputedStyle(win).width} <br>
        //     height: ${window.getComputedStyle(win.parentElement).height} <br>

        //     min-width: ${window.getComputedStyle(win).getPropertyValue("min-width")} <br>
        //     min-height: ${window.getComputedStyle(win).minHeight} <br>
        // `

        winDrag.drag = !winResize.resizing;

        let direction = ""
        if (cursorElement == win || !cursorElement) {
            const edge = mouseOnEdge(e, win);
            if (edge.includes("top")) direction += "n";
            if (edge.includes("bottom")) direction += "s";
            if (edge.includes("left")) direction += "w";
            if (edge.includes("right")) direction += "e";

            direction = direction ? direction + "-resize" : "";
            // direction = direction ? "cell" : "";
            if (!winResize.resizing) {
                if (direction != "") cursorElement = win;
                else cursorElement = null;
                document.body.style.cursor = direction;
            }
            else {
                cursorElement = null;
            }
        }
    })
});





document.body.querySelectorAll(".window-content")
    .forEach(container => {
        const main = container.querySelector(".window-content-main");
        const scroll = container.querySelector(".window-content-scroll");
        const bar = scroll.firstElementChild;
            makeScrollable(main, scroll, bar);
    })



window.addEventListener("resize", e => {
    console.log("hello")
})