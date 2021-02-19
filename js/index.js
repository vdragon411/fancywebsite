function inherit (derived, base) {
    derived.prototype = Object.create(base.prototype);
    derived.prototype.constructor = derived;
}

function Widget (tag = "div") {
    this.elem = document.createElement(tag);
}
Widget.prototype.addChild = function (child) {
    this.elem.appendChild(child.elem);
}
Widget.prototype.addClass = function (...classes) {
    this.elem.classList.add(...classes);
}
Widget.prototype.setParent = function (parent) {
    parent.appendChild(this.elem);
}
Widget.prototype.fireEvent = function (name, obj) {
    var event = new CustomEvent(name, {
        detail: obj
    });
    this.elem.dispatchEvent(event);
}


function Panel () {
    Widget.call(this);
    this.addClass("panel", "horizontal");
    this.setParent(document.body);

    var btn = new PanelButton();
    this.addChild(btn);

    var elems = new Array();
    elems.push(btn);
    var activeElems = new Array();

    this.elem.onclick = (function () {
        activeElems.forEach(function(elem) {
            elem.fireEvent("unfocus", {});
        })
    }).bind(this);

}; inherit(Panel, Widget);

function PanelButton () {
    Widget.call(this);
    this.addClass("hoverable");

    var icon = new Widget("img");
    icon.elem.src = "assets/start-win.svg";
    icon.addClass("relative-center");
    this.addChild(icon);
    this.icon = icon;

    // this.elem.onclick = this.onclick.bind(this);
    this.elem.addEventListener("unfocus", (function () {
        this.highlightOff();
    }).bind(this));
}; inherit(PanelButton, Widget);
PanelButton.prototype.onclick = function () {
    if (this.clicked) {
        console.log("unclicked");
        this.highlightOff();
        this.clicked = false;
    } else {
        console.log("clicked");
        this.highlightOn();
        this.clicked = true;
    }
}
PanelButton.prototype.highlightOn = function () {
    this.elem.classList.add("hover");
}
PanelButton.prototype.highlightOff = function () {
    this.elem.classList.remove("hover");
}

// function StartMenu () {
//     Widget.call(this);
//     this.addClass
// }

var panel = new Panel();