import Elem from "./elem.js";

export default class Flex extends Elem {
    constructor(tag, classes=[]) {
        super(tag, classes);
    }
    add(...children) {
        this.addClass('flex-main');
        children.forEach(c => {
            if (c instanceof Elem) c.addClass('flex-item')
        });
        return super.add(...children);
    }
    remove(...children) {
        children.forEach(c => {
            if (c instanceof Elem) c.removeClass('flex-item')
        });
        return super.remove(...children);
    }
}

export class FlexIcon extends Flex {
    constructor(classes=[], imgClasses=[]) {
        super('div', ['flex-center'].concat(classes)).add(
            this.icon = new Flex('div', ['icon', 'flex-noitem'].concat(imgClasses))
        )
    }
    path(name) {
        this.setProperty("--path", name);
        return this;
    }
}