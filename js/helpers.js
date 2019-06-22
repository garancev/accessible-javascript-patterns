export function isPrintableCharacter(str) {
    return str.length === 1 && str.match(/\S/);
}

export function isFocusable(element) {
    switch (element.nodeName) {
        case 'INPUT':
            return element.type != 'hidden' && element.type != 'file';
        default:
            return false;
    }
};
