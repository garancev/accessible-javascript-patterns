import AccessiblePopupMenu from './AccessiblePopupMenu.js';
import { KEY_CODES } from '../keyboard.js';
import { isPrintableCharacter } from '../helpers.js';

/*
 * This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */
/*
 * Each menubarItem is a top-level, always visible menu item.
 * If it has children links, they are grouped inside the PopupMenu
*/
export default class AccessibleMenubarItem {
    constructor(domNode, menuObj) {
        this.menu = menuObj;
        this.domNode = domNode;
        this.popupMenu = false;
        this.hasFocus = false;
        this.hasHover = false;
        this.isMenubarItem = true;
        this.domNode.tabIndex = -1;

        this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));

        this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
        this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));
        this.domNode.addEventListener('focus', this.handleFocus.bind(this));
        this.domNode.addEventListener('blur', this.handleBlur.bind(this));

        const nextElement = this.domNode.nextElementSibling;

        if (nextElement && nextElement.tagName === 'UL') {
            this.popupMenu = new AccessiblePopupMenu(nextElement, this);
        }
    }

    handleKeydown(event) {
        let flag = false;

        switch (event.keyCode) {
            case KEY_CODES.SPACE:
            case KEY_CODES.RETURN:
            case KEY_CODES.DOWN:
                if (this.popupMenu) {
                    this.popupMenu.open();
                    this.popupMenu.setFocusToFirstItem();
                    flag = true;
                }
                break;

            case KEY_CODES.LEFT:
                this.menu.setFocusToPreviousItem(this);
                flag = true;
                break;

            case KEY_CODES.RIGHT:
                this.menu.setFocusToNextItem(this);
                flag = true;
                break;

            case KEY_CODES.UP:
                if (this.popupMenu) {
                    this.popupMenu.open();
                    this.popupMenu.setFocusToLastItem();
                    flag = true;
                }
                break;

            case KEY_CODES.HOME:
            case KEY_CODES.PAGEUP:
                this.menu.setFocusToFirstItem();
                flag = true;
                break;

            case KEY_CODES.END:
            case KEY_CODES.PAGEDOWN:
                this.menu.setFocusToLastItem();
                flag = true;
                break;

            case KEY_CODES.TAB:
                this.popupMenu.close(true);
                break;

            case KEY_CODES.ESC:
                this.popupMenu.close(true);
                break;

            default:
                if (isPrintableCharacter(char)) {
                    this.menu.setFocusByFirstCharacter(this, char);
                    flag = true;
                }
                break;
        }

        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    setExpanded(value) {
        this.domNode.setAttribute('aria-expanded', value);
    }

    handleFocus() {
        this.menu.hasFocus = true;
    }

    handleBlur() {
        this.menu.hasFocus = false;
    }

    handleMouseover() {
        this.hasHover = true;
        this.popupMenu.open();
    }

    handleMouseout() {
        this.hasHover = false;
        setTimeout(this.popupMenu.close.bind(this.popupMenu, false), 300);
    }
}
