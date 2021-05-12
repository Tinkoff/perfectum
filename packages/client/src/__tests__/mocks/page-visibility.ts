export const mockPageVisibility = () => {
    Object.defineProperty(window.document, 'hidden', {
        writable: true,
        enumerable: true,
        configurable: true,
        value: false
    });

    Object.defineProperty(window.document, "visibilityState", {
        writable: true,
        enumerable: true,
        configurable: true,
        value: "visible"
    });
}
