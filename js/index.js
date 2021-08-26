"use strict"
import Desktop from "./desktop.js";
import Elem from "./elem.js";
import Utils from "./utils.js";

document.body.appendChild(
    new Desktop().add(

        // Tag.div()
        // .config(that => {
        //     that.style.border = "1px solid black";
        //     that.style.position = "absolute";
        //     that.style.pointerEvents = "none";
        //     // that.style.width = "50px";
        //     // that.style.height = "50px";

        //     let menu = Tag.div('red');
        //     menu.style.backgroundColor = "Red";
        //     menu.style.position = "fixed";
        //     menu.style.width = "200px";
        //     menu.style.height = "300px";
        //     menu.style.opacity = "0.5";
        //     menu.style.display = "none";
        //     document.body.appendChild(menu.elem);


        //     document.body.addEventListener("mousemove", e => {
        //         that.style.left = e.clientX + "px";
        //         that.style.top = e.clientY + "px";
        //     })

        //     window.oncontextmenu = function (e) {
        //         menu.style.display = menu.style.display == "none"? "block" : "none";
        //         Utils.positionMenu(that, menu, {
        //             flip: false,
        //             horizontal: false,
        //         });
        //         e.preventDefault();
        //     }
        // })

    ).elem
)