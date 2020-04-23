import { LoggerConfig } from './logger/types';
import { MonitoringServiceConfig } from './monitoring/types';

export type PerfectumClientConfig = Partial<LoggerConfig & MonitoringServiceConfig>;
