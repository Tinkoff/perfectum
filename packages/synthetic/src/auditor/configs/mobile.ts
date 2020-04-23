import { LighthouseConfig, EmulatedFormFactor } from './types';
import { DEFAULT_LIGHTHOUSE_AUDIT_CONFIG_NAME } from './constants';

export const mobileAuditConfig: LighthouseConfig = {
    extends: DEFAULT_LIGHTHOUSE_AUDIT_CONFIG_NAME,
    settings: {
      maxWaitForFcp: 15 * 1000,
      maxWaitForLoad: 35 * 1000,
      emulatedFormFactor: EmulatedFormFactor.mobile,
      throttling: {
        rttMs: 115,
        throughputKbps: 40 * 1024,
        cpuSlowdownMultiplier: 1
      },
      budgets: null
    }
};
