import { KEY_CODES } from '../keyboard.js';
import { isPrintableCharacter } from '../helpers.js';

/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */


export default class AccessibleMenuItem {
    constructor(domNode, menuObj) {
        this.domNode = domNode;
        this.menu = menuObj;
        this.isMenubarItem = false;

        this.domNode.tabIndex = -1;

        this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
        this.domNode.addEventListener('click', this.handleClick.bind(this));
        this.domNode.addEventListener('focus', this.handleFocus.bind(this));
        this.domNode.addEventListener('blur', this.handleBlur.bind(this));
        this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
        this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

        // Initialize flyout menu
        const nextElement = this.domNode.nextElementSibling;
    }

    isExpanded() {
        return this.domNode.getAttribute('aria-expanded') === 'true';
    }

    /* EVENT HANDLERS */

    handleKeydown(event) {
        const tgt = event.currentTarget,
            char = event.key;
        let flag = false,
            clickEvent;

        switch (event.keyCode) {
            case KEY_CODES.SPACE:
            case KEY_CODES.RETURN:
                    // Create simulated mouse event to mimic the behavior of ATs
                // and let the event handler handleClick do the housekeeping.
                clickEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                tgt.dispatchEvent(clickEvent);

                flag = true;
                break;

            case KEY_CODES.UP:
                this.menu.setFocusToPreviousItem(this);
                flag = true;
                break;

            case KEY_CODES.DOWN:
                this.menu.setFocusToNextItem(this);
                flag = true;
                break;

            case KEY_CODES.LEFT:
                this.menu.setFocusToController('previous', true);
                this.menu.close(true);
                flag = true;
                break;

            case KEY_CODES.RIGHT:
                this.menu.setFocusToController('next', true);
                this.menu.close(true);
                flag = true;
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

            case KEY_CODES.ESC:
                this.menu.setFocusToController();
                this.menu.close(true);
                flag = true;
                break;

            case KEY_CODES.TAB:
                this.menu.setFocusToController();
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
