"use strict"
// import Desktop from "./desktop.js";
import {Elem, Tag} from "./elem.js";
import Utils from "./utils.js";

document.body.appendChild(
    // new Desktop().add(
    // ).elem
    Tag.div("box", "expand").setup(boxRef => {
        boxRef.style.backgroundImage = "url(../assets/wallpaper-apple.jpg)";
        boxRef.style.backgroundPosition = "center";
        boxRef.elem.innerText = "Hello"
        boxRef.style.display = "flex";
        boxRef.style.flexDirection = "column";

        let picked = false;
        let pickerNode = null;
        let createPanel = (msg) => Tag.div("box", "blur", "panel").setup(panelRef => {
            let offsetX = 0;
            let offsetY = 0;

            let mouseFunc = e => {
                // that.style.left = (e.clientX - offsetX)+'px';
                pickerNode.style.top = (e.clientY - offsetY)+'px';
            }

            panelRef.elem.onmousedown = e => {
                if (picked) return
                picked = true
                pickerNode.style.display = "";
                pickerNode.elem = panelRef.elem.cloneNode(true);
                pickerNode.style.width = panelRef.getStyle().width;
                pickerNode.style.height = panelRef.getStyle().height;
                pickerNode.style.position =　"absolute"
                pickerNode.style.left = panelRef.style.left;
                pickerNode.style.top = panelRef.style.top;

                offsetX = e.clientX - panelRef.elem.getBoundingClientRect().left;
                offsetY = e.clientY - panelRef.elem.getBoundingClientRect().top;
                mouseFunc(e);

                console.log({offsetX, offsetY})

                document.addEventListener("mousemove", mouseFunc)
            }
            panelRef.elem.onmouseup = e => {
                if (!picked) return
                picked = false
                // pickerNode.style.display = "None";
                document.removeEventListener("mousemove", mouseFunc)
                pickerNode.style.left = ""
                pickerNode.style.top = ""
                pickerNode.style.width = "";
                pickerNode.style.height = "";
                pickerNode.style.position = "";
            }
            panelRef.elem.innerText = msg
        })

        pickerNode = createPanel("");
        // pickerNode.style.display = "None";

        boxRef.add(createPanel("1"));
        boxRef.add(createPanel("2"));
        boxRef.add(createPanel("3"));
        boxRef.add(createPanel("4"));
        boxRef.add(pickerNode);
    }).elem
)