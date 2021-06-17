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
    toggleClass(klass) {
        this.elem.classList.toggle(klass);
    }
    add(...children) {
        children.forEach(c => this.elem.appendChild(c.elem));
        return this;
    }
    setProperty(prop, value) {
        this.elem.style.setProperty(prop, value);
        return this;
    }
    getProperty(prop) {
        return window.getComputedStyle(this.elem)[prop];
    }

    getComputedStyle() {
        return window.getComputedStyle(this.elem);
    }

    getWidth() {
        return this.elem.offsetWidth;
    }
    getHeight() {
        return this.elem.offsetHeight;
    }


    setLeft(val) {
        this.elem.style.left = val + 'px';
    }
    setRight(val) {
        this.elem.style.Right = val + 'px';
    }
    setTop(val) {
        this.elem.style.Top = val + 'px';
    }
    setBottom(val) {
        this.elem.style.Bottom = val + 'px';
    }
    
    getLeft(val) {
        return this.elem.offsetLeft;
    }
    getRight(val) {
        return this.elem.offsetLeft + this.getWidth();
    }
    getTop(val) {
        return this.elem.offsetTop;
    }
    getBottom(val) {
        return this.elem.offsetTop + this.getHeight();
    }
}

export class Div extends Elem {
    constructor(classes=[]) {
        super('div', classes);
    }
}