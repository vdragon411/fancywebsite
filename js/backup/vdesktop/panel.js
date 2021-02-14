// var rightSeparator = createElement('div',[
//     "right-separator"
// ]);
// taskbar.appendChild(rightSeparator);


// var timeDate = createElement('div', [
//     "block", "time-date", "hoverable"
// ]);
// taskbar.appendChild(timeDate);
// var date = new Date();
// var options = {
//     hour12: true,
//     hour: '2-digit',
//     minute: '2-digit'
// };
// var currentTime = date.toLocaleTimeString([], options).toUpperCase();
// if (currentTime[0] === "0") {
//     currentTime = currentTime.slice(1);
// }
// var currentDate = date.toLocaleDateString();
// timeDate.innerHTML = "<center>"+ currentTime + "<br>" + currentDate+ "</center>";





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


function PanelButton(iconPath) {
    VElement.call(this, 'div', [
        "panel", "block", "hoverable"
    ]);
    this.icon = new VElement('img', [
        "relative-center", "taskbar-icon"
    ]);
    this.addChild(this.icon);

    if (iconPath) this.icon.elem.src = iconPath;
}
inherit(PanelButton, VElement);


function Panel() {
    var startBtn;

    VElement.call(this, 'div', [
        "panel", "taskbar", "noselect"
    ]);
    this.alignBottom();

    startBtn = new PanelButton("assets/start-win.svg");
    startBtn.addClass("start-btn");
    this.addChild(startBtn);
    startBtn.elem.onclick = function() {
        console.log("Hello");
    }
}
inherit(Panel, VElement);
Panel.prototype.alignBottom = function() {
    this.elem.style.position = "absolute";
    this.elem.style.left = "0px";
    this.elem.style.bottom = "0px";
}


