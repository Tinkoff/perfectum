import { MetricsStore } from "../performance/types";

export type MonitoringServiceConfig = {
    sendMetricsUrl?: string;
    sendMetricsData?: Record<string, string>;
    sendMetricsCallback?: (metrics: MetricsStore) => void;
};
