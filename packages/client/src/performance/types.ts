export enum EntryTypes {
    paint = 'paint',
    element = 'element',
    measure = 'measure',
    longTask = 'longtask',
    navigation = 'navigation',
    firstInput = 'first-input',
    layoutShift = 'layout-shift',
    largestContentfulPaint = 'largest-contentful-paint'
}

export enum Metrics {
    longTasks = 'long-tasks',
    firstPaint = 'first-paint',
    customMetrics = 'custom-metrics',
    firstInputDelay = 'first-input-delay',
    navigationTimings = 'navigation-timings',
    deviceInformation = 'device-information',
    networkInformation = 'network-information',
    firstContentfulPaint = 'first-contentful-paint',
    cumulativeLayoutShift = 'cumulative-layout-shift',
    largestContentfulPaint = 'largest-contentful-paint'
}

export type MetricsStore = {
    [Metrics.longTasks]: LongTasksMetricStore | null;
    [Metrics.firstPaint]: FirstPaintMetricStore | null;
    [Metrics.customMetrics]: CustomMetricsStore | null;
    [Metrics.firstInputDelay]: FirstInputDelayMetricStore | null;
    [Metrics.navigationTimings]: NavigationTimingsMetricStore | null;
    [Metrics.deviceInformation]: DeviceInformationMetricStore | null;
    [Metrics.networkInformation]: NetworkInformationMetricStore | null;
    [Metrics.firstContentfulPaint]: FirstContentfulPaintMetricStore | null;
    [Metrics.cumulativeLayoutShift]: CumulativeLayoutShiftMetricStore | null;
    [Metrics.largestContentfulPaint]: LargestContentfulPaintMetricStore | null;
};

export enum NavigationTimingsMetricNames {
    domainLookupTime = 'domain-lookup-time',
    serverResponseTime = 'server-response-time',
    serverConnectionTime = 'server-connection-time',
    downloadDocumentTime = 'download-document-time'
}

type NavigationTimingsMetricStore = Record<NavigationTimingsMetricNames, number>;

export enum DeviceInformationMetricNames {
    type = 'type'
}

type DeviceInformationMetricStore = {
    [DeviceInformationMetricNames.type]: DeviceTypes;
};

export enum NetworkInformationMetricNames {
    roundTripTime = 'round-trip-time',
    downlinkBandwidth = 'downlink-bandwidth',
    effectiveConnectionType = 'effective-connection-type'
}

type NetworkInformationMetricStore = {
    [NetworkInformationMetricNames.roundTripTime]: number;
    [NetworkInformationMetricNames.downlinkBandwidth]: number;
    [NetworkInformationMetricNames.effectiveConnectionType]: string;
};

type ConnectionProperty = {
    rtt: number;
    downlink: number;
    effectiveType: string;
}

export type NavigatorWithConnectionProperty = Navigator & {
    connection?: ConnectionProperty;
}

export type CustomMetricsStore = Record<string, number | null>;

export enum LongTasksMetricNames {
    totalLongTasks = 'total-long-tasks',
    firstLongTaskDuration = 'first-long-task-duration',
    firstLongTaskStartTime = 'first-long-task-start-time'
}

export type LongTasksMetricStore = Record<LongTasksMetricNames, number>;

export enum FirstInputDelayMetricNames {
    eventName = 'event-name',
    startTime = 'start-time',
    duration = 'duration'
}

type FirstInputDelayMetricStore = {
    [FirstInputDelayMetricNames.eventName]: string;
    [FirstInputDelayMetricNames.startTime]: number;
    [FirstInputDelayMetricNames.duration]: number;
};

type FirstPaintMetricStore = number;

type FirstContentfulPaintMetricStore = number;

type CumulativeLayoutShiftMetricStore = number;

type LargestContentfulPaintMetricStore = number;

export enum DeviceTypes {
    mobile = 'mobile',
    desktop = 'desktop'
}

export type FirstInputDelayPerformanceEntry = PerformanceEntry & {
    processingEnd: number;
    processingStart: number;
};

export type LayoutShiftPerformanceEntry = PerformanceEntry & {
    value: number;
    lastInputTime: number;
    hadRecentInput: boolean;
};

export type ElementPerformanceEntry = PerformanceEntry & {
    id: string;
    url: string;
    loadTime: number;
    renderTime: number;
    identifier: string;
};

export type NavigationTimingsPerformanceEntry = PerformanceNavigationTiming;
