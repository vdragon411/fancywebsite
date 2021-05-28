export class Elem {
    constructor(tag, classes=[]) {
        this.elem = document.createElement(tag);
        this.addClass(...classes);
    }
    addClass(...classes) {
        classes.forEach(c => this.elem.classList.add(c));
        return this;
    }
    removeClass(...classes) {
        this.elem.classList.remove(...classes);
        return this;
    }
    add(...children) {
        children.forEach(c => this.elem.appendChild(c.elem));
        return this;
    }
    setProperty(prop, value) {
        this.elem.style.setProperty(prop, value);
        return this;
    }
}

export class Div extends Elem {
    constructor(classes=[]) {
        super('div', classes);
    }
}