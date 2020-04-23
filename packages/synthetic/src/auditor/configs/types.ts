import { DeviceTypes } from '../../types';
import { SyntheticPerformanceMetrics, ResourceTypes } from '../../types';

export type AuditConfig = Record<DeviceTypes, LighthouseConfig>;

export type LighthouseConfig = {
    extends: string;
    settings: LighthouseSettings;
};

type LighthouseSettings = {
    maxWaitForFcp: number;
    maxWaitForLoad: number;
    budgets: LighthouseBudget[] | null;
    throttling: Record<Throttling, number>;
    emulatedFormFactor: EmulatedFormFactor;
};

export type LighthouseBudget = {
    timings: Record<string, SyntheticPerformanceMetrics | number>[];
    resourceSizes: Record<string, ResourceTypes | number>[];
    resourceCounts: Record<string, ResourceTypes | number>[];
}

export enum EmulatedFormFactor {
    mobile = 'mobile',
    desktop = 'desktop'
}

export enum Throttling {
    rttMs = 'rttMs',
    throughputKbps = 'throughputKbps',
    cpuSlowdownMultiplier = 'cpuSlowdownMultiplier'
}
