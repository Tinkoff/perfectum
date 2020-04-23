import Logger from '../logger';
import {
    Metrics,
    EntryTypes,
    DeviceTypes,
    MetricsStore,
    CustomMetricsStore,
    LongTasksMetricStore,
    LongTasksMetricNames,
    ElementPerformanceEntry,
    FirstInputDelayMetricNames,
    LayoutShiftPerformanceEntry,
    NavigationTimingsMetricNames,
    DeviceInformationMetricNames,
    NetworkInformationMetricNames,
    FirstInputDelayPerformanceEntry,
    NavigatorWithConnectionProperty,
    NavigationTimingsPerformanceEntry
} from './types';
import { isMobileDevice } from './utils';
import { DEFAULT_OBSERVED_ENTRY_TYPES } from './constants';

export default class Performance {
    private metrics: MetricsStore = {
        [Metrics.longTasks]: null,
        [Metrics.firstPaint]: null,
        [Metrics.customMetrics]: null,
        [Metrics.firstInputDelay]: null,
        [Metrics.navigationTimings]: null,
        [Metrics.deviceInformation]: null,
        [Metrics.networkInformation]: null,
        [Metrics.firstContentfulPaint]: null,
        [Metrics.cumulativeLayoutShift]: null,
        [Metrics.largestContentfulPaint]: null
    };

    private logger: Logger;

    private performanceObserversForDisconnect: PerformanceObserver[] = [];

    constructor(logger: Logger) {
        this.logger = logger;
    }

    public init() {
        this.initDeviceInformation();
        this.initNetworkInformation();
        this.initPerformanceObservers();
    }

    private initDeviceInformation() {
        this.metrics[Metrics.deviceInformation] = {
            [DeviceInformationMetricNames.type]: isMobileDevice()
                ? DeviceTypes.mobile
                : DeviceTypes.desktop
        }
    }

    private initNetworkInformation() {
        const { connection } = navigator as NavigatorWithConnectionProperty;

        if (!connection) {
            return;
        }

        this.metrics[Metrics.networkInformation] = {
            [NetworkInformationMetricNames.roundTripTime]: connection.rtt,
            [NetworkInformationMetricNames.downlinkBandwidth]: connection.downlink,
            [NetworkInformationMetricNames.effectiveConnectionType]: connection.effectiveType
        };
    }

    private initPerformanceObservers() {
        this.observedEntryTypes.forEach((entryType: EntryTypes) => {
            switch (entryType) {
                case EntryTypes.paint:
                    this.initFirstPaintObserver();
                    this.initFirstContentfulPaintObserver();
                    break;
                case EntryTypes.element:
                    this.initElementTimingObserver();
                    break;
                case EntryTypes.longTask:
                    this.initLongTasksObserver();
                    break;
                case EntryTypes.layoutShift:
                    this.initLayoutShiftObserver();
                    break;
                case EntryTypes.firstInput:
                    this.initFirstInputDelayObserver();
                    break;
                case EntryTypes.navigation:
                    this.initNavigationTimingsObserver();
                    break;
                case EntryTypes.largestContentfulPaint:
                    this.initLargestContentfulPaintObserver();
                    break;
                default:
                    break;
            }
        });
    }

    private initNavigationTimingsObserver() {
        try {
            const performanceObserver = new PerformanceObserver((performanceEntryList: PerformanceObserverEntryList) => {
                const performanceEntry = performanceEntryList.getEntries()[0] as NavigationTimingsPerformanceEntry;

                const {
                    startTime,
                    connectEnd,
                    responseEnd,
                    requestStart,
                    connectStart,
                    responseStart,
                    domainLookupEnd,
                    domainLookupStart
                } = performanceEntry;

                this.metrics[Metrics.navigationTimings] = {
                    [NavigationTimingsMetricNames.domainLookupTime]: domainLookupEnd - domainLookupStart,
                    [NavigationTimingsMetricNames.serverResponseTime]: responseStart - requestStart,
                    [NavigationTimingsMetricNames.serverConnectionTime]: connectEnd - connectStart,
                    [NavigationTimingsMetricNames.downloadDocumentTime]: responseEnd - startTime
                };

                performanceObserver.disconnect();
            });

            performanceObserver.observe({ type: EntryTypes.navigation, buffered: true });
        } catch (error) {
            this.logger.printError('Performance:initNavigationTimingsObserver', error);
        }
    }

