export const mockSendBeacon = () => {
    Object.defineProperty(navigator, 'sendBeacon', {
        writable: true,
        enumerable: true,
        configurable: true,
        value: () => {
            return;
        }
    });
}
