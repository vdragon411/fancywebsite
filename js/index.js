"use strict";


class Elem {
    constructor(tag, classes) {
        this.elem = document.createElement(tag);
        this.addClass(...classes);
        this.elem.obj = this;
        this.vars = {};
        document.addEventListener('DOMContentLoaded', function () {
            this.refreshVars();
            this.init();
            // this.update();
        }.bind(this), false);
    }
    init() {
    }
    update() {
    }
    refreshVars() {
        for (let v in this.vars) {
            Object.defineProperty(this, v, {
                get: function () {
                    return this.vars[v];
                },
                set: function (val) {
                    this.vars[v] = val;
                    this.update();
                }
            });
        }
        this.update();
    }
    addClass(...classes) {
        this.elem.classList.add(...classes);
    }
    removeClass(...classes) {
        this.elem.classList.remove(...classes);
    }
    toggleClass(clas) {
        this.elem.classList.toggle(clas);
    }
    add(...children) {
        children.forEach(c => this.elem.appendChild(c.elem));
        return this;
    }
    remove(...children) {
        children.forEach(c => this.elem.removeChild(c.elem));
        return this;
    }
}


class Flex extends Elem {
    constructor(tag, classes) {
        super(tag, classes);
    }
    add(...children) {
        this.addClass('flex-main');
        children.forEach(c => c.addClass('flex-item'));
        return super.add(...children);
    }
    remove(...children) {
        children.forEach(c => c.removeClass('flex-item'));
        return super.remove(...children);
    }
}

class FlexIcon extends Flex {
    constructor(classes=[], imgClasses=[]) {
        super('div', ['flex-center', 'hoverable'].concat(classes)).add(
            this.iconElem = new Elem('div', ['icon', 'flex-noitem'].concat(imgClasses))
        )
        this.vars.path = "url('../assets/start-win.svg')";
    }
    init() {
        let clicked = false;
        this.elem.onclick = e => {
            if(clicked) {
                this.path = "url('../assets/start-win.svg')";
                clicked = false;
            } else {
                this.path = "unset";
                clicked = true;
            }
        }
    }
    update() {
        this.iconElem.elem.style.setProperty("--path", this.path);
    }
}

{
    let icon, iconP;
    let panel = new Flex('div', ['panel']).add(
        new FlexIcon()
    );

    document.body.appendChild(panel.elem);
}