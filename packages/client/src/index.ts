import Logger from './logger';
import Performance from './performance';
import MonitoringService from './monitoring';
import { isSupportedEnvironment } from './utils';
import { PerfectumClientConfig } from './types';

export default class PerfectumClient {
    private static logger: Logger;
    private static performance: Performance;
    private static isInitialized: boolean;
    private static isSupportedEnvironment: boolean;

    public static init(config?: PerfectumClientConfig) {
        try {
            if (this.isInitialized) {
                return;
            }

            if (isSupportedEnvironment()) {
                this.isSupportedEnvironment = true;
            } else {
                return;
            }

            const {
                logging,
                sendMetricsUrl,
                sendMetricsData,
                sendMetricsCallback,
                maxPaintTime = Number.POSITIVE_INFINITY,
            } = config || {};

            this.logger = new Logger({ logging });
            this.performance = new Performance({maxPaintTime}, this.logger);

            this.performance.init();

            const metrics = this.performance.getMetrics();

            const monitoringService = new MonitoringService({
                sendMetricsUrl,
                sendMetricsData,
                sendMetricsCallback
            }, this.logger);

            monitoringService.init(metrics);

            this.isInitialized = true;
        } catch (error) {
            this.logger.printError('PerfectumClient:init', error);
        }
    }

    public static startMeasure(markName: string) {
        if (this.isInitialized && this.isSupportedEnvironment) {
            this.performance.startPerformanceMeasure(markName);
        }
    }

    public static stopMeasure(markName: string) {
        if (this.isInitialized && this.isSupportedEnvironment) {
            this.performance.stopPerformanceMeasure(markName);
        }
    }
}
