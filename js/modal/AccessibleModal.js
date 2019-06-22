import Focus from './Focus.js';
import Dialog from './Dialog.js';

export default class AccessibleModal {
    constructor() {
        this.focus = new Focus();
        document.addEventListener('keyup', event => this.focus.handleEscape(event));
        document.querySelector('#open-modal')
            .addEventListener('click', event => this.openDialog('address', event.target));
        document.querySelector('#open-more')
            .addEventListener('click', event => this.openDialog('privacy', event.target, 'privacy_para1'));

        document.querySelector('#open-ok')
            .addEventListener('click', event => this.replaceDialog('confirm', undefined, 'confirm_close_btn'));


        document.querySelector('#cancel')
            .addEventListener('click', event => this.closeDialog(event.target));

        document.querySelector('#back-address')
            .addEventListener('click', event => this.closeDialog(event.target));

        document.querySelector('#confirm_close_btn')
            .addEventListener('click', event => this.closeDialog(event.target));
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
