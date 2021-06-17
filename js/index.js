import { Elem, Div } from './elem.js'


//--------------------------------------------------------------------------------------------

class Flex extends Elem {
    constructor(tag, classes) {
        super(tag, classes);
    }
    add(...children) {
        this.addClass('flex-main');
        children.forEach(c => c.addClass('flex-item'));
        return super.add(...children);
    }
    remove(...children) {
        children.forEach(c => c.removeClass('flex-item'));
        return super.remove(...children);
    }
}

class FlexDiv extends Flex {
    constructor(classes) {
        super('div', classes);
    }
}

//--------------------------------------------------------------------------------------------

class FlexIcon extends FlexDiv {
    constructor(iconType, classes = [], imgClasses = []) {
        super(['flex-center'].concat(classes)).add(
            this.icon = new Elem(
                iconType,
                ['flex-noitem', 'icon'].concat(imgClasses)
            )
        )
    }
}

//--------------------------------------------------------------------------------------------

class DateTime extends FlexDiv {
    constructor() {
        super(['hoverable', 'flex-noitem', 'flex-center']).add(
            this.date = new Elem('center', ['datetime', 'flex-noitem']),
        );

        setInterval(this.update, (60 - new Date().getSeconds()) * 1000);

        this.date.elem.innerHTML = `
        3:12 PM<br>
        17/05/21
        `;
        this.update();
    }
    update() {
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
    }
}





class Panel extends FlexDiv {
    constructor() {
        let button;
        super(['panel']).add(
            button = new FlexIcon('div', ['hoverable'], []),
            new DateTime()
        )

        button.elem.onclick = () => {
            console.log("clicked");
        }
    }
}



//--------------------------------------------------------------------------------------------


let panel = new Panel();
document.body.appendChild(panel.elem);



let testPanel = (function () {
    let container = document.createElement('div');
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.position = "absolute";
    container.style.left = '50%';
    container.style.top = '50%';
    container.style.transform = "translateX(-50%) translateY(-50%)";
    document.body.appendChild(container);
    return {
        addButton: function (name = "Unamed", onclick = () => { }) {
            let button = document.createElement('button');
            // button.type = "button";
            button.innerText = name;
            button.onclick = () => onclick();
            button.style.margin = "2px";
            button.style.width = "100px";
            container.appendChild(button);
        }
    };
})();


testPanel.addButton("panel vertical", () => {
    panel.toggleClass('vertical');
})