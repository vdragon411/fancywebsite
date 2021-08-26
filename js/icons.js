let assetDir = "../assets";
let fallback = {
    logo:       "start-win.svg",
    arrowUp:    "win-uparrow.png",
    taskView:   "task-view.png"
};
let OS = {
    win: {
        logo:   "svg"
    },
    mac: {

    }
}

let Icons = (function updateIcons() {
    let icons = {};

    for (let system in OS) {
        icons[system] = {};
        for (let img in fallback) {
            Object.defineProperty(icons[system], img, {
                get: function () {
                    if (img in OS[system])
                        return `url(${assetDir}/${system}/${img}.${OS[system][img]})`;
                    else
                        return `url(${assetDir}/${fallback[img]})`;
                }
            })
        }
    }
    return icons;
})();

export default Icons;