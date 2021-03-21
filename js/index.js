"use strict";

import signal from "./signal.js";

import {Widget, animate} from "./widget.js";


class Panel extends Widget {
    constructor(classes=[]) {
        super('div', ["panel", "horizontal", "noselect", ...classes]);
        this.setParent({elem:document.body});

        let startBtn = new PanelIconToggle("assets/start-win.svg");
        let menu = new StartMenu();
        menu.setToggle(startBtn);

        let btn = new PanelIconButton("assets/apps/chrome.svg");
        btn.whenOn = () => {
            console.log("clicky");
        }

        this.addChild(
            startBtn,
            btn
        );
    }
}

class PanelIcon extends Widget {
    constructor(path, classes=[]) {
        super("div", ["hoverable", ...classes]);
        let icn = new Widget("img" ,["relative-center"]);
        icn.elem.src = path;
        this.addChild(icn);
    }
}

class PanelIconToggle extends PanelIcon {
    constructor(path, classes=[]) {
        super(path, classes);
        this.whenOn = null;
        this.whenOff = null;
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

        if (this.whenOn) {
            this.whenOn();
        }
        let widget = this;
        signal.subscribe("unfocus", () => {
            widget.deactivate();
        });
    }
    deactivate() {
        this.clicked = false;

        this.elem.classList.remove("hoverable");
        if (this.whenOff) {
            this.whenOff();
        }
        this.elem.classList.remove("hover");
    }
}

class PanelIconButton extends PanelIcon {
    constructor(path, classes=[]) {
        super(path, classes);
        this.whenOn = null;
    }
    onclick(e) {
        e.stopPropagation();
        if (this.whenOn) this.whenOn();
    }
}




class PanelMenu extends Widget {
    constructor (classes = []) {
        super('div', [...classes]);
        this.elem.style.display = "none";
        this.elem.onclick = e => e.stopPropagation();
    }
    setToggle(btn) {
        btn.whenOn = () => {
            this.open();
        }
        btn.whenOff = () => {
            this.close().then(_=>{
                btn.elem.classList.add("hoverable");
            })
        }
        btn.addChild(this);
    }
    open() {
        return new Promise((resolve, reject) => {
            this.elem.style.display = "";
            animate(this.elem, "fadeInUp", "0.3s").start()
            .then(_=>{
                resolve();
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            animate(this.elem, "fadeOutDown", "0.3s").start()
            .then((() => {
                resolve();
                this.elem.style.display = "none";
            }).bind(this));
        });
    }
}

class StartMenu extends PanelMenu {
    constructor() {
        super(["start-menu"]);
    }
}


document.onclick = () => {
    signal.emit('unfocus');
}
let panel = new Panel();
