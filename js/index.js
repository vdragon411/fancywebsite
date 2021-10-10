import util from "./util.js"

/*

Windows
- Taskbar
- - StartMenu
- - Cortana
- - Task Icons
- - System Tray
- - DateTime
- - Notif Center
- - Minimize
- Desktop Icons

Mac
- TopBar
- - Apple Menu
- - App Name
- - Global Menu
- - System Tray
- - DateTime
- - SideBar
- Dock
- - Finder
- - Task Icons
- Desktop Icons

*/


function properties(that) {
    let syncFuncs = [];
    let props = new Proxy(that, {
        set(obj, prop, value) {
            obj[prop] = value;
            syncFuncs.forEach(f => f());
            return true;
        },
        get(obj, prop) {
            if (prop == "sync") {
                return {
                    add(f) {
                        syncFuncs.push(f);
                    },
                    remove(f) {
                        syncFuncs.splice(syncFuncs.indexOf(f), 1);
                    }
                }
            }
            return obj[prop];
        }
    })
    return props;
}

class Elem {
    constructor(tag, classes) {
        this.build(tag);
        if (classes != null) this.elem.className = classes;
        this.props = properties(this);
        this.children = [];
    }
    build(tag) {
        if (typeof tag == "string") {
            if (tag[0] == '.')
                this.elem = document.querySelector(tag);
            else
                this.elem = document.createElement(tag);
        } else {
            this.elem = tag;
        }
        return this;
    }
    setup(f) {
        f(this);
        return this;
    }
    add(...children) {
        children.forEach(c => {
            this.elem.appendChild(c.elem);
            if (this.children.includes(c)) {
                this.children.splice(this.children.indexOf(c));
            }
            this.children.push(c);
        })
        return this;
    }
    remove(...children) {
        children.forEach(c => {
            this.elem.removeChild(c.elem);
            this.children.splice(this.children.indexOf(c));
        })
        return this;
    }

    animate(name, reverse) {
        return new Promise((resolve, reject) => {
            this.elem.style.animation = "none";
            this.elem.offsetHeight;
            this.elem.style.animation = name + " 0.5s ease forwards";
            if (reverse)
                this.elem.style.animationDirection = "reverse";
            this.elem.addEventListener("animationend", e => {
                resolve();
            }, { once: true })
        });
    }
}


class App extends Elem {
    constructor() {
        function spread(...elems) {
            return {
                setup(func) {
                    func(...elems);
                    return elems;
                }
            }
        }
        super(".app").add(
            ...spread(
                new Elem("div", "win wallpaper"),
                new Elem("div", "panel-mgr").add(
                    new Elem("div", "win panel blur").add(
                        new Elem("div", "icon"),
                        new Elem("div", "icon"),
                        new Elem("div", "icon"),
                        new Elem("div", "icon"),
                        new Elem("div", "icon"),
                        new Elem("div", "icon"),
                        new Elem("div", "icon"),
                        new Elem("div", "icon"),
                        new Elem("div", "icon"),
                        new Elem("div", "icon"),
                        new Elem("div", "icon"),
                        new Elem("div", "icon"),
                    )
                )
            ).setup((wallpaper, panelMgr) => {
                const panel = panelMgr.children[0];
                panel.elem.addEventListener("click", e => {
                    wallpaper.animate("fadeOut").then(() => {
                        wallpaper.elem.classList.toggle("win");
                        wallpaper.elem.classList.toggle("mac");
                        wallpaper.animate("fadeIn");
                    })
                    panel.animate("slideOutDown").then(() => {
                        panel.elem.classList.toggle("win");
                        panel.elem.classList.toggle("mac");
                        panel.animate("slideInUp");
                    })
                });
            })
        );

        const displayHello = _ => {
            console.log(this.msg);
            this.props.sync.remove(displayHello)
        }

        this.props.sync.add(displayHello)

        this.props.msg = "hello";
        this.props.msg = "hello";
        this.props.msg = "hello";
        this.props.msg = "hello";
        this.props.msg = "hello";
        this.props.msg = "hello";
    }
}

new App();
