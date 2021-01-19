function createElement(tag, elemClass) {
    let div = document.createElement(tag);
    div.classList.add(elemClass);
    return div;
}

function Window(width, height, color) {
    let titlebarHeight = 20;
    let offsetX = 0;
    let offsetY = 0;

    let windowDiv = document.createElement('div');
    windowDiv.classList.add("window");
    document.body.appendChild(windowDiv);

    let titlebarDiv= document.createElement('div');
    titlebarDiv.classList.add("titlebar");
    titlebarDiv.classList.add("noselect");
    windowDiv.appendChild(titlebarDiv);

    let controlButtonsDiv = document.createElement('div');
    let closeDiv = document.createElement('div');
    let minimizeDiv = document.createElement('div');
    let maximizeDiv = document.createElement('div');

    controlButtonsDiv.classList.add('controlButtons');
    closeDiv.classList.add('close');
    minimizeDiv.classList.add('minimize');
    maximizeDiv.classList.add('maximize');

    controlButtonsDiv.appendChild(closeDiv);
    controlButtonsDiv.appendChild(maximizeDiv);
    controlButtonsDiv.appendChild(minimizeDiv);
    titlebarDiv.appendChild(controlButtonsDiv);

    let windowBodyDiv = document.createElement('div');
    windowBodyDiv.classList.add('windowBody');
    windowDiv.appendChild(windowBodyDiv);


    this.mainBody = windowBodyDiv;



    titlebarDiv.onmousedown = ev => {
        let compStyle = window.getComputedStyle(windowDiv);
        let px = parseFloat(compStyle.getPropertyValue('left'));
        let py = parseFloat(compStyle.getPropertyValue('top'));
        offsetX = ev.pageX - px;
        offsetY = ev.pageY - py;

        console.log("down",px, py, offsetX, offsetY);

        document.onmousemove = ev => {
            console.log("move",px, py, offsetX, offsetY);
            windowDiv.style.left = (ev.pageX - offsetX).toString() + 'px';
            windowDiv.style.top = (ev.pageY - offsetY).toString() + 'px';
        }
    }
    titlebarDiv.onmouseup = ev => {
        console.log("up",offsetX, offsetY);
        document.onmousemove = null;
    }

}

document.body.innerHTML = `
    <div class="desktop">
        <div class="wallpaper"> </div>
        <div class="taskbar">
            <div class="startwin"> </div>
        </div>
    </div>
`;

let win1 = new Window(400,280);


win1.mainBody.innerHTML = `
<div class="menubar, noselect">
    <div class="menu-item">File</div>
    <div class="menu-item">Edit</div>
    <div class="menu-item">Format</div>
    <div class="menu-item">View</div>
    <div class="menu-item">Help</div>
</div>
<textarea class="notepad">
At w3schools.com you will learn how to make a website. They offer free tutorials in all web development technologies.
</textarea>
`