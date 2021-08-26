export default class Utils {
    static getTime() {
        let currentTime = new Date().toLocaleTimeString([], {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit'
        }).toUpperCase();
        if (currentTime[0] === "0") currentTime = currentTime.slice(1);
        let ampm = currentTime.split(" ")[1];
        currentTime = currentTime.split(" ")[0];
        return currentTime+"&nbsp"+ampm;
    }
    static getDate() {
        let currentDate = new Date().toLocaleDateString([], {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
        return currentDate;
    }

    static positionMenu(source, menu, options) {
        let midWidth = window.innerWidth / 2;
        let midHeight = window.innerHeight / 2;
        let winWidth = window.innerWidth;
        let winHeight = window.innerHeight;
        let posRect = source.elem.getBoundingClientRect();
        let menuRect = menu.elem.getBoundingClientRect();
        let { offsetTop, offsetLeft, center, horizontal, flip } = {
            ...{
                offsetTop: 0,
                offsetLeft: 0,
                center: 1,
                horizontal: true,
                flip: true,
            }, ...options
        };

        center = center? 2 : 1;

        if (horizontal) {
            if (flip && posRect.top + offsetTop > midHeight) {
                offsetTop += -menuRect.height;
            }
            else {
                offsetTop += posRect.height;
            }
            if (flip && (posRect.left + offsetLeft > midWidth || center > 1)) {
                offsetLeft += (posRect.width - menuRect.width) / center;
            }
        } else {
            if (flip && posRect.left + offsetLeft > midWidth) {
                offsetLeft += -menuRect.width;
            } else {
                offsetLeft += posRect.width;
            }

            if (flip && (posRect.top + offsetTop > midHeight || center > 1)) {
                offsetTop += (posRect.height - menuRect.height) / center;
            }
        }

        let actualTop = posRect.top + offsetTop;
        let actualLeft = posRect.left + offsetLeft;
        let actualRight = actualLeft + menuRect.width;
        let actualBottom = actualTop + menuRect.height;

        let left = offsetLeft;
        let top = offsetTop;
        if (actualBottom > winHeight) {
            top -= actualBottom - winHeight;
        }
        if (actualTop < 0) {
            top -= actualTop;
        }
        if (actualLeft < 0) {
            left -= actualLeft;
        }
        if (actualRight > winWidth) {
            left -= actualRight - winWidth;
        }

        if (window.getComputedStyle(menu.elem.parentElement).position != "relative") {
            left += posRect.left;
            top += posRect.top;
        }

        menu.style.left =(left) + "px";
        menu.style.top = (top) + "px";
    };
    
}