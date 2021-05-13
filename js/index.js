class Element {
    constructor(tag, ...classes) {
        this.elem = document.createElement(tag);
        this.elem.classList.add(...classes);
    }

    addChildElem(child) {
        this.elem.appendChild(child);
    }
    addChild(child) {
        this.addChildElem(child.elem);
    }
    setParentElem(parent) {
        parent.appendChild(this.elem);
    }
    setParent(parent) {
        this.setParentElem(parent.elem);
    }


}

class Div extends Element {
    constructor(...classes) {
        super('div', ...classes);
    }
}

class Img extends Element {
    constructor(url, ...classes) {
        super('img', ...classes);
        this.elem.src = url;
    }
}


// let panel = new Div('panel');
// let panel_icon = new Div('panel-item', 'panel-icon');
// let panel_icon_img = new Img('assets/start-win.svg', 'relative-center');

class PanelIcon extends Div {
    constructor(url, ...classes) {
        super('panel-icon', ...classes);

        let img = new Img(url, 'relative-center');
        this.addChild(img);
    }
}

class Panel extends Div {
    constructor() {
        super('panel', "bottom");

        let addIcon = (func) => {
            this.test = new PanelIcon("assets/start-win.svg", "hoverable");
            this.addChild(this.test);

            this.test.elem.onclick = func;
        }
        let resetAlignment = _ => {
            this.elem.classList.remove("bottom");
            this.elem.classList.remove("left");
            this.elem.classList.remove("top");
            this.elem.classList.remove("right");
        }
        addIcon( () => {
            resetAlignment();
            this.elem.classList.add("left");
        });
        addIcon( () => {
            resetAlignment();
            this.elem.classList.add("bottom");
        });
        addIcon( () => {
            resetAlignment();
            this.elem.classList.add("top");
        });
        addIcon( () => {
            resetAlignment();
            this.elem.classList.add("right");
        });
    }
}

class Desktop extends Div {
    constructor() {
        super('desktop');
        this.setParentElem(document.body);

        let panel = new Panel();
        this.addChild(panel);
    }
}

let desktop = new Desktop();