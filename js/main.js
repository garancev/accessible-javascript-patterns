import AccessibleMenuBar from "./menubar/AccessibleMenuBar.js";
import AccessibleModal from "./modal/AccessibleModal.js";
import MobileNav from "./MobileNav.js";


function start() {
    //fixme: cheap & dirty mobile detection
    if (window.innerWidth > 600) {
        new AccessibleMenuBar(document.querySelector('#menubar1'));
    } else {
        new MobileNav(document.querySelector('#btn_nav'), document.querySelector('#nav'));
    }
    new AccessibleModal();

}
document.addEventListener("DOMContentLoaded", start, false);

/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */


