import AccessibleMenuBar from "./menubar/AccessibleMenuBar.js";
import AccessibleModal from "./modal/AccessibleModal.js";


function start() {
    new AccessibleMenuBar(document.querySelector('#menubar1'));
    new AccessibleModal();

}
document.addEventListener("DOMContentLoaded", start, false);

/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */


