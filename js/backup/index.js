'use strict';

var elemBuilder = (function () {
    var elems = {
        "desktop": { classes: ["desktop"] },
        "wallpaper": { classes: ["wallpaper"] },
        "panel": {
            classes: ["panel", "taskbar", "noselect"],
            obj: {
                style: {
                    position: "absolute",
                    left: "0px",
                    bottom: "0px"
                }
            }
        },
        "startBtn": {
            classes: ["panel", "block", "hoverable", "start-btn"],
            children: [
                {
                    tag: "img",
                    classes: ["relative-center", "start-icon"],
                    obj: {
                        src: "assets/start-win.svg"
                    }
                }
            ]
        }
    };

    function buildElem(tag, classes) {
        var elem = document.createElement(tag);

        if (Array.isArray(classes)) {
            classes.forEach(function (c) {
                elem.classList.add(c);
            });
        } else {
            elem.classList.add(classes);
        }
        return elem;
    }

    function isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }
    function mergeDeep(target, ...sources) {
        if (!sources.length) {
            return target;
        }
        var source = sources.shift();

        if (isObject(target) && isObject(source)) {
            for (var key in source) {
                if (isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return mergeDeep(target, ...sources);
    }

    return {
        createElem: function (elemName) {
            var root = elems[elemName],
                rootElem, elem;

            root.tag = root.tag || "div";
            rootElem = buildElem(root.tag, root.classes);

            if (root.children) {
                root.children.forEach(function (child) {
                    child.tag = child.tag || "div";
                    elem = buildElem(child.tag, child.classes);
                    if (child.obj) {
                        mergeDeep(elem, child.obj);
                    }
                    rootElem.appendChild(elem);
                });
            }

            if (root.obj) {
                mergeDeep(rootElem, root.obj);
            }

            return rootElem;
        }
    }
})();

var desktopController = (function (elemBuilder) {
    var desktop, wallpaper, panel;

    return {
        init: function () {
            desktop = elemBuilder.createElem("desktop");
            wallpaper = elemBuilder.createElem("wallpaper");
            panel = elemBuilder.createElem("panel");
            var startBtn = elemBuilder.createElem("startBtn");

            console.log(panel);

            desktop.appendChild(wallpaper);
            desktop.appendChild(panel);
            panel.appendChild(startBtn);

            document.body.appendChild(desktop);
        },
        changeWallpaper: function (url) {
            wallpaper.style.backgroundImage = url;
        }
    }
})(elemBuilder);


desktopController.init();
desktopController.changeWallpaper("url(assets/wallpaper-win.jpg)");