import { KEY_CODES } from '../keyboard.js';
import { isFocusable } from '../helpers.js';

export default class Focus {
    constructor() {
        this.OpenDialogList = this.OpenDialogList || [];
        this.IgnoreUtilFocusChanges = false;
    }
    handleEscape(event) {
        if (event.keyCode === KEY_CODES.ESC && this.closeCurrentDialog()) {
            event.stopPropagation();
        }
    }
    closeCurrentDialog() {
        const currentDialog = this.getCurrentDialog();
        if (currentDialog) {
            currentDialog.close();
            return true;
        }

        return false;
    }
    getCurrentDialog() {
        if (this.OpenDialogList && this.OpenDialogList.length) {
            return this.OpenDialogList[this.OpenDialogList.length - 1];
        }
    }
    attemptFocus(element) {
        if (!isFocusable(element)) {
            return false;
        }

        this.IgnoreUtilFocusChanges = true;
        try {
            element.focus();
        } catch (e) {}
        this.IgnoreUtilFocusChanges = false;
        return (document.activeElement === element);
    }
    focusLastDescendant(element) {
        for (let i = element.childNodes.length - 1; i >= 0; i--) {
            const child = element.childNodes[i];
            if (this.attemptFocus(child) ||
                this.focusLastDescendant(child)) {
                return true;
            }
        }
        return false;
    }
    focusFirstDescendant(element) {
        for (let i = 0; i < element.childNodes.length; i++) {
            const child = element.childNodes[i];
            if (this.attemptFocus(child) ||
                this.focusFirstDescendant(child)) {
                return true;
            }
        }
        return false;
    }
}
