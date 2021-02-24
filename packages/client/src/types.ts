import { LoggerConfig } from './logger/types';
import { MonitoringServiceConfig } from './monitoring/types';
import { PerformanceServiceConfig } from './performance/types';

export type PerfectumClientConfig = Partial<
  LoggerConfig & MonitoringServiceConfig & PerformanceServiceConfig
>;
