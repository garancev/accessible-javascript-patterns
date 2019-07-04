import AccessibleMenuItem from './AccessibleMenuItem.js';

function setFocusToMenubarItem(controller, close) {
    while (controller) {
        if (controller.isMenubarItem) {
            controller.domNode.focus();
            return controller;
        } else {
            if (close) {
                controller.menu.close(true);
            }
            controller.hasFocus = false;
        }
        controller = controller.menu.controller;
    }
    return false;
}

/*
* The popupMenu has a similar role as the MenuBar, but is at least 1 level deep.
* It is not always visible, and is the single child of a MenuBarItem.
* It contains menuitems.
*/
export default class PopupMenu {
    constructor(domNode, controllerObj) {
        this.domNode = domNode;
        this.controller = controllerObj;

        this.menuitems = []; // See PopupMenu init method
        this.firstChars = []; // See PopupMenu init method

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
                const menuItem = new AccessibleMenuItem(menuElement, this);
                this.menuitems.push(menuItem);
                const textContent = menuElement.textContent.trim();
                this.firstChars.push(textContent.substring(0, 1).toLowerCase());
            }
            childElement = childElement.nextElementSibling;
        }

        // Use populated menuitems array to initialize firstItem and lastItem.
        const numItems = this.menuitems.length;
        if (numItems > 0) {
            this.firstItem = this.menuitems[0];
            this.lastItem = this.menuitems[numItems - 1];
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
    setFocusToController(command, flag) {
        if (typeof command !== 'string') {
            command = '';
        }

        if (command === '') {
            if (this.controller && this.controller.domNode) {
                this.controller.domNode.focus();
            }
            return;
        }

        if (!this.controller.isMenubarItem) {
            this.controller.domNode.focus();
            this.close();

            if (command === 'next') {
                const menubarItem = setFocusToMenubarItem(this.controller, false);
                if (menubarItem) {
                    menubarItem.menu.setFocusToNextItem(menubarItem, flag);
                }
            }
        } else {
            if (command === 'previous') {
                this.controller.menu.setFocusToPreviousItem(this.controller, flag);
            } else if (command === 'next') {
                this.controller.menu.setFocusToNextItem(this.controller, flag);
            }
        }

    }

    setFocusToFirstItem() {
        this.firstItem.domNode.focus();
    }

    setFocusToLastItem() {
        this.lastItem.domNode.focus();
    }

    setFocusToPreviousItem(currentItem) {
        if (currentItem === this.firstItem) {
            this.lastItem.domNode.focus();
        } else {
            const index = this.menuitems.indexOf(currentItem);
            this.menuitems[index - 1].domNode.focus();
        }
    }

    setFocusToNextItem(currentItem) {
        if (currentItem === this.lastItem) {
            this.firstItem.domNode.focus();
        } else {
            const index = this.menuitems.indexOf(currentItem);
            this.menuitems[index + 1].domNode.focus();
        }
    }

    setFocusByFirstCharacter(currentItem, char) {
        char = char.toLowerCase();

        // Get start index for search based on position of currentItem
        let start = this.menuitems.indexOf(currentItem) + 1;
        if (start === this.menuitems.length) {
            start = 0;
        }

        // Check remaining slots in the menu
        let index = this.getIndexFirstChars(start, char);

        // If not found in remaining slots, check from beginning
        if (index === -1) {
            index = this.getIndexFirstChars(0, char);
        }

        // If match was found...
        if (index > -1) {
            this.menuitems[index].domNode.focus();
        }
    }

    getIndexFirstChars(startIndex, char) {
        for (let i = startIndex; i < this.firstChars.length; i++) {
            if (char === this.firstChars[i]) {
                return i;
            }
        }
        return -1;
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