    private initFirstPaintObserver() {
        try {
            const performanceObserver = new PerformanceObserver((performanceEntryList: PerformanceObserverEntryList) => {
                const performanceEntries = performanceEntryList.getEntries();

                performanceEntries.forEach(performanceEntry => {
                    if (performanceEntry.name === Metrics.firstPaint) {
                        this.metrics[Metrics.firstPaint] = performanceEntry.startTime;

                        performanceObserver.disconnect();
                    }
                });
            });

            performanceObserver.observe({ type: EntryTypes.paint, buffered: true });
        } catch (error) {
            this.logger.printError('Performance:initFirstPaintObserver', error);
        }
    }

    private initFirstContentfulPaintObserver() {
        try {
            const performanceObserver = new PerformanceObserver((performanceEntryList: PerformanceObserverEntryList) => {
                const performanceEntries = performanceEntryList.getEntries();

                performanceEntries.forEach(performanceEntry => {
                    if (performanceEntry.name === Metrics.firstContentfulPaint) {
                        this.metrics[Metrics.firstContentfulPaint] = performanceEntry.startTime;

                        performanceObserver.disconnect();
                    }
                });
            });

            performanceObserver.observe({ type: EntryTypes.paint, buffered: true });
        } catch (error) {
            this.logger.printError('Performance:initFirstContentfulPaintObserver', error);
        }
    }

    private initFirstInputDelayObserver() {
        try {
            const performanceObserver = new PerformanceObserver((performanceEntryList: PerformanceObserverEntryList) => {
                const performanceEntry = performanceEntryList.getEntries()[0] as FirstInputDelayPerformanceEntry;

                this.metrics[Metrics.firstInputDelay] = {
                    [FirstInputDelayMetricNames.eventName]: performanceEntry.name,
                    [FirstInputDelayMetricNames.startTime]: performanceEntry.startTime,
                    [FirstInputDelayMetricNames.duration]: performanceEntry.processingStart - performanceEntry.startTime
                };

                performanceObserver.disconnect();

                // After the first interaction with the page, we disconnect all performance observers
                this.disconnectPerformanceObservers();
            });

            performanceObserver.observe({ type: EntryTypes.firstInput, buffered: true });
        } catch (error) {
            this.logger.printError('Performance:initFirstInputDelayObserver', error);
        }
    }

    private initLargestContentfulPaintObserver() {
        try {
            const performanceObserver = new PerformanceObserver((performanceEntryList: PerformanceObserverEntryList) => {
                const performanceEntries = performanceEntryList.getEntries();
                const performanceEntry = performanceEntries[performanceEntries.length - 1];

                this.metrics[Metrics.largestContentfulPaint] = performanceEntry.startTime;
            });

            performanceObserver.observe({ type: EntryTypes.largestContentfulPaint, buffered: true });

            this.performanceObserversForDisconnect.push(performanceObserver);
        } catch (error) {
            this.logger.printError('Performance:initLargestContentfulPaintObserver', error);
        }
    }

    private initLayoutShiftObserver() {
        try {
            if (this.metrics[Metrics.cumulativeLayoutShift] === null) {
                this.metrics[Metrics.cumulativeLayoutShift] = 0;
            }

            const performanceObserver = new PerformanceObserver((performanceEntryList: PerformanceObserverEntryList) => {
                const performanceEntries = performanceEntryList.getEntries() as LayoutShiftPerformanceEntry[];

                performanceEntries.forEach((performanceEntry) => {
                    if (!performanceEntry.hadRecentInput) {
                        this.metrics[Metrics.cumulativeLayoutShift]! += performanceEntry.value; // eslint-disable-line @typescript-eslint/no-non-null-assertion
                    }
                })
            });

            performanceObserver.observe({ type: EntryTypes.layoutShift, buffered: true });

            this.performanceObserversForDisconnect.push(performanceObserver);
        } catch (error) {
            this.logger.printError('Performance:initLayoutShiftObserver', error);
        }
    }

