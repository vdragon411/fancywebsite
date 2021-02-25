"use strict";

var signal = (function () {
    var signals = {};
    return {
        subscribe: function (key, func) {
            if (!signals[key]) {
                signals[key] = {};
            }

            var index = 0;
            var len = Object.keys(signals[key]).length;
            if (len > 0) {
                index = parseInt(Object.keys(signals[key])[len - 1]) + 1;
            }
            signals[key][index] = func;
            this.debugPrint();

            // var unsubscribed = false;
            return {
                unsubscribe: function () {
                    // if (!unsubscribed) {
                        delete signals[key][index];
                        console.log("unsubcribing", index);
                        // unsubscribed = true;
                    // }
                }
            }
        },
        emit: function (signal, data) {
            for (var key in signals[signal]) {
                signals[signal][key](data);
            }
            this.debugPrint();
        },
        signals: signals,
        debugPrint: function () {
            document.getElementById("debug").innerHTML = "";
            for (var signal in signals) {
                document.getElementById("debug").innerHTML += "<ul>Signal: "+signal;
                for (var idx in signals[signal]) {
                    document.getElementById("debug").innerHTML += "<li>"+idx + "</li>";
                }
                document.getElementById("debug").innerHTML += "</ul>";
            }
        }
    }
})();


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




function Panel () {
    Widget.call(this);
    this.addClass("panel", "horizontal", "noselect");
    this.setParent(document.body);

    var btn = new PanelButton();
    this.addChild(btn);
    var btn2 = new PanelButton();
    this.addChild(btn2);
    var btn3 = new PanelButton();
    this.addChild(btn3);

    btn2.elem.style.display = "none";
    btn.actionObj = btn2.elem;

    btn3.elem.style.display = "none";
    btn2.actionObj = btn3.elem;

    document.onclick = function (e) {
        signal.emit("unfocus", e.target);
    }

}; inherit(Panel, Widget);

function PanelButton () {
    var elem, icon;

    Widget.call(this);
    this.addClass("hoverable");

    icon = new Widget("img");
    icon.elem.src = "assets/start-win.svg";
    icon.addClass("relative-center");
    this.addChild(icon);

    this.elem.onclick = this.click.bind(this);
    this.clicked = false;

}; inherit(PanelButton, Widget);
PanelButton.prototype.click = function (e) {
    if (this.clicked) {
        this.close();
    } else {
        e.stopPropagation();
        this.open();
    }
}
PanelButton.prototype.open = function () {
    this.sig = signal.subscribe("unfocus", (function (d) {
        this.close();
    }).bind(this));
    this.clicked = true;
    this.highlightOn();
    if (this.actionObj) {
        this.actionObj.style.display = "block";
    }
}
PanelButton.prototype.close = function () {
    this.clicked = false;
    this.highlightOff();
    if (this.sig) this.sig.unsubscribe();
    if (this.actionObj) {
        this.actionObj.style.display = "none";
    }
}
PanelButton.prototype.highlightOn = function () {
    this.elem.classList.add("hover");
}
PanelButton.prototype.highlightOff = function () {
    this.elem.classList.remove("hover");
}

var panel = new Panel();