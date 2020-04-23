import { AuditConfig } from './auditor/configs/types';
import { BrowserConfig } from './browser/types';
import { ReporterConfig } from './reporter/types';

export type SyntheticPerformanceConfig = {
    urls: Record<string, string>;
    budgets?: SyntheticPerformanceBudget[];
    auditConfig?: AuditConfig;
    browserConfig?: BrowserConfig;
    reporterConfig?: ReporterConfig;
    numberOfAuditRuns?: number;
    skipBuildProject?: boolean;
    skipStartProject?: boolean;
    startProjectCommand?: string;
    startProjectTimeout?: number;
    buildProjectCommand?: string;
    buildProjectTimeout?: number;
    authenticationScriptPath?: string;
    commandExecutionContextPath?: string;
    startProjectCompleteStringPattern?: string;
    buildProjectCompleteStringPattern?: string;
    clearReportFilesDirectoryBeforeAudit?: boolean;
}

export enum SyntheticPerformanceMetrics {
    speedIndex = 'speed-index',
    firstPaint = 'first-paint',
    firstCpuIdle = 'first-cpu-idle',
    resourceSizes = 'resource-sizes',
    timeToInteractive = 'interactive',
    maxPotentialFid = 'max-potential-fid',
    resourceRequests = 'resource-requests',
    lighthouseScores = 'lighthouse-scores',
    totalBlockingTime = 'total-blocking-time',
    firstMeaningfulPaint = 'first-meaningful-paint',
    firstContentfulPaint = 'first-contentful-paint',
    estimatedInputLatency = 'estimated-input-latency',
    largestContentfulPaint = 'largest-contentful-paint'
}

export enum ResourceTypes {
    font = 'font',
    total = 'total',
    image = 'image',
    media = 'media',
    other = 'other',
    script = 'script',
    document = 'document',
    stylesheet = 'stylesheet',
    thirdParty = 'third-party'
}

export enum DeviceTypes {
    mobile = 'mobile',
    desktop = 'desktop'
}

export enum MetricValueTypes {
    target = 'target',
    current = 'current'
}

export type SyntheticPerformanceBudget = {
    url: string;
    [SyntheticPerformanceMetrics.speedIndex]: Record<DeviceTypes, Record<MetricValueTypes, number>>;
    [SyntheticPerformanceMetrics.firstPaint]: Record<DeviceTypes, Record<MetricValueTypes, number>>;
    [SyntheticPerformanceMetrics.firstCpuIdle]: Record<DeviceTypes, Record<MetricValueTypes, number>>;
    [SyntheticPerformanceMetrics.resourceSizes]: Record<ResourceTypes, Record<DeviceTypes, Record<MetricValueTypes, number>>>;
    [SyntheticPerformanceMetrics.resourceRequests]: Record<ResourceTypes, Record<DeviceTypes, Record<MetricValueTypes, number>>>;
    [SyntheticPerformanceMetrics.lighthouseScores]: Record<LighthouseCategories, Record<DeviceTypes, Record<MetricValueTypes, number>>>;
    [SyntheticPerformanceMetrics.maxPotentialFid]: Record<DeviceTypes, Record<MetricValueTypes, number>>;
    [SyntheticPerformanceMetrics.totalBlockingTime]: Record<DeviceTypes, Record<MetricValueTypes, number>>;
    [SyntheticPerformanceMetrics.timeToInteractive]: Record<DeviceTypes, Record<MetricValueTypes, number>>;
    [SyntheticPerformanceMetrics.firstMeaningfulPaint]: Record<DeviceTypes, Record<MetricValueTypes, number>>;
    [SyntheticPerformanceMetrics.firstContentfulPaint]: Record<DeviceTypes, Record<MetricValueTypes, number>>;
    [SyntheticPerformanceMetrics.estimatedInputLatency]: Record<DeviceTypes, Record<MetricValueTypes, number>>;
    [SyntheticPerformanceMetrics.largestContentfulPaint]: Record<DeviceTypes, Record<MetricValueTypes, number>>;
}

export type StopProcessCallbackQueue = Array<() => Promise<void | {}>>;

enum LighthouseCategories {
    seo = 'seo',
    pwa = 'pwa',
    performance = 'performance',
    accessibility = 'accessibility',
    bestPractices = 'best-practices'
}
