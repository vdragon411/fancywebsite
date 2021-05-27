
class Elem {
    constructor(tag, classes=[]) {
        this.elem = document.createElement(tag);
        this.addClass(...classes);
    }
    addClass(...classes) {
        classes.forEach(c => this.elem.classList.add(c));
        return this;
    }
    add(...children) {
        children.forEach(c => this.elem.appendChild(c.elem));
        return this;
    }
    setProperty(prop, value) {
        this.elem.style.setProperty(prop, value);
        return this;
    }
}

class Flex extends Elem {
    constructor(tag, classes=[]) {
        super(tag, classes);
    }
    add(...children) {
        this.addClass('flex-main');
        return super.add(...children.map(c => c.addClass('flex-item')));
    }
}



class Div extends Elem {
    constructor(classes=[]) {
        super('div', classes);
    }
}

class FlexDiv extends Flex {
    constructor(classes=[]) {
        super('div', classes);
    }
}


class Icon extends Flex {
    constructor(iconType, classes=[], imgClasses=[]) {
        super('div', classes.concat(['iconP', 'flex-center'])).add(
            this.sub = new Elem(iconType, imgClasses.concat(['flex-noitem','icon']))
        )
    }
    path(iconPath) {
        return this.setProperty('--path', "url("+iconPath+")");
    }
}

let panel = new FlexDiv(['panel']).add(
    new Icon('div', ['hoverable']).path("/assets/start-win.svg"),
    new FlexDiv(['cortana', 'flex-noitem']).add(
        new FlexDiv(['flex-center']).add(
            new Div(['circle']),
        ),
        this.text = new Elem('textarea', ['flex-noitem']),
        new Icon('div', ['flex-noitem', 'mic']).path("/assets/mic.png")
    ),
    new Icon('div', ['hoverable'], ['invert']).path("/assets/task-view.png"),
    new FlexDiv().add(
        new Icon('div', ['hoverable']).path("/assets/apps/chrome.svg"),
        new Icon('div', ['hoverable']).path("/assets/apps/chrome.svg"),
        new Icon('div', ['hoverable']).path("/assets/apps/chrome.svg"),
        new Icon('div', ['hoverable']).path("/assets/apps/chrome.svg"),
    ),
    this.mid = new Div(['panel-mid']),
    this.date = new Elem('center', ['datetime','hoverable', 'flex-noitem']),
    this.showdesktop = new Div(['flex-noitem', 'showdesktop', 'hoverable']),
);

this.showdesktop.elem.onclick = e => {
    panel.elem.classList.toggle('vertical');
}



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
    date.elem.innerHTML = currentTime + "<br>" + currentDate;
}, (60 - new Date().getSeconds()) * 1000);

date.elem.innerHTML = `
3:12 PM<br>
17/05/21
`;


text.elem.placeholder = 'Type to search here';
text.elem.rows = "1";

panel.elem.style.setProperty('--path', "url(/assets/wallpaper-apple.jpg)");


document.body.appendChild(panel.elem);
