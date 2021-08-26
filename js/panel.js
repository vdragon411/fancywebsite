import { Elem, Tag } from "./elem.js";
import Utils from "./utils.js";
import Icons from "./icons.js";


class Icon extends Elem {
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


class Spacer extends Elem {
    constructor() {
        super('div', ['spacer']);
    }
}


class StartMenu extends Elem {
    constructor() {
        super('div', ["menu", 'blur']);
        this.style.minWidth = "648px";
        this.style.minHeight = "600px";
        // this.style.backgroundColor = 'Red';
        this.style.color = "white";
        this.style.position = "absolute";
        this.style.userSelect = 'none';

//         this.elem.before(Tag.div().setup(blurBG => {
//             blurBG.style.content = "a";
//             blurBG.style.position = "absolute";
//             blurBG.style.width = "100%";
//             blurBG.style.height = "100%"
//             // blurBG.style.filter = "blur(8px)";position: fixed;
// //   left: 0;
// //   right: 0;
// //   z-index: -1;
//             blurBG.style.left = "0";
//             blurBG.style.right = "0";
//             blurBG.style.zIndex = "-1";
//             blurBG.style.backgroundColor = 'red';
//         }).elem);
        // this.style.opacity = "0.5";
        this.style.display = "flex";

        this.add(
            Tag.div().setup(that => {
                // that.style.backgroundColor = "black";
                that.style.flexBasis = "48px";
                that.style.flexDirection = "column";
                that.style.display = "flex";
                that.add(
                    new Icon(Icons.win.logo, ["panel-button", "hoverable"]),
                    new Spacer(),
                    new Icon(Icons.win.logo, ["panel-button", "hoverable"]),
                    new Icon(Icons.win.logo, ["panel-button", "hoverable"]),
                    new Icon(Icons.win.logo, ["panel-button", "hoverable"]),
                )
            }),
            Tag.div().setup(that => {
                // that.style.backgroundColor = "green";
                // that.style.flex = "1";
                that.style.flexBasis = (48*5)+"px";
                that.style.overflowY = "scroll";
                that.style.flexDirection = "column";
                // that.style.backgroundColor = "black";
                that.style.height = "600px";
                let addItem = () => Tag.div("panel-button", "hoverable").setup(item => {
                    item.style.display = "flex";
                    // item.style.backgroundColor = "black";
                    item.style.setProperty("--size", "32px");
                    item.add(
                        Tag.div().setup(metaIcon => {
                            metaIcon.add(
                                new Icon(Icons.win.logo, ["panel-button"]).setup(icon => {
                                    icon.style.backgroundColor = "#0378d4"
                                    // icon.style.setProperty("--scale", "0.4");
                                    icon.style.margin = "4px";
                                })
                            )
                        }),
                        Tag.div().setup(metaSpan => {
                            metaSpan.style.display = "flex";
                            metaSpan.style.alignItems = "center";
                            metaSpan.add(
                                Tag.span().setup(span => {
                                    span.elem.innerText = "Test";
                                })
                            )
                        })
                    )
                });

                let addText = (text) => Tag.div("panel-button", "hoverable").setup(metaSpan => {
                    metaSpan.style.display = "flex";
                    metaSpan.style.alignItems = "center";
                    // metaSpan.style.backgroundColor = "black";
                    metaSpan.add(
                        Tag.span().setup(span => {
                            span.elem.innerText = text;
                            span.style.padding = "10px";
                        }),
                    )
                });

                that.add(
                    addText("Most Used"),
                    addItem(),
                )
                for(let i =0; i<26; i++) {
                    that.add(addText(String.fromCharCode(65+i)));
                    that.add(addItem());
                    that.add(addItem());
                    that.add(addItem());
                }
            }),
            Tag.div().setup(that => {
                // that.style.backgroundColor = "blue";
                that.style.flex = "1";
                // that.style.flexBasis = "48px";
            })
        )
    }
}

class PanelButton extends Icon {
    static props = Elem.createProps(PanelButton).setup(props => {
        document.body.addEventListener("click", e => {
            props.syncAll();
        });
    })
    constructor(panel, path = Icons.win.logo) {
        super(path, ["panel-button", "hoverable"]);
        this.elem.onclick = e => this.onclick(e);
        this.panel = panel;

        this.menu = new StartMenu();
        // this.menu.style.display = "none";
        this.add(this.menu);
        this.menu.hide();
        this.menu.elem.onclick = e => {
            e.stopPropagation();
        }

        PanelButton.props.sync = () => {
            this.disable();
        }
    }
    onclick(e) {
        e.stopPropagation();
        if (this.enabled) {
            this.disable()
        } else {
            this.enable();
        }
    }
    enable() {
        this.enabled = true;
        this.menu.show();
        this.update();
        this.addClass("hover");
    }
    disable() {
        this.enabled = false;
        this.menu.hide();
        this.removeClass("hover");
    }
    update() {
        if (this.panel)
        Utils.positionMenu(this, this.menu, {
            center: true,
            horizontal: (
                this.panel.props.orientation == "top" ||
                this.panel.props.orientation == "bottom"
            ),
        });
    }
}


export default class Panel extends Elem {
    constructor(classes = []) {
        super("div", ["panel", "blur"].concat(classes)).add(
            new PanelButton(this),
            new PanelButton(this),
            new PanelButton(this),
            new Spacer(),
            new PanelButton(this),
            new PanelButton(this),
        );

        this.props.sync = () => {
            this.setOrientation(this.props.orientation);
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