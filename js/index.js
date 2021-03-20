"use strict";

import signal from "./signal.js";


class Widget { 
    constructor(tag, classes=[]) {
        this.tag = tag = tag || "div";
	classes = classes || [];
        this.elem = document.createElement(tag);
        classes.forEach(c => this.elem.classList.add(c));
        [
            "onclick",
            "onmouseover",
            "onmousedown",
	    ].forEach(f => {
            if (this[f]) this.elem[f] = this[f].bind(this);
        });
    }
    addClass(...classes) {
        this.elem.classList.add(...classes);
    }
    addChild(child) {
        this.elem.appendChild(child.elem);
    }
    setParent(parent) {
        parent.elem.appendChild(this.elem);
    }
}

class Panel extends Widget {
    constructor() {
        super('div', ["panel", "horizontal", "noselect"]);
        this.setParent({elem:document.body});

        let btn = new PanelButton();
        this.addChild(btn);

        let btn2 = new PanelButton();
        this.addChild(btn2);
    }
}

class PanelButton extends Widget {
    constructor() {
        super('div', ["hoverable"]);
        let btn = new Widget("img" ,["relative-center"]);
        btn.elem.src = "assets/start-win.svg";
        this.addChild(btn);
        this.btn = btn;

        let menu = new PanelMenu();
        this.addChild(menu);
        this.menu = menu;
    }
    onclick(e) {
        e.stopPropagation();
        if (!this.clicked) {
            this.activate();
        } else {
            this.deactivate();
        }
    }
    activate() {
        this.clicked = true;
        this.elem.classList.add("hover");

        this.menu.open();

        let widget = this;
        signal.subscribe("unfocus", () => {
            widget.deactivate();
        });
    }
    deactivate() {
        this.clicked = false;

        let elem = this.elem;
        this.elem.classList.remove("hoverable");
        this.menu.close().then( _ => {
            this.elem.classList.add("hoverable");   
        });
        this.elem.classList.remove("hover");

    }
}

class PanelMenu extends Widget {
    constructor () {
        super('div', ["start-menu"]);
        this.displayType = this.elem.style.display;
        this.elem.style.display = "none";

        this.elem.onclick = e => e.stopPropagation();
    }
    open() {
        return new Promise( (resolve, reject) => {
            this.elem.style.display = this.displayType;
            this.elem.style.animationDuration = "0.5s";
            this.elem.style.animationFillMode = "forwards";
            this.elem.style.animationName = "visible";
            this.elem.addEventListener("animationend", () => {
                resolve();
            }, {once: true});
        });
    }
    close() {
        return new Promise( (resolve, reject) => {
            this.elem.offsetHeight;
            this.elem.style.animationDuration = "0.5s";
            this.elem.style.animationFillMode = "forwards";
            this.elem.style.animationName = "visible2";
            this.elem.addEventListener("animationend", () => {
                this.elem.style.display = "none";
                resolve();
            }, {once: true});
        });
    }
}


document.onclick = () => {
    signal.emit('unfocus');
}
let panel = new Panel();
