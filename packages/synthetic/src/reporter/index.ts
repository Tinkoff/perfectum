import fs from 'fs';
import path from 'path';
import emoji from 'node-emoji';
import ReportGenerator from 'lighthouse/lighthouse-core/report/report-generator.js';
import { AuditResult } from '../auditor/types';
import Logger from '../logger';
import { DeviceTypes } from '../types';
import { ReporterConfig, ReportFormats } from './types';
import {
    DEFAULT_REPORT_FORMATS,
    DEFAULT_REPORT_PREFIX_NAME,
    DEFAULT_REPORT_OUTPUT_PATH
} from './constants';

class Reporter {
    private logger: Logger;
    private config: ReporterConfig;

    constructor(logger: Logger, initialReporterConfig?: ReporterConfig) {
        this.config = {
            reportFormats: initialReporterConfig?.reportFormats || DEFAULT_REPORT_FORMATS,
            reportPrefixName: initialReporterConfig?.reportPrefixName || DEFAULT_REPORT_PREFIX_NAME,
            reportOutputPath: initialReporterConfig?.reportOutputPath || DEFAULT_REPORT_OUTPUT_PATH
        };
        this.logger = logger;
    }

    public createReport(auditResult: AuditResult, urlName: string, deviceType: DeviceTypes) {
        try {
            this.logger.print(`\n${emoji.get('clipboard')}  Creating performance report for ${deviceType} devices...\n`);

            this.generateAndSaveReport(auditResult, urlName, deviceType);
        } catch (error) {
            throw new Error(`Creating performance report for ${deviceType} devices failed\n\n${error}`);
        }
    }

    private generateAndSaveReport(auditResult: AuditResult, urlName: string, deviceType: DeviceTypes) {
        const reportFileName = this.getReportFileName(urlName, deviceType);
        const reportFilesDirectoryPath = this.getReportFilesDirectoryPath();

        if (!this.isReportFilesDirectoryExists(reportFilesDirectoryPath)) {
            this.createReportFilesDirectory(reportFilesDirectoryPath);
        }

        const reportFilePath = path.join(reportFilesDirectoryPath, reportFileName);

        if (this.config.reportFormats?.includes(ReportFormats.html)) {
            this.generateAndSaveReportAsHtml(auditResult, reportFilePath);
        }

        if (this.config.reportFormats?.includes(ReportFormats.json)) {
            this.generateAndSaveReportAsJson(auditResult, reportFilePath);
        }
    }

    private generateAndSaveReportAsJson(auditResult: AuditResult, reportFilePath: string) {
        fs.writeFileSync(`${reportFilePath}.json`, JSON.stringify(auditResult.lhr));
    }

    private generateAndSaveReportAsHtml(auditResult: AuditResult, reportFilePath: string) {
        fs.writeFileSync(`${reportFilePath}.html`, ReportGenerator.generateReportHtml(auditResult.lhr));
    }

    private createReportFilesDirectory(reportFilesDirectoryPath: string) {
        fs.mkdirSync(reportFilesDirectoryPath, { recursive: true });
    }

    private isReportFilesDirectoryExists(reportFilesDirectoryPath: string) {
        const isReportFilesDirectoryExists = fs.existsSync(reportFilesDirectoryPath);

        return isReportFilesDirectoryExists;
    }

    private getReportFileName(urlName: string, deviceType: DeviceTypes) {
        const { reportPrefixName } = this.config;

        const replacedUrlName = urlName.replace(/[\W_]+/gi, '-');
        const replacedPrefixName = reportPrefixName.replace(/[\W_]+/gi, '-');

        const reportFileName = `${replacedPrefixName}-${replacedUrlName}-${deviceType}-${Date.now()}`;

        return reportFileName;
    }

    private getReportFilesDirectoryPath() {
        const { reportOutputPath } = this.config;

        const reportFilesDirectoryPath = path.join(process.cwd(), reportOutputPath);

        return reportFilesDirectoryPath;
    }

    public clearReportFilesDirectory() {
        const reportFilesDirectoryPath = this.getReportFilesDirectoryPath();

        if (!this.isReportFilesDirectoryExists(reportFilesDirectoryPath)) {
            return;
        }

        const reportFileNames = fs.readdirSync(reportFilesDirectoryPath);

        for (const reportFileName of reportFileNames) {
            const reportFilePath = path.join(reportFilesDirectoryPath, reportFileName);

            fs.unlinkSync(reportFilePath);
        }
    }
}

export default Reporter;
