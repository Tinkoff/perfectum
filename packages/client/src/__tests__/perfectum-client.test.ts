/* eslint-disable @typescript-eslint/no-explicit-any */
import PerfectumClient from '../index';
import { mockSendBeacon } from './mocks/send-beacon';
import { mockPerformance } from './mocks/performance';
import { mockPageVisibility } from './mocks/page-visibility';
import { mockPerformanceObserver } from './mocks/performance-observer';
import {
    METRICS,
    SEND_METRICS_URL,
    SEND_METRICS_DATA,
    SEND_METRICS_CALLBACK
} from './fixtures';

describe('PerfectumClient', () => {
    beforeEach(() => {
        mockSendBeacon();
        mockPerformance();
        mockPageVisibility();
        mockPerformanceObserver();
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.resetModules();
        // https://github.com/facebook/jest/issues/3236
        // https://github.com/facebook/jest/issues/9430
        (PerfectumClient as any).isInitialized = undefined; 
        (PerfectumClient as any).isSupportedEnvironment = undefined;
    });

    describe('.init()', () => {
        it('should be initialized without config', () => {
            PerfectumClient.init();

            expect((PerfectumClient as any).isInitialized).toEqual(true);
        });

        it('should be initialized with empty config', () => {
            const config = {};

            PerfectumClient.init(config);

            expect((PerfectumClient as any).isInitialized).toEqual(true);
        });

        it('should be initialized with config 1', () => {
            const config = {
                sendMetricsUrl: SEND_METRICS_URL
            };

            const DATA = JSON.stringify({
                ...METRICS
            });

            const sendBeacon = jest.spyOn(window.navigator, 'sendBeacon');

            PerfectumClient.init(config);

            window.dispatchEvent(new Event('unload'));

            expect((PerfectumClient as any).isInitialized).toEqual(true);
            expect(sendBeacon).toHaveBeenCalledWith(SEND_METRICS_URL, DATA);
        });

        it('should be initialized with config 2', () => {
            const config = {
                sendMetricsUrl: SEND_METRICS_URL,
                sendMetricsData: SEND_METRICS_DATA
            };

            const DATA = JSON.stringify({
                ...METRICS,
                ...SEND_METRICS_DATA
            });

            const sendBeacon = jest.spyOn(window.navigator, 'sendBeacon');

            PerfectumClient.init(config);

            window.dispatchEvent(new Event('unload'));

            expect((PerfectumClient as any).isInitialized).toEqual(true);
            expect(sendBeacon).toHaveBeenCalledWith(SEND_METRICS_URL, DATA);
        });

        it('should be initialized with config 3', () => {
            const config = {
                logging: false,
                sendMetricsUrl: SEND_METRICS_URL,
                sendMetricsData: SEND_METRICS_DATA,
                sendMetricsCallback: SEND_METRICS_CALLBACK
            };

            PerfectumClient.init(config);

            expect((PerfectumClient as any).isInitialized).toEqual(true);
        });

        it('should not be initialized in an unsupported environment 1', () => {
            delete (window as any).PerformanceObserver;

            PerfectumClient.init({});

            expect((PerfectumClient as any).isInitialized).toEqual(undefined);
            expect((PerfectumClient as any).isSupportedEnvironment).toEqual(undefined);
        });

        it('should not be initialized in an unsupported environment 2', () => {
            delete (window.PerformanceObserver as any).supportedEntryTypes;

            PerfectumClient.init({});

            expect((PerfectumClient as any).isInitialized).toEqual(undefined);
            expect((PerfectumClient as any).isSupportedEnvironment).toEqual(undefined);
        });

        it('should not be initialized in an unsupported environment 3', () => {
            (window.document as any).hidden = undefined;

            PerfectumClient.init({});

            expect((PerfectumClient as any).isInitialized).toEqual(undefined);
            expect((PerfectumClient as any).isSupportedEnvironment).toEqual(undefined);
        });

        it('should not be initialized in an unsupported environment 4', () => {
            (window.document as any).hidden = true;

            PerfectumClient.init({});

            expect((PerfectumClient as any).isInitialized).toEqual(undefined);
            expect((PerfectumClient as any).isSupportedEnvironment).toEqual(undefined);
        });

        it('should not be initialized in an unsupported environment 5', () => {
            delete (window.navigator as any).sendBeacon;

            PerfectumClient.init({});

            expect((PerfectumClient as any).isInitialized).toEqual(undefined);
            expect((PerfectumClient as any).isSupportedEnvironment).toEqual(undefined);
        });
    });

    describe('.startMeasure()', () => {
        it('should be called', () => {
            const spy = jest.spyOn(window.performance, 'mark');

            PerfectumClient.init();
            PerfectumClient.startMeasure('metric-name');

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('metric-name:start');
        });

        it('should be called once', () => {
            const spy = jest.spyOn(window.performance, 'mark');

            PerfectumClient.init();
            PerfectumClient.startMeasure('metric-name');
            PerfectumClient.startMeasure('metric-name');
            PerfectumClient.startMeasure('metric-name');

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('metric-name:start');
        });

        it('should not be called without calling .init()', () => {
            const spy = jest.spyOn(window.performance, 'mark');

            PerfectumClient.startMeasure('metric-name');

            expect(spy).toHaveBeenCalledTimes(0);
        });
    });

    describe('.stopMeasure()', () => {
        it('should be called', () => {
            const spyMark = jest.spyOn(window.performance, 'mark');
            const spyMeasure = jest.spyOn(window.performance, 'measure');

            PerfectumClient.init();
            PerfectumClient.startMeasure('metric-name');
            PerfectumClient.stopMeasure('metric-name');

            expect(spyMark).toHaveBeenCalledTimes(2);
            expect(spyMeasure).toHaveBeenCalledTimes(1);
            expect(spyMark).toHaveBeenCalledWith('metric-name:end');
            expect(spyMeasure).toHaveBeenCalledWith('metric-name', 'metric-name:start', 'metric-name:end');
        });

        it('should be called once', () => {
            const spyMark = jest.spyOn(window.performance, 'mark');
            const spyMeasure = jest.spyOn(window.performance, 'measure');

            PerfectumClient.init();
            PerfectumClient.startMeasure('metric-name');
            PerfectumClient.stopMeasure('metric-name');
            PerfectumClient.stopMeasure('metric-name');
            PerfectumClient.stopMeasure('metric-name');

            expect(spyMark).toHaveBeenCalledTimes(2);
            expect(spyMeasure).toHaveBeenCalledTimes(1);
            expect(spyMark).toHaveBeenCalledWith('metric-name:start');
            expect(spyMark).toHaveBeenCalledWith('metric-name:end');
            expect(spyMeasure).toHaveBeenCalledWith('metric-name', 'metric-name:start', 'metric-name:end');
        });

        it('should not be called without calling .init()', () => {
            const spyMark = jest.spyOn(window.performance, 'mark');
            const spyMeasure = jest.spyOn(window.performance, 'measure');

            PerfectumClient.stopMeasure('metric-name');

            expect(spyMark).toHaveBeenCalledTimes(0);
            expect(spyMeasure).toHaveBeenCalledTimes(0);
        });

        it('should not be called without calling .startMeasure()', () => {
            const spyMark = jest.spyOn(window.performance, 'mark');
            const spyMeasure = jest.spyOn(window.performance, 'measure');

            PerfectumClient.init();
            PerfectumClient.stopMeasure('metric-name');

            expect(spyMark).toHaveBeenCalledTimes(0);
            expect(spyMeasure).toHaveBeenCalledTimes(0);
        });
    });
});
