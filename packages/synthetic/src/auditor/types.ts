import { DeviceTypes } from '../types';
import { AuditConfig } from './configs/types';

export type AuditorConfig = {
    auditConfig: AuditConfig;
    auditOptions: AuditOptions;
}

export type AuditOptions = {
    port: number;
    configPath: string;
};

export type AuditResultStore = {
    [DeviceTypes.mobile]: AuditResult | null;
    [DeviceTypes.desktop]: AuditResult | null;
}

export type AuditResult = {
    lhr: {
        i18n: string;
        audits: string;
        timing: string;
        finalUrl: string;
        userAgent: string;
        fetchTime: string;
        stackPacks: string;
        categories: Record<string, Category>;
        environment: string;
        runWarnings: string;
        runtimeError: string;
        requestedUrl: string;
        configSettings: string;
        categoryGroups: string;
        lighthouseVersion: string;
    };
}

type Category = {
    id: string;
    title: string;
    description?: string;
    manualDescription?: string;
    score: number | null;
}
