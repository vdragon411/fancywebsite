var desktopController = (function() {

    function createElem(tag, classes) {
        var elem;
        elem = document.createElement(tag);
        if (Array.isArray(classes)) {
            classes.forEach(function(c){
                elem.classList.add(c);
            })
        } else {
            elem.classList.add(classes);
        }
        return elem;
    }

    function tag(parentTag, classes, childrenTree) {
        var parent, children;

        parent = createElem(parentTag, classes);

        if (Array.isArray(childrenTree)) {
            childrenTree.forEach(function(c) {
                parent.appendChild(c);
            });
        } else if(childrenTree) {
            parent.appendChild(childrenTree);
        }

        return parent;
    }

    return {
        init: function() {
            var desktop, wallpaper, 
                panel, 
                startBtn, startIcon, 
                taskMgr,
                cortana, cortanaBtn, cortanaIcon;

            desktop = createElem('div', 'desktop');


            wallpaper = createElem('div', "wallpaper");
            wallpaper.style.backgroundImage = "url(assets/wallpaper-win.jpg)";


            panel = createElem('div', [
                "panel", "taskbar", "noselect"
            ]);
            panel.style.position = "absolute";
            panel.style.left = "0px";
            panel.style.bottom = "0px";


            startBtn = createElem('div', [
                "panel", "block", "hoverable", "start-btn"
            ]);
            startIcon = createElem('img', [
                "relative-center", "start-icon"
            ]);
            startIcon.src = "assets/start-win.svg";
            startBtn.appendChild(startIcon);

            startBtn = tag('div', [
                "panel", "block", "hoverable", "start-btn"
            ],
                startIcon = tag('img', [
                    "relative-center", "start-icon"
                ]),
            );
            startIcon.src = "assets/start-win.svg";


            taskMgr = createElem('div', [
                "panel"
            ]);
            var appList = [
                ["assets/apps/chrome.svg",[]],
                ["assets/apps/softwarecenter.png",["softwarecenter"]],
                ["assets/apps/explorer.png",[]],
            ];
            appList.forEach(function(app) {
                var appBtn, appIcon;

                appBtn = createElem('div', [
                    "panel", "block", "hoverable","task-btn"
                ]);
                appIcon = createElem('img', [
                    "relative-center", "taskbar-icon"
                ].concat(app[1]));
                appIcon.src = app[0];
                appBtn.appendChild(appIcon);
                taskMgr.appendChild(appBtn);

                appBtn.onclick = function() {
                    appBtn.classList.toggle("task-active");
                }
            });

            cortana = createElem('input', [
                "block","cortana", 
            ]);
            cortana.placeholder = "Ask me anything";
            cortanaBtn = createElem('div', [
                "block","hoverable-light", "cortana-mic"
            ]);
            cortanaIcon = createElem('img', [
                "relative-center", "cortana-mic-icon"
            ]);
            cortanaIcon.src = "assets/mic.png";
            cortanaBtn.appendChild(cortanaIcon);


            var rightSeparator = createElem('div',[
                "right-separator"
            ]);

            var timeDate = createElem('div', [
                "block", "time-date", "hoverable"
            ]);
            var date = new Date();
            var options = {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit'
            };
            var currentTime = date.toLocaleTimeString([], options).toUpperCase();
            if (currentTime[0] === "0") {
                currentTime = currentTime.slice(1);
            }
            var currentDate = date.toLocaleDateString();
            timeDate.innerHTML = "<center>"+ currentTime + "<br>" + currentDate+ "</center>";


            var showDesktop = createElem('div', [
                "panel","block", "show-desktop", "hoverable"
            ]);


            var taskViewBtn = createElem('div', [
                "panel", "block", "hoverable", "task-view-btn"
            ]);
            var taskViewIcon = createElem('img', [
                "relative-center", "task-view-icon"
            ]);
            taskViewIcon.src = "assets/task-view.png";
            taskViewBtn.appendChild(taskViewIcon);

            var notifBtn = createElem('div', [
                "panel", "block", "hoverable", "task-view-btn"
            ]);
            var taskViewIcon = createElem('img', [
                "relative-center", "task-view-icon", "invert"
            ]);
            taskViewIcon.src = "assets/apps/win-notif.svg";
            notifBtn.appendChild(taskViewIcon);

            desktop.appendChild(wallpaper);
            desktop.appendChild(panel);
            panel.appendChild(startBtn);
            panel.appendChild(cortana);
            panel.appendChild(cortanaBtn);
            panel.appendChild(taskViewBtn);
            panel.appendChild(taskMgr);
            panel.appendChild(rightSeparator);
            panel.appendChild(timeDate);
            panel.appendChild(notifBtn);
            panel.appendChild(showDesktop);

            document.body.appendChild(desktop);
        }
    }
})();

desktopController.init();