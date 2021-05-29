import {Elem, Div} from "./elem.js"
import {Flex, FlexDiv} from "./flex.js"

class Icon extends Flex {
    constructor(iconType, classes=[], imgClasses=[]) {
        super('div', classes.concat(['iconP', 'flex-center'])).add(
            this.sub = new Elem(iconType, imgClasses.concat(['flex-noitem','icon']))
        )
    }
    path(iconPath) {
        this.currentPath = iconPath;
        return this.setProperty('--path', "url("+iconPath+")");
    }
}


class DateTime extends FlexDiv {
    constructor() {
        super(['hoverable','flex-noitem', 'flex-center']).add(
            this.date = new Elem('center', ['datetime', 'flex-noitem']),
        );

        setInterval( _ => {
            let dateObj = new Date();
            let currentTime = dateObj.toLocaleTimeString([],
                {
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit'
                }).toUpperCase();
            if (currentTime[0] === "0") {
                currentTime = currentTime.slice(1);
            }
            let currentDate = dateObj.toLocaleDateString([], {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            });
            this.date.elem.innerHTML = currentTime + "<br>" + currentDate;
        }, (60 - new Date().getSeconds()) * 1000);

        this.date.elem.innerHTML = `
        3:12 PM<br>
        17/05/21
        `;
    }
}

class Panel extends FlexDiv {
    constructor() {
        super(['panel','noselect']).add(
            new Icon('div', ['hoverable']).path("../assets/start-win.svg"),
            new FlexDiv(['cortana', 'flex-noitem']).add(
                new FlexDiv(['circleIcon','flex-center', 'hoverable']).add(
                    new Div(['circle']),
                ),
                this.text = new Elem('textarea', ['flex-noitem']),
                new Icon('div', ['flex-noitem', 'mic']).path("../assets/mic.png")
            ),
            new Icon('div', ['hoverable'], ['invert']).path("../assets/task-view.png"),
            new TaskIcons(),
            this.mid = new Div(['panel-mid']),
            new DateTime(),
            new Icon('div', ['hoverable']).path("../assets/apps/win-notif.svg"),
            this.showdesktop = new Div(['flex-noitem', 'showdesktop', 'hoverable']),
        );
        this.showdesktop.elem.onclick = e => {
            this.elem.classList.toggle('vertical');
        }

        this.text.elem.placeholder = 'Type to search here';
        this.text.elem.rows = "1";

        // this.elem.style.setProperty('--path', "url(../assets/wallpaper-apple.jpg)");
    }
}


class TaskIcons extends FlexDiv{
    constructor() {
        super(['flex-noitem']).add();

        let endIcon;

        let icons = [
            new Icon('div', ['hoverable']).path("../assets/apps/chrome.svg"),
            new Icon('div', ['hoverable']).path("../assets/apps/chromium.png"),
            new Icon('div', ['hoverable']).path("../assets/apps/chrome.svg"),
            new Icon('div', ['hoverable']).path("../assets/apps/notepad.png"),
            new Icon('div', ['hoverable']).path("../assets/apps/chrome.svg"),
            new Icon('div', ['hoverable']).path("../assets/apps/softwarecenter.png"),
            new Icon('div', ['hoverable']).path("../assets/apps/chrome.svg"),
            endIcon = new Icon('div', []).setProperty("--path","none"),
        ]
        endIcon.elem.style.flex = "1";
        // this.elem.style.position = "relative";
        this.elem.style.flex = "1";


        let picker, icon = null;
        picker = new Icon('div',[]);
        picker.setProperty("--path", "none");
        picker.elem.style.position = "absolute";
        picker.elem.style.pointerEvents = 'none';


        let isVertical = () => {
            return window.getComputedStyle(this.elem).flexDirection == "column";
        }

        let unpickIcon = () => {
            if (picker && icon) {
                icon.path(picker.currentPath);
                picker.setProperty("--path", "none");
                picker.removeClass('hover');
                icon.addClass("hoverable");
            }
            icon = null;
        }

        this.elem.onmouseleave = e => unpickIcon();
        let oldX;
        let offset = picker.elem.offsetWidth/2
        this.elem.onmousemove = e => {
            if (!isVertical()) {
                picker.elem.style.width = "unset";
                picker.elem.style.height = "100%";
                picker.elem.style.top = "unset";
                picker.elem.style.left = (e.x - offset) + "px";
                oldX = e.x;
            } else {
                picker.elem.style.minHeight = "var(--size)";
                picker.elem.style.height = "unset";
                picker.elem.style.width = "100%";
                picker.elem.style.left = "unset";
                picker.elem.style.top = (e.y - offset) + "px";
                oldX = e.y;
            }
        }

        function animate(element, animation) {
            return new Promise( (resolve, reject) => {
                element.addClass('animate__animated', 'animate__'+animation);
                element.elem.addEventListener("animationend", () => {
                    element.removeClass('animate__animated', 'animate__'+animation);
                    void element.elem.offsetWidth;
                    resolve();
                }, {once: true});
            });
        }

        
        icons.forEach(i => {
            i.elem.style.animationDuration = "0.2s";
            i.elem.onmousedown = e => {
                if (i == endIcon) return;
                icon = i;
                picker.addClass("hover");
                icon.removeClass("hoverable");

                if (!isVertical()) {
                    offset = e.x - i.elem.offsetLeft;
                    picker.elem.style.left = (e.x - offset) + "px";
                } else {
                    offset = e.y - i.elem.offsetTop;
                    picker.elem.style.top = (e.y - offset) + "px";
                }
                picker.path(icon.currentPath);
                icon.setProperty("--path", "none");
            }
            i.elem.onmouseup = e => unpickIcon();
            i.elem.onmouseover = e => {
                if (icon && i != icon) {
                    let anim = null;
                    let ex = isVertical() ? e.y : e.x;
                    if ((ex - oldX) < 0) {
                        i.removeClass("hoverable");
                        anim = (!isVertical()) ? "Left" : "Down";
                        animate(i, "slideIn"+anim).then(() => i.addClass("hoverable"))
                        i.elem.before(icon.elem);
                    } else {
                        if (i != endIcon)
                        {
                            i.removeClass("hoverable");
                            anim = (!isVertical()) ? "Right" : "Up";
                            animate(i, "slideIn"+anim).then(() => i.addClass("hoverable"))
                            i.elem.after(icon.elem);
                        }
                    }
                }
            }
        });

        this.add(picker, ...icons);
    }
}




let panel = new Panel();



document.body.appendChild(panel.elem);
// document.body.ondrag



// (function(){
//     let newTest = () => {
//         let test = new Div(['flex-noitem']);
//         test.elem.style.width = "100px";
//         test.elem.style.height = "100px";
//         test.elem.style.backgroundColor = "red";
//         return test;
//     }


//     let container = new FlexDiv();
//     container.elem.style.minWidth = "1000px";
//     container.elem.style.minHeight = "1000px";
//     container.elem.style.backgroundColor = "blue";

//     document.body.appendChild(container.elem);
//     let test = newTest();
//     test.elem.style.position = "absolute";
//     container.add(test, newTest(), newTest());

//     test.elem.onmousemove = e => {
//         test.elem.style.left = (e.x-50)+"px";
//         test.elem.style.top = (e.y-50)+"px";
//     }
// })();