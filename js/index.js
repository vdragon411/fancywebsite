"use strict"

import Elem from "./elem.js"

import Flex, { FlexIcon } from "./flex.js"


class Button extends FlexIcon {
    constructor(classes=[], imgClasses=[]) {
        super(classes, imgClasses)

        this.elem.onclick = e => this.onclick(e);
        this.elem.onmousedown = e => this.onmousedown(e);
        this.elem.onmouseup = e => this.onmouseup(e);
    }
    onclick() {}
    onmousedown() {}
    onmouseup() {}
}

class Panel extends Flex {
    constructor(classes=[]) {
        super('div', ['panel'].concat(classes)).add(
            this.btn = new Button(['hoverable']).path("url(../assets/start-win.svg)")
        );

        this.btn.onmousedown = e => console.log('hello');
    }
}

const panel = new Panel().root();