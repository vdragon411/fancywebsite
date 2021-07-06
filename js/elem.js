
export default class Elem {
    constructor(tag, classes=[]) {
        this.elem = document.createElement(tag);
        this.addClass(...classes);
    }

    addClass(...classes) {
        this.elem.classList.add(...classes);
        return this;
    }
    removeClass(...classes) {
        this.elem.classList.remove(...classes);
        return this;
    }
    add(...children) {
        children.forEach(c => {
            if (c instanceof Elem)
                this.elem.appendChild(c.elem)
            else if (typeof c == "string") {
                this.elem.appendChild(
                    document.createTextNode(c)
                )
            }
        });
        return this;
    }
    remove(...children) {
        children.forEach(c => this.elem.removeChild(c.elem));
        return this;
    }
    setProperty(name, val) {
        this.elem.style.setProperty(name, val);
        return this;
    }
    show() {
        this.elem.style.display = "";
        return this;
    }
    hide() {
        this.elem.style.display = "None";
        return this;
    }
    root() {
        document.body.appendChild(this.elem);
        return this;
    }
}


