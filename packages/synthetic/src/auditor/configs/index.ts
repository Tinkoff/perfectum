import { DeviceTypes } from '../../types';
import { AuditConfig } from './types';
import { mobileAuditConfig } from './mobile';
import { desktopAuditConfig } from './desktop';

export const defaultAuditConfig: AuditConfig = {
    [DeviceTypes.mobile]: mobileAuditConfig,
    [DeviceTypes.desktop]: desktopAuditConfig
}
