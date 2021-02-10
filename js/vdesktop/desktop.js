
function inherit(derived, base) {
    derived.prototype = Object.create(base.prototype);
    derived.prototype.constructor = derived;
}

function include(file) {
    document.writeln("<script type='text/javascript' src='"+file+"'></script>");
}


function VElement(tag, classes) {
    this.elem = (function(){
        var elem;
        elem = document.createElement(tag);
        if (Array.isArray(classes)) {
            classes.forEach(function(elemClass) {
                elem.classList.add(elemClass);     
            });
        } else if (classes) {
            elem.classList.add(classes)
        }
        return elem;
    })();
}
VElement.prototype.addChild = function(child) {
    this.elem.appendChild(child.elem);
}
VElement.prototype.addClass = function(elemClass) {
    this.elem.classList.add(elemClass);
}


function Wallpaper(path) {
    VElement.call(this, 'div', [
        "wallpaper"
    ]);
    if(path) this.change(path);
}
inherit(Wallpaper, VElement);
Wallpaper.prototype.change = function(path) {
    this.elem.style.backgroundImage = "url("+path+")";
}




include("js/vdesktop/window.js");
include("js/vdesktop/panel.js");




var desktopController = (function(){
    var desktop, wallpaper, bottomPanel;




    return {
        init: function() {
            desktop = new VElement('div', 'desktop');
            wallpaper = new Wallpaper("assets/wallpaper-win.jpg");
            bottomPanel = new Panel();

            document.body.appendChild(desktop.elem);
            desktop.addChild(wallpaper);
            desktop.addChild(bottomPanel);
        },
        test: function() {
            console.log("test");
        }
    }
})();
