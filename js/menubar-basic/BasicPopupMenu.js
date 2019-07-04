import BasicMenuItem from './BasicMenuItem.js';

/*
* The popupMenu has a similar role as the MenuBar, but is at least 1 level deep.
* It is not always visible, and is the single child of a MenuBarItem.
* It contains menuitems.
*/
export default class BasicPopupMenu {
    constructor(domNode, controllerObj) {
        this.domNode = domNode;
        this.controller = controllerObj;

        this.menuitems = []; // See PopupMenu init method

        this.hasFocus = false; // See MenuItem handleFocus, handleBlur
        this.hasHover = false; // See PopupMenu handleMouseover, handleMouseout

        this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
        this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

        // Traverse the element children of domNode: configure each with
        // menuitem role behavior and store reference in menuitems array.
        let childElement = this.domNode.firstElementChild;

        while (childElement) {
            const menuElement = childElement.firstElementChild;

            if (menuElement && menuElement.tagName === 'A') {
                const menuItem = new BasicMenuItem(menuElement, this);
                this.menuitems.push(menuItem);
            }
            childElement = childElement.nextElementSibling;
        }
    }
    handleMouseover() {
        this.hasHover = true;
    }

    handleMouseout() {
        this.hasHover = false;
        setTimeout(this.close.bind(this, false), 1);
    }

    /* FOCUS MANAGEMENT METHODS */
    setFocusToController() {
        if (this.controller && this.controller.domNode) {
            this.controller.domNode.focus();
        }
    }

    /* MENU DISPLAY METHODS */
    open() {
        // Get position and bounding rectangle of controller object's DOM node
        const rect = this.controller.domNode.getBoundingClientRect();

        // Set CSS properties
        if (!this.controller.isMenubarItem) {
            this.domNode.parentNode.style.position = 'relative';
            this.domNode.style.display = 'block';
            this.domNode.style.position = 'absolute';
            this.domNode.style.left = rect.width + 'px';
            this.domNode.style.zIndex = 100;
        } else {
            this.domNode.style.display = 'block';
            this.domNode.style.position = 'absolute';
            this.domNode.style.top = (rect.height - 1) + 'px';
            this.domNode.style.zIndex = 100;
        }

        this.controller.setExpanded(true);
    }

    close(force) {
        let controllerHasHover = this.controller.hasHover;
        let hasFocus = this.hasFocus;

        for (let i = 0; i < this.menuitems.length; i++) {
            const mi = this.menuitems[i];
            if (mi.popupMenu) {
                hasFocus = hasFocus | mi.popupMenu.hasFocus;
            }
        }

        if (!this.controller.isMenubarItem) {
            controllerHasHover = false;
        }

        if (force || (!hasFocus && !this.hasHover && !controllerHasHover)) {
            this.domNode.style.display = 'none';
            this.domNode.style.zIndex = 0;
            this.controller.setExpanded(false);
        }
    }
}
