import { MEASURE_ENTRY } from "../fixtures";

export const mockPerformance = () => {
    Object.defineProperty(window, 'performance', {
        writable: true,
        enumerable: true,
        configurable: true,
        value: {
            mark: () => 'mark',
            measure: () => 'measure',
            getEntriesByName: () => [MEASURE_ENTRY]
        }
    });
}
