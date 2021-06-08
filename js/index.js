import {Elem, Div} from "./elem.js"
import {Flex, FlexDiv} from "./flex.js"

class Icon extends Flex {
    constructor(iconType='div', classes=[], imgClasses=[]) {
        super('div', classes.concat(['flex-center'])).add(
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
            new Icon('div', ['hoverable']).path("../assets/start-win.svg")
                .setProperty('--scale', '0.4'),

            new FlexDiv(['cortana', 'flex-noitem']).add(
                new FlexDiv(['circleIcon','flex-center', 'hoverable']).add(
                    new Div(['circle']),
                ),
                this.text = new Elem('textarea', ['flex-noitem']),
                new Icon('div', ['flex-noitem', 'mic']).path("../assets/mic.png")
            ),

            new Icon('div', ['hoverable'], ['invert']).path("../assets/task-view.png")
                .setProperty('--scale', '0.4'),
            
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
        super(['flex-noitem']);
        // this.setProperty('flex', '1');
        this.icons = [  ];

        let selected = null;
        
        let picker = new Icon('div', []).path('');
        this.add(picker, this.endIcon = new Icon().path(''));

        picker.elem.style.position = 'absolute';
        picker.elem.style.height = "100%";
        picker.elem.style.pointerEvents = "none";

        let offset = picker.getWidth()/2;
        document.addEventListener('DOMContentLoaded', function() {
            offset = picker.getWidth()/2;
        });

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



        this.elem.onmousemove = e => {
            picker.setLeft((e.x - offset));

            if (selected ) {
                let px = picker.getLeft() + picker.getWidth()/2;
                let sxMin = selected.getLeft();
                let sxMax = selected.getLeft() + selected.getWidth();
                let index = this.icons.indexOf(selected);

                let switchIcon = (direction, anim, after) => {
                    console.log(direction,anim);
                    let nextIcon = this.icons[index + direction];

                    let temp = this.icons[index];
                    this.icons[index] = this.icons[index +  direction];
                    this.icons[index + direction] = temp;

                    nextIcon.removeClass('hoverable');
                    animate(nextIcon, anim ).then(() => {
                        nextIcon.addClass('hoverable');
                    });
                    nextIcon.elem[after](selected.elem);
                };
                if (px > sxMax) {
                    if(index >= 0 && index < this.icons.length - 1) {
                        switchIcon(1, 'slideInRight', 'after');
                    }
                }
                else if (px < sxMin) {
                    if(index >= 1 && index < this.icons.length) {
                        switchIcon(-1, 'slideInLeft', 'before');
                    }
                }
            }
        }


        this.addIcon("../assets/apps/chrome.svg");
        this.addIcon("../assets/apps/chromium.png");
        this.addIcon("../assets/apps/explorer.png");
        this.addIcon("../assets/apps/notepad.png");
        this.addIcon("../assets/apps/softwarecenter.png");

        this.elem.onmouseleave = 
        this.elem.onmouseup = e => {
            if (selected) {
                selected.path(picker.currentPath);
                selected.addClass('hoverable');
                selected = null;

                picker.path('');
                picker.removeClass('hover');
            }
        }

        this.icons.forEach(i => {
            i.elem.onmousedown = e => {
                picker.path(i.currentPath);
                picker.addClass('hover');
                selected = i;
                i.path("");
                i.removeClass('hoverable');

                offset = e.x - i.getLeft();
                picker.setLeft(e.x - offset);
            }
        });
    }

    isVertical() {
        return window.getComputedStyle(this.elem).flexDirection == "column";
    }
    addIcon(iconPath) {
        this.icons.push(
            new Icon('div', ['hoverable']).path(iconPath)
            .setProperty('animation-duration', '0.3s')
        );
        this.icons.forEach(i => this.endIcon.elem.before(i.elem));
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
