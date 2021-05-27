

// function animate(element, animation) {
//     return new Promise( (resolve, reject) => {
//         element.addClass('animate__animated', 'animate__'+animation);
//         element.elem.addEventListener("animationend", () => {
//             element.removeClass('animate__animated', 'animate__'+animation);
//             void element.elem.offsetWidth;
//             resolve();
//         }, {once: true});
//     });
// }

// function animate(elem, anim, duration, persist) {
//     return {
//         start: function () {
//             return new Promise((resolve) => {
//                 elem.style.animationDuration = duration || "0.5s";
//                 elem.style.animationFillMode = persist || "forwards";
//                 elem.style.animationName = "";
//                 elem.offsetHeight;
//                 elem.style.animationName = anim || "visible";
//                 elem.addEventListener("animationend", () => {
//                     resolve();
//                     elem.style.animationDirection = "";
//                 }, { once: true });
//             });
//         },
//         reverse() {
//             elem.style.animationDirection = "reverse";
//             return animate(elem, anim, duration, persist);
//         },
//         duration(dur) {
//             return animate(elem, anim, dur, persist);
//         }
//     }
// }




// 
// setInterval( _ => {
//     let dateObj = new Date();
//     let currentTime = dateObj.toLocaleTimeString([],
//         {
//             hour12: true,
//             hour: '2-digit',
//             minute: '2-digit'
//         }).toUpperCase();
//     if (currentTime[0] === "0") {
//         currentTime = currentTime.slice(1);
//     }
//     let currentDate = dateObj.toLocaleDateString([], {
//         day: '2-digit',
//         month: '2-digit',
//         year: '2-digit'
//     });
//     date.elem.innerHTML = currentTime + "<br>" + currentDate;
// }, (60 - new Date().getSeconds()) * 1000);
//
// date.elem.innerHTML = `
// 3:12 PM<br>
// 17/05/21
// `;
