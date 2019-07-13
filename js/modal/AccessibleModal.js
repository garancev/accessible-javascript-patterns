import Focus from './Focus.js';
import Dialog from './Dialog.js';

export default class AccessibleModal {
    constructor() {
        this.focus = new Focus();
        const openButton = document.querySelector('#open-dialog');
        const moreButton = document.querySelector('#open-more');
        const okButton = document.querySelector('#open-ok');
        const cancelButton = document.querySelector('#cancel');
        const backButton = document.querySelector('#back-main');
        const closeButton = document.querySelector('#confirm-close');

        document.addEventListener('keyup', event => this.focus.handleEscape(event));

        openButton.addEventListener('click', event => this.openDialog('mainDialog', event.target));
        moreButton.addEventListener('click', event => this.openDialog('moreInfoDialog', event.target, 'more_para_1'));
        okButton.addEventListener('click', event => this.replaceDialog('confirmDialog', undefined, 'confirm-close'));

        cancelButton.addEventListener('click', event => this.closeDialog(event.target));
        backButton.addEventListener('click', event => this.closeDialog(event.target));
        closeButton.addEventListener('click', event => this.closeDialog(event.target));
    }
    openDialog(dialogId, focusAfterClosed, focusFirst) {
        new Dialog(dialogId, focusAfterClosed, focusFirst, this.focus);
    }

    replaceDialog(newDialogId, newFocusAfterClosed, newFocusFirst) {
        const topDialog = this.focus.getCurrentDialog();
        if (topDialog.dialogNode.contains(document.activeElement)) {
            topDialog.replace(newDialogId, newFocusAfterClosed, newFocusFirst);
        }
    }

    closeDialog(closeButton) {
        const topDialog = this.focus.getCurrentDialog();
        if (topDialog.dialogNode.contains(closeButton)) {
            topDialog.close();
        }
    }
}
