import {Elem} from "./elem.js"

export class Flex extends Elem {
    constructor(tag, classes=[]) {
        super(tag, classes);
    }
    add(...children) {
        this.addClass('flex-main');
        return super.add(...children.map(c => c.addClass('flex-item')));
    }
}

export class FlexDiv extends Flex {
    constructor(classes=[]) {
        super('div', classes);
    }
}