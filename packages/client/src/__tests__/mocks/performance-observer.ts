export const mockPerformanceObserver = () => {
    Object.defineProperty(window, 'PerformanceObserver', {
        writable: true,
        enumerable: true,
        configurable: true,
        value: {
            supportedEntryTypes: ['paint'],
        }
    });
}