    private initLongTasksObserver() {
        try {
            if (this.metrics[Metrics.longTasks] === null) {
                this.metrics[Metrics.longTasks] = {
                    [LongTasksMetricNames.totalLongTasks]: 0,
                    [LongTasksMetricNames.firstLongTaskDuration]: 0,
                    [LongTasksMetricNames.firstLongTaskStartTime]: 0
                };
            }

            const longTasksMetricStore = this.metrics[Metrics.longTasks] as LongTasksMetricStore;

            const performanceObserver = new PerformanceObserver((performanceEntryList: PerformanceObserverEntryList) => {
                const performanceEntries = performanceEntryList.getEntries();

                longTasksMetricStore[LongTasksMetricNames.totalLongTasks] += performanceEntries.length;

                if (longTasksMetricStore[LongTasksMetricNames.firstLongTaskDuration] === 0) {
                    const firstPerformanceEntry = performanceEntries[0];

                    longTasksMetricStore[LongTasksMetricNames.firstLongTaskDuration] = firstPerformanceEntry.duration;
                    longTasksMetricStore[LongTasksMetricNames.firstLongTaskStartTime] = firstPerformanceEntry.startTime;
                }
            });

            performanceObserver.observe({ type: EntryTypes.longTask });

            this.performanceObserversForDisconnect.push(performanceObserver);
        } catch (error) {
            this.logger.printError('Performance:initLongTasksObserver', error);
        }
    }

    private initElementTimingObserver() {
        try {
            if (this.metrics[Metrics.customMetrics] === null) {
                this.metrics[Metrics.customMetrics] = {};
            }

            const customMetricsStore = this.metrics[Metrics.customMetrics] as CustomMetricsStore;

            const performanceObserver = new PerformanceObserver((performanceEntryList: PerformanceObserverEntryList) => {
                const performanceEntries = performanceEntryList.getEntries() as ElementPerformanceEntry[];

                performanceEntries.forEach((performanceEntry) => {
                    if (customMetricsStore[performanceEntry.identifier] === undefined) {
                        customMetricsStore[performanceEntry.identifier] = performanceEntry.startTime;
                    }
                });
            });

            performanceObserver.observe({ type: EntryTypes.element, buffered: true });

            this.performanceObserversForDisconnect.push(performanceObserver);
        } catch (error) {
            this.logger.printError('Performance:initElementTimingObserver', error);
        }
    }

    private disconnectPerformanceObservers() {
        this.performanceObserversForDisconnect.forEach(performanceObserver => {
            performanceObserver.disconnect();
        });
    }

    private get observedEntryTypes() {
        const supportedEntryTypes = PerformanceObserver?.supportedEntryTypes?.length
            ? PerformanceObserver.supportedEntryTypes
            : null;

        return supportedEntryTypes
            ? DEFAULT_OBSERVED_ENTRY_TYPES.filter(entryType => supportedEntryTypes.indexOf(entryType) !== -1) // eslint-disable-line @typescript-eslint/prefer-includes
            : DEFAULT_OBSERVED_ENTRY_TYPES;
    }

    public startPerformanceMeasure(markName: string) {
        try {
            if (this.metrics[Metrics.customMetrics] === null) {
                this.metrics[Metrics.customMetrics] = {};
            }

            const customMetricsStore = this.metrics[Metrics.customMetrics] as CustomMetricsStore;

            if (customMetricsStore[markName] === undefined) {
                customMetricsStore[markName] = null;
                performance.mark(`${markName}:start`);
            }
        } catch (error) {
            this.logger.printError('Performance:startMeasure', error);
        }
    }

    public stopPerformanceMeasure(markName: string) {
        try {
            const customMetricsStore = this.metrics[Metrics.customMetrics];

            if (customMetricsStore === null) {
                return;
            }

            if (customMetricsStore[markName] === null) {
                performance.mark(`${markName}:end`);
                performance.measure(markName, `${markName}:start`, `${markName}:end`);

                const performanceEntries = performance.getEntriesByName(markName);

                performanceEntries.forEach(performanceEntry => {
                    if (performanceEntry.entryType === EntryTypes.measure) {
                        customMetricsStore[markName] = performanceEntry.duration;
                    }
                })
            }
        } catch (error) {
            this.logger.printError('Performance:stopMeasure', error);
        }
    }

    public getMetrics() {
        return this.metrics;
    }
}
