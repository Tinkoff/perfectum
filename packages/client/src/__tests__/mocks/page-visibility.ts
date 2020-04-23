export const mockPageVisibility = () => {
    Object.defineProperty(window.document, 'hidden', {
        writable: true,
        enumerable: true,
        configurable: true,
        value: false
    });
}
