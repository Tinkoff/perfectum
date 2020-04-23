import { 
    Metrics,
    EntryTypes,
    DeviceTypes,
    MetricsStore,
    DeviceInformationMetricNames,
} from '../../performance/types';

export const METRICS = {
    [Metrics.longTasks]: null,
    [Metrics.firstPaint]: null,
    [Metrics.customMetrics]: null,
    [Metrics.firstInputDelay]: null,
    [Metrics.navigationTimings]: null,
    [Metrics.deviceInformation]: {
        [DeviceInformationMetricNames.type]: DeviceTypes.desktop
    },
    [Metrics.networkInformation]: null,
    [Metrics.firstContentfulPaint]: null,
    [Metrics.cumulativeLayoutShift]: null,
    [Metrics.largestContentfulPaint]: null
};

export const SEND_METRICS_URL = 'http://example.com/performance-metrics';

export const SEND_METRICS_DATA = {
    app: 'example',
    env: 'production'
};

export const SEND_METRICS_CALLBACK = (metrics: MetricsStore) => {
    const data = JSON.stringify(metrics);

    window.navigator.sendBeacon(SEND_METRICS_URL, data);
};

export const MEASURE_ENTRY = {
    duration: 100,
    entryType: EntryTypes.measure
};
