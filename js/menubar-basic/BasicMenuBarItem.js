import BasicPopupMenu from './BasicPopupMenu.js';

/*
 * This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */
/*
 * Each menubarItem is a top-level, always visible menu item.
 * If it has children links, they are grouped inside the PopupMenu
*/
export default class BasicMenubarItem {
    constructor(domNode, menuObj) {
        this.menu = menuObj;
        this.domNode = domNode;
        this.popupMenu = false;
        this.hasFocus = false;
        this.hasHover = false;
        this.isMenubarItem = true;

        this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
        this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));
        this.domNode.addEventListener('focus', this.handleFocus.bind(this));
        this.domNode.addEventListener('blur', this.handleBlur.bind(this));

        const nextElement = this.domNode.nextElementSibling;

        if (nextElement && nextElement.tagName === 'UL') {
            this.popupMenu = new BasicPopupMenu(nextElement, this);
        }
    }

    handleBlur() {
        this.menu.hasFocus = false;
        setTimeout(this.popupMenu.close.bind(this.popupMenu, false), 300);
    }

    handleMouseover() {
        this.hasHover = true;
        this.popupMenu.open();
    }
    handleFocus() {
        this.menu.hasFocus = true;
        this.popupMenu.open();
    }

    handleMouseout() {
        this.hasHover = false;
        setTimeout(this.popupMenu.close.bind(this.popupMenu, false), 300);
    }
}
