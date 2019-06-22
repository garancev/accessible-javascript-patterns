
const OPEN_DIALOG = 'has-dialog';
const BACKDROP = 'dialog-backdrop';

/**
 * @constructor
 * @desc Dialog object providing modal focus management.
 *
 * Assumptions: The element serving as the dialog container is present in the
 * DOM and hidden. The dialog container has role='dialog'.
 *
 * @param dialogId
 *          The ID of the element serving as the dialog container.
 * @param focusAfterClosed
 *          Either the DOM node or the ID of the DOM node to focus when the
 *          dialog closes.
 * @param focusFirst
 *          Optional parameter containing either the DOM node or the ID of the
 *          DOM node to focus when the dialog opens. If not specified, the
 *          first focusable element in the dialog will receive focus.
 */
export default class Dialog {
    constructor(dialogId, focusAfterClosed, focusFirst, focus) {
        this.focus = focus;
        this.dialogNode = document.getElementById(dialogId);

        this.wrapInBackdrop();
        this.setFocusAfterClosed(focusAfterClosed);
        this.setFocusFirst(focusFirst);

        // Bracket the dialog node with two invisible, focusable nodes.
        // While this dialog is open, we use these to make sure that focus never
        // leaves the document even if dialogNode is the first or last node.
        const preDiv = document.createElement('div');
        this.preNode = this.dialogNode.parentNode.insertBefore(preDiv,
            this.dialogNode);
        this.preNode.tabIndex = 0;
        const postDiv = document.createElement('div');
        this.postNode = this.dialogNode.parentNode.insertBefore(postDiv,
            this.dialogNode.nextSibling);
        this.postNode.tabIndex = 0;

        // If this modal is opening on top of one that is already open,
        // get rid of the document focus listener of the open dialog.
        if (this.focus.OpenDialogList.length > 0) {
            this.focus.getCurrentDialog().removeListeners();
        }

        this.addListeners();
        this.focus.OpenDialogList.push(this);
        this.dialogNode.className = 'default_dialog'; // make visible

        if (this.focusFirst) {
            this.focusFirst.focus();
        } else {
            this.focus.focusFirstDescendant(this.dialogNode);
        }

        this.lastFocus = document.activeElement;
    }

    // Wrap in an individual backdrop element if one doesn't exist
    // Native <dialog> elements use the ::backdrop pseudo-element, which
    // works similarly.
    wrapInBackdrop() {
        if (this.dialogNode.parentNode.classList.contains(BACKDROP)) {
            this.backdropNode = this.dialogNode.parentNode;
        } else {
            this.backdropNode = document.createElement('div');
            this.backdropNode.className = BACKDROP;
            this.dialogNode.parentNode.insertBefore(this.backdropNode, this.dialogNode);
            this.backdropNode.appendChild(this.dialogNode);
        }
        this.backdropNode.classList.add('active');

        // Disable scroll on the body element
        document.body.classList.add(OPEN_DIALOG);
    }

    setFocusAfterClosed(focusAfterClosed) {
        if (typeof focusAfterClosed === 'string') {
            this.focusAfterClosed = document.getElementById(focusAfterClosed);
        } else if (typeof focusAfterClosed === 'object') {
            this.focusAfterClosed = focusAfterClosed;
        }
    }

    setFocusFirst(focusFirst) {
        if (typeof focusFirst === 'string') {
            this.focusFirst = document.getElementById(focusFirst);
        } else if (typeof focusFirst === 'object') {
            this.focusFirst = focusFirst;
        } else {
            this.focusFirst = null;
        }
    }

    /**
     * @desc
     *  Hides the current top dialog,
     *  removes listeners of the top dialog,
     *  restore listeners of a parent dialog if one was open under the one that just closed,
     *  and sets focus on the element specified for focusAfterClosed.
     */
    close() {
        this.focus.OpenDialogList.pop();
        this.removeListeners();
        this.preNode.remove();
        this.postNode.remove();
        this.dialogNode.className = 'hidden';
        this.backdropNode.classList.remove('active');
        this.focusAfterClosed.focus();

        // If a dialog was open underneath this one, restore its listeners.
        if (this.focus.OpenDialogList.length > 0) {
            this.focus.getCurrentDialog().addListeners();
        } else {
            document.body.classList.remove(OPEN_DIALOG);
        }
    }

    /**
     * @desc
     *  Hides the current dialog and replaces it with another.
     *
     * @param newDialogId
     *  ID of the dialog that will replace the currently open top dialog.
     * @param newFocusAfterClosed
     *  Optional ID or DOM node specifying where to place focus when the new dialog closes.
     *  If not specified, focus will be placed on the element specified by the dialog being replaced.
     * @param newFocusFirst
     *  Optional ID or DOM node specifying where to place focus in the new dialog when it opens.
     *  If not specified, the first focusable element will receive focus.
     */
    replace(newDialogId, newFocusAfterClosed, newFocusFirst) {
        this.focus.OpenDialogList.pop();
        this.removeListeners();
        this.preNode.remove();
        this.postNode.remove();
        this.dialogNode.className = 'hidden';
        this.backdropNode.classList.remove('active');

        const focusAfterClosed = newFocusAfterClosed || this.focusAfterClosed;
        new Dialog(newDialogId, focusAfterClosed, newFocusFirst, this.focus);
    }

    addListeners() {
        document.addEventListener('focus', this.focusTrapped = event => this.trapFocus(event), true);
    }

    removeListeners() {
        document.removeEventListener('focus', this.focusTrapped, true);
    }

    trapFocus(event) {
        if (this.focus.IgnoreUtilFocusChanges) {
            return;
        }
        const currentDialog = this.focus.getCurrentDialog();
        if (currentDialog.dialogNode.contains(event.target)) {
            currentDialog.lastFocus = event.target;
        } else {
            this.focus.focusFirstDescendant(currentDialog.dialogNode);
            if (currentDialog.lastFocus == document.activeElement) {
                this.focus.focusLastDescendant(currentDialog.dialogNode);
            }
            currentDialog.lastFocus = document.activeElement;
        }
    }
}
