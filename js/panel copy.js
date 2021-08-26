import { Elem, Tag } from "./elem.js";
import Utils from "./utils.js";
import Icons from "./icons.js";

class PanelWidget extends Elem {
    constructor(tag, classes) {
        super(tag, classes);


    }
}

class Icon extends PanelWidget {
    constructor(path, classes = [], imgclasses = []) {
        super("div", ["panel-icon"].concat(classes)).add(
            this.icon = new Elem('div', ["icon"].concat(imgclasses))
        );
        this.path = path;
    }
    setPath(url) {
        this.path = url;
        return this;
    }
    set path(url) {
        if (url) {
            this.style.setProperty("--path", url);
            this._path = url;
        }
    }
    get path() {
        return this._path;
    }
}



class DateTime extends PanelWidget {
    constructor() {
        super("div", ["date", "hoverable"]).add(
            this.timeText = Tag.span(),
            this.dateText = Tag.span()
        )
        this.style.display = "flex";
        this.style.alignItems = "center";
        this.style.justifyContent = "center";
        this.style.flexDirection = "column";
        this.style.color = "white";
        this.style.padding = "4px 10px";
        this.timeText.style.paddingBottom = "4px";
        // this.style.minHeight = "64px";

        setInterval(this.updateTime.bind(this), 1000);
        this.updateTime();
    }
    updateTime() {
        this.timeText.elem.innerHTML = Utils.getTime();
        this.dateText.elem.innerHTML = Utils.getDate();
    }
}

class Spacer extends PanelWidget {
    constructor() {
        super();
        this.style.margin = "auto";
    }
}

class ShowDesktop extends PanelWidget {
    constructor() {
        super("div", ["hoverable"]);
        this.style.minWidth = "unset";
        this.style.minHeight = "unset";
        this.style.flexBasis = "10px";
        this.style.border = "1px dotted white";
    }
}

class PanelButton extends Icon {
    constructor(path) {
        super(path, ["hoverable"]);
        this.style.minWidth = "var(--size)";
    }
    onclick() {}
    
}


export default class Panel extends Elem {
    constructor(classes = []) {
        super("div", ["panel"].concat(classes)).add(
            new PanelButton(Icons.win.logo),
            new Spacer(),
            new PanelButton(Icons.win.logo).config(that => {
                that.style.position = "relative";
                let menu = Tag.div();
                menu.style.minWidth = "200px";
                menu.style.minHeight = "300px";
                menu.style.backgroundColor = 'Red';
                menu.style.position = "absolute";
                menu.style.opacity = "0.5";
                menu.style.display = "none";

                that.add(menu);
                that.elem.onclick = e => {
                    console.log("Hello");
                    menu.style.display = menu.style.display == "flex" ? "none" : "flex";

                    Utils.positionMenu(that, menu, {
                        center: true,
                        horizontal: (
                            that.getStyle().getPropertyValue("--orientation") == "top" ||
                            that.getStyle().getPropertyValue("--orientation") == "bottom"
                        ),
                    });
                }
            }),
            new Spacer(),
            new PanelButton(Icons.win.arrowUp).config(that => {
                that.style.minWidth = "";
            }),
            new DateTime(),
            new PanelButton(Icons.win.taskView).config(that => {
                that.icon.setProperties({ filter: "invert(100)" })
                that.onmousedown = e => {
                    console.log("it works!")
                }
                that.onmouseup = e => {
                    console.log("it works!")
                }
            }),
            this.showDesktop = new ShowDesktop(),

            /* Win
                StartButton         -> Popup
                Search              -> Popup
                Cortana             -> Popup
                TaskView            -> Popup
                AppIcons            -> Popup
                Spacer
                SystemTray          -> Popup
                DateTime            -> Popup
                NotifcationCenter
                ShowDesktop
             */
            /*
                AppIcons
                RecentApps
                FileFolder
                Trash
            */
            /*
                AppleMenu
                AppMenu
                SystemTray
                OpenSpotlight
                NotificationCenter
            */
        );
        // this.style.backgroundColor = "#222";
        // this.elem.draggable = true;
        this.elem.ondragstart = e => {
            Panel.dragPanel = this;
            e.dataTransfer.setDragImage(new Image(), 0, 0)
        }
        function animate(element, animation) {
            return new Promise((resolve, reject) => {
                element.addClass('animate__animated', 'animate__' + animation);
                element.elem.addEventListener("animationend", () => {
                    element.removeClass('animate__animated', 'animate__' + animation);
                    void element.elem.offsetWidth;
                    resolve();
                }, { once: true });
            });
        }
        function animate2(elem, anim, duration, persist) {
            return {
                start: function () {
                    return new Promise((resolve, reject) => {
                        elem.style.animationDuration = duration || "0.5s";
                        elem.style.animationFillMode = persist || "forwards";
                        elem.style.animationName = "";
                        elem.offsetHeight;
                        elem.style.animationName = anim || "visible";
                        elem.addEventListener("animationend", () => {
                            resolve();
                            elem.style.animationDirection = "";
                        }, { once: true });
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

        this.elem.ondragover = e => {
            if (Panel.dragPanel) {
                if (Panel.dragPanel != this) {
                    if (this.elem == this.elem.parentElement.firstElementChild) {
                        this.elem.parentElement.insertBefore(Panel.dragPanel.elem, this.elem)
                        animate(Panel.dragPanel, 'slideInDown')
                        animate(this, 'slideInUp');
                        Panel.dragPanel = null;
                    } else if (this.elem.nextElementSibling == Panel.dragPanel.elem) {
                        let that = this;
                        this.elem.parentElement.insertBefore(Panel.dragPanel.elem, this.elem)
                        // this.elem.previousElementSibling.insertAdjacentElement("afterend", Panel.dragPanel.elem)
                        animate(this, 'slideInUp');
                        animate(Panel.dragPanel, 'slideInDown')
                        Panel.dragPanel = null;
                    } else {
                        this.elem.insertAdjacentElement("afterend", Panel.dragPanel.elem)
                        animate(Panel.dragPanel, 'slideInUp')
                        animate(this, 'slideInDown')
                        Panel.dragPanel = null;
                    }

                }
            }
        }
    }

    setOrientation(orientation) {
        this.style.setProperty("--orientation", orientation);
    }

    vertical() {
        this.style.flexDirection = "column"
        let size = this.getStyle().getPropertyValue("--size");
        console.log({ size });
        this.style.setProperty("--size", `calc(${size} * 1.1)`);
        this.style.height = "100%";
    }
    horizontal() {
        this.style.flexDirection = "row"
        this.style.setProperty("--size", "");
        this.style.setProperty("--padding", "");
        this.style.height = "";
    }
}