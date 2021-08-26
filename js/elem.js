
"use strict"
// import dom_events from "./dom_events.js";

export class Elem {
    #displayStyle;
    constructor(tag = "div", classes = []) {
        // this.elem = document.createElement(tag);
        // classes.forEach(c => this.elem.classList.add(c));
        // super(...arguments);
        this.args = [...arguments];
        this.build(true);
        this.props = Elem.createProps(this);
        this.props.sync = () => this.build(false);
    }
    update() {}

    build(rebuild) {
        let tag = this.args[0];
        let classes = this.args[1] || [];
        if (rebuild) {
            this.elem = document.createElement(tag);
            classes.forEach(c => this.elem.classList.add(c));
            this.children = this.children || [];
            let childrenB = this.children;
            this.children = []
            this.add(...childrenB);
        } else {
            let args = [...arguments];
            args.shift()
            this.children.forEach(c => {
                if (typeof c == "object")
                    c.build(false)
            });
        }
        this.style = this.elem.style;
        this.update();
    }


    add(...children) {
        children.forEach(c => this.elem.appendChild(c.elem));
        return this;
    }
    remove(...children) {
        children.forEach(c => this.elem.removeChild(c.elem));
        return this;
    }
    addClass(...classes) {
        classes.forEach(c => this.elem.classList.add(c));
    }
    removeClass(...classes) {
        classes.forEach(c => this.elem.classList.remove(c));
    }
    setProperties(propObj) {
        for (let prop in propObj) {
            this.style.setProperty(prop, propObj[prop]);
        }
        return this;
    }
    getStyle() {
        return window.getComputedStyle(this.elem);
    }
    setup(f) {
        if (f) f(this);
        return this;
    }
    show() {
        if (this.#displayStyle) {
            this.style.display = this.#displayStyle
        } else this.style.display = "block"
    }
    hide() {
        this.#displayStyle = this.style.display;
        this.style.display = "none"
    }
}



Elem.createProps = (that) => {
    let props = new Proxy(that, {
        set(obj, prop, val) {
            // if (!obj.propFuncs) obj.propFuncs = [];
            if (!obj.syncNode) obj.syncNode = new Proxy(obj, {
                get(obj, prop, val) {
                    // let res = Reflect.get(...arguments);
                    let args = arguments;
                    return new Elem('span').mod(that => {
                        obj.props.sync = that.update = () => {
                            console.log('sync get ' + prop + " ");
                            console.log(Reflect.get(...args));
                            that.elem.innerText = obj.props[prop];
                        }
                    })
                }
            });
            if (prop == "sync") {
                if (!obj.propFuncs) {
                    obj.propFuncs = []
                }
                obj.propFuncs.push(val);
                return true;
            }
            obj[prop] = val;
            obj.propFuncs.forEach(f => f());
            console.log('proxy set ' + prop);
            return true;
        },
        get(obj, prop, val) {
            console.log('proxy get ' + prop);
            if (prop == "setup") {
                return f => {f(props); return props};
                // return true;
            } else if (prop == "syncAll"){
                return f => { obj.propFuncs.forEach(f => f()); return props;}
            }
            return Reflect.get(...arguments);
        }
    });
    return props;
}

// dom_events.forEach(func => {
//     Elem.prototype[func] = function(e) {
//         console.log(this);
//         (this[func])? this[func](e) : {};
//     };
//     // e => 
// })

// console.log(Elem.prototype)

export default Elem;


export let Tag = new Proxy(Elem, {
    get(obj, prop, receiver) {
        return (...classes) => {
            return new Elem(prop, [...classes]);
        }
    }
});