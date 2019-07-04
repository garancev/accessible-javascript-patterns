import BasicMenuBarItem from "./BasicMenuBarItem.js";

/**
 * Entry point of the navigation menu.
 * Each menubarItem is a top-level, always visible.  menu item.
 */
export default class BasicMenuBar {
    constructor(domNode) {
        this.domNode = domNode;
        this.menubarItems = [];
        this.hasFocus = false;
        this.hasHover = false;

        // Traverse the element children of menubarNode: configure each with
        // menuitem role behavior and store reference in menuitems array.
        let elem = this.domNode.firstElementChild;

        while (elem) {
            const menuElement = elem.firstElementChild;

            if (elem && menuElement && menuElement.tagName === 'A') {
                const menubarItem = new BasicMenuBarItem(menuElement, this);
                this.menubarItems.push(menubarItem);
            }

            elem = elem.nextElementSibling;
        }
    }
}
