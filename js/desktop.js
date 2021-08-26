import {Elem, Tag} from "./elem.js";
import Panel from "./panel.js";


export default
class Desktop extends Elem {
    constructor() {
        super("div", ["desktop"]);

        class Side extends Elem {
            constructor(name, classes=[]) {
                super("div", ['panel-side'].concat(classes));
                this.name = name;
                // this.style.display = "flex";
                this.addClass(name);
            }
            insertAt(child, index=-1) {
                if (index > this.elem.children.length || index < 0) {
                    this.add(child);
                } else {
                    this.elem.insertBefore(child.elem, this.elem.children[this.elem.children.length-index]);
                }
                // child.style.setProperty("--orientation", this.name);
                child.props.orientation = this.name;
                if (this.name == "left" || this.name == "right") {
                    if(child.vertical) child.vertical();
                } else {
                    if(child.horizontal) child.horizontal();
                }
            }
            static Left() { return new Side("left") }
            static Right() { return new Side("right") }
            static Bottom() { return new Side("bottom") }
            static Top() { return new Side("top") }
        }

        const left      = Side.Left();
        const right     = Side.Right();
        const bottom       = Side.Bottom();
        const top   = Side.Top();
        const main = Tag.div();
        const mid = Tag.div();

        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;

        

        this.add(
            top,
            mid.add(
                left, main, right
            ),
            bottom,
        )

        this.style.width = "100vw";
        this.style.height = "100vh";
        this.style.display = "flex";
        this.style.flexDirection = "column";

        mid.style.flex = "1";
        mid.style.display = "flex";
        mid.style.flexDirection = "row";

        main.style.flex = "1";

        class PanelManager {
            constructor(desktop) {
                this.panels = {
                    top: [],
                    bottom: [],
                    left: [],
                    right: []
                };

                this.top = desktop.top;
                this.bottom = desktop.bottom;
                this.left = desktop.left;
                this.right = desktop.right;
            }
            addPanel(side, panel, index = -1) {
                // console.log({side})
                // this.panels[side].push(panel);
                side.insertAt(panel, index);
            }
        }

        const pmgr = new PanelManager(this);


        const panel = new Panel();


        window.addEventListener("load", e => {
            pmgr.addPanel(bottom, panel, 0);
        })
    }
}