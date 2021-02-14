var desktop = document.createElement("div");
desktop.classList.add("desktop");
document.body.appendChild(desktop);


function Panel(parent) {
    'use strict';
    var root = document.createElement("div");
    root.classList.add("panel", "noselect");

    // var startBtn = document.createElement("div");
    // startBtn.classList.add("panel-item", "start-btn", "hoverable");
    // root.appendChild(startBtn);

    // var startBtnIcn = document.createElement("img");
    // startBtnIcn.classList.add("relative-center", "panel-item-icon");
    // startBtnIcn.src = "assets/start-win.svg";
    // startBtn.appendChild(startBtnIcn);

    // var startMenu = document.createElement("div");
    // startMenu.classList.add("start-menu");
    // startMenu.innerHTML = `
    //     <div style="width:48px; height: 100%; background-color: red;">

    //     </div>
    //     <div style="width:300px; height: 100%; background-color: green;">

    //     </div>
    //     <div style="width:400px; height: 100%; background-color: blue;">

    //     </div>
    // `;
    // startBtn.appendChild(startMenu);

    // startBtn.onclick = function () {
    //     if (startMenu.style.display == "none") {
    //         startMenu.style.display = "flex";
    //         startBtn.classList.add("hover");
    //     } else {
    //         startMenu.style.display = "none";
    //         startBtn.classList.remove("hover");
    //     }
    // };

    var startBtn = new StartButton();
    root.appendChild(startBtn.btn);
    startBtn.btn.onclick = function () {
        startBtn.click();
    }
    console.log(startBtn.btn);

    this.elem = root;
    this.startBtn = startBtn;

    if (parent) {
        this.setParent(parent);
    }
}
Panel.prototype.setParent = function (parent) {
    parent.appendChild(this.elem);
}

var panel = new Panel(desktop);




function StartButton() {
    var btn, icon, menu;
    
    btn = document.createElement("div");
    btn.classList.add("panel-item", "start-btn", "hoverable");

    icon = document.createElement("img");
    icon.classList.add("relative-center", "panel-item-icon");
    icon.src = "assets/start-win.svg";
    btn.appendChild(icon);

    menu = document.createElement("div");
    menu.classList.add("start-menu");
    menu.innerHTML = `
        <div style="width:48px; height: 100%; background-color: red;">

        </div>
        <div style="width:300px; height: 100%; background-color: green;">

        </div>
        <div style="width:400px; height: 100%; background-color: blue;">

        </div>
    `;
    btn.appendChild(menu);

    this.btn = btn;
    this.icon = icon;
    this.menu = menu;
}

StartButton.prototype.hoverIn = function() {
    this.btn.classList.add("hover");   
}
StartButton.prototype.hoverOut = function() {
    this.btn.classList.remove("hover");   
}
StartButton.prototype.openMenu = function() {
    this.hoverIn();
    this.menu.style.display = "flex";
}
StartButton.prototype.closeMenu = function() {
    this.hoverOut();
    this.menu.style.display = "none";
}
StartButton.prototype.click = function() {
    console.log("aaa");
    if (this.menu.style.display === "none") {
        this.openMenu();
    } else {
        this.closeMenu();
    }
}