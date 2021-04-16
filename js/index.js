"use strict";

import signal from "./signal.js";

import {Widget, animate} from "./widget.js";


class Panel extends Widget {
    constructor(classes=[]) {
        super('div', ["panel", "horizontal", "noselect", ...classes]);
        // this.setParent({elem:document.body});

        let startBtn = new PanelIconToggle("assets/start-win.svg");
        let menu = new StartMenu();
        menu.setToggle(startBtn);

        let btn = new PanelIconButton("assets/apps/chrome.svg");
        btn.whenOn = () => {
            console.log("clicky");
            startBtn.activate();
        }

        this.addChild(
            startBtn,
            btn
        );
    }
}

class PanelIcon extends Widget {
    constructor(path, classes=[], shouldHover=true) {
        super("div", [...classes]);
        if (shouldHover) this.addClass("hoverable");
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
            this.open().then(()=>{
            });
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
            if (this.elem.style.display != "none")
                this.elem.style.display = "none";

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
                if (this.elem.style.display != "")
                    this.elem.style.display = "";
                this.elem.style.display = "none";
            }).bind(this));
        });
    }
}


class StartMenuLeft extends Widget {
    constructor() {
        super("div", ["start-menu--left"]);

        let main = new Widget("div", ["start-menu--left__main"]);
        let icons = new Widget("div", ["start-menu--left__icons"]);
        let expand = new Widget("div", ["start-menu--left__expand"]);
        main.addChild(icons, expand);

        let icon = new PanelIcon("assets/start-win.svg", ["icon50x50"]);
        icons.addChild(icon);

        this.addChild(main);
    }
}

class StartMenuMiddle extends Widget {
    constructor()  {
        super("div",["start-menu--middle"]);
        // this.elem.style.backgroundColor = "red";

        let addItem = (iconPath, itemText) => {
            let item = new Widget("div", ["hoverable"]);
            let icon = new PanelIcon(iconPath, ["start-menu--middle__icon"], false);
            let text = new Widget("div", ["start-menu--middle__iconText"]);
            text.elem.innerText = itemText;
            item.addChild(icon);
            item.addChild(text);
            this.addChild(item);
        }
        let addText = (itemText) => {
            let item = new Widget("div", ["hoverable"]);
            let text = new Widget("div", ["start-menu--middle__text"]);
            text.elem.innerText = itemText;
            item.addChild(text);
            this.addChild(item);
        }
        addText("Recently Used");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addText("test");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
        addItem("assets/apps/chrome.svg", "Google Chrome");
    }
}

class StartMenu extends PanelMenu {
    constructor() {
        super(["start-menu"]);
        let leftDiv = new StartMenuLeft();
        let MidDiv = new StartMenuMiddle();

        this.addChild(leftDiv,MidDiv);
    }
}


document.onclick = () => {
    signal.emit('unfocus');
}
let panel = new Panel();
let desktop = document.createElement("div");
let wallpaper = new Widget('div', ["wallpaper"]);
wallpaper.elem.style.backgroundImage = "url(assets/wallpaper-win.jpg)";
desktop.appendChild(wallpaper.elem);
desktop.appendChild(panel.elem);
document.body.appendChild(desktop);