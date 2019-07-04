/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */

/**
 * Menu items are the deepest element possible - there are nested links.
 * They are contained inside a popupMenu.
 */
export default class BasicMenuItem {
    constructor(domNode, menuObj) {
        this.domNode = domNode;
        this.menu = menuObj;
        this.isMenubarItem = false;

        this.domNode.addEventListener('click', this.handleClick.bind(this));
        this.domNode.addEventListener('focus', this.handleFocus.bind(this));
        this.domNode.addEventListener('blur', this.handleBlur.bind(this));
        this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
        this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));
    }
    /* EVENT HANDLERS */

    setExpanded(value) {
        this.domNode.setAttribute('aria-expanded', value);
    }

    handleClick() {
        this.menu.setFocusToController();
        this.menu.close(true);
    }

    handleFocus() {
        this.menu.hasFocus = true;
    }

    handleBlur() {
        this.menu.hasFocus = false;
        setTimeout(this.menu.close.bind(this.menu, false), 300);
    }

    handleMouseover() {
        this.menu.hasHover = true;
        this.menu.open();
    }

    handleMouseout() {
        this.menu.hasHover = false;
        setTimeout(this.menu.close.bind(this.menu, false), 300);
    }
}
