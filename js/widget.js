export class Widget { 
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
    addChild(...children) {
        if (!Array.isArray(children)) {
            children = [children];
        }
        children.forEach((child)=>{
            this.elem.appendChild(child.elem);
        })
    }
    setParent(parent) {
        parent.elem.appendChild(this.elem);
    }
}

export function animate(elem, anim, duration, persist) {
    return {
        start: function()  {
            return new Promise( (resolve, reject) => {
                elem.style.animationDuration = duration || "0.5s";
                elem.style.animationFillMode = persist || "forwards";
                elem.style.animationName = "";
                elem.offsetHeight;
                elem.style.animationName = anim || "visible";
                elem.addEventListener("animationend", () => {
                    resolve();
                    elem.style.animationDirection = "";
                }, {once: true});
            });
        },
        reverse() {
            elem.style.animationDirection = "reverse";
            return animate(elem, anim, duration, persist);
        },
        duration(dur) {
            return animate(elem, anim, dur, persist);
        }
    }
}