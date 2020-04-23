import Logger from '../logger';
import { MetricsStore } from '../performance/types';
import { MonitoringServiceConfig } from './types';

export default class MonitoringService {
    private logger: Logger;
    private config: MonitoringServiceConfig;

    constructor(config: MonitoringServiceConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
    }

    public init(metrics: MetricsStore) {
        const {
            sendMetricsUrl,
            sendMetricsData,
            sendMetricsCallback
        } = this.config;

        window.addEventListener('unload', () => {
            try {
                if (sendMetricsCallback) {
                    sendMetricsCallback(metrics);
                    return;
                }

                if (sendMetricsUrl) {
                    this.sendMetrics(metrics, sendMetricsUrl, sendMetricsData);
                }
            } catch (error) {
                this.logger.printError('Monitoring.init', error);
            }
        }, false);
    }

    private sendMetrics(
        metrics: MetricsStore,
        sendMetricsUrl: string,
        sendMetricsData?: Record<string, string>
    ) {
        const data = JSON.stringify({
            ...metrics,
            ...sendMetricsData
        });

        window.navigator.sendBeacon(sendMetricsUrl, data);
    }
}
