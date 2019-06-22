import AccessibleMenuBarItem from "./AccessibleMenuBarItem.js";

export default class AccessibleMenuBar {
    constructor(domNode) {
        this.domNode = domNode;
        this.menubarItems = [];
        this.firstChars = [];
        this.hasFocus = false;
        this.hasHover = false;

        // Traverse the element children of menubarNode: configure each with
        // menuitem role behavior and store reference in menuitems array.
        let elem = this.domNode.firstElementChild;

        while (elem) {
            const menuElement = elem.firstElementChild;

            if (elem && menuElement && menuElement.tagName === 'A') {
                const menubarItem = new AccessibleMenuBarItem(menuElement, this);
                this.menubarItems.push(menubarItem);
                const textContent = menuElement.textContent.trim();
                this.firstChars.push(textContent.substring(0, 1).toLowerCase());
            }

            elem = elem.nextElementSibling;
        }

        // Use populated menuitems array to initialize firstItem and lastItem.
        const numItems = this.menubarItems.length;
        if (numItems > 0) {
            this.firstItem = this.menubarItems[0];
            this.lastItem = this.menubarItems[numItems - 1];
        }
        this.firstItem.domNode.tabIndex = 0;
    }


    setFocusToItem(newItem) {
        let flag = false;

        for (let i = 0; i < this.menubarItems.length; i++) {
            const mbi = this.menubarItems[i];

            if (mbi.domNode.tabIndex == 0) {
                flag = mbi.domNode.getAttribute('aria-expanded') === 'true';
            }

            mbi.domNode.tabIndex = -1;
            if (mbi.popupMenu) {
                mbi.popupMenu.close();
            }
        }

        newItem.domNode.focus();
        newItem.domNode.tabIndex = 0;

        if (flag && newItem.popupMenu) {
            newItem.popupMenu.open();
        }
    }

    setFocusToFirstItem() {
        this.setFocusToItem(this.firstItem);
    }

    setFocusToLastItem() {
        this.setFocusToItem(this.lastItem);
    }

    setFocusToPreviousItem(currentItem) {
        let newItem;
        if (currentItem === this.firstItem) {
            newItem = this.lastItem;
        } else {
            const index = this.menubarItems.indexOf(currentItem);
            newItem = this.menubarItems[index - 1];
        }

        this.setFocusToItem(newItem);
    }

    setFocusToNextItem(currentItem) {
        let newItem;
        if (currentItem === this.lastItem) {
            newItem = this.firstItem;
        } else {
            const index = this.menubarItems.indexOf(currentItem);
            newItem = this.menubarItems[index + 1];
        }

        this.setFocusToItem(newItem);
    }

    setFocusByFirstCharacter(currentItem, char) {
        char = char.toLowerCase();
        let start;

        // Get start index for search based on position of currentItem
        start = this.menubarItems.indexOf(currentItem) + 1;
        if (start === this.menubarItems.length) {
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
            this.setFocusToItem(this.menubarItems[index]);
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
}
