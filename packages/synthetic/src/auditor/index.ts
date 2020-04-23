import path from 'path';
import emoji from 'node-emoji';
import deepmerge from 'deepmerge';
import lighthouse from 'lighthouse';
import Logger from '../logger';
import Reporter from '../reporter';
import { createLighthouseBudget } from './utils/create-lighthouse-budget';
import { DeviceTypes, SyntheticPerformanceBudget } from '../types';
import { AuditConfig } from './configs/types';
import { defaultAuditConfig } from './configs';
import { AuditorConfig, AuditResult } from './types';
import { DEFAULT_NUMBER_OF_AUDIT_RUNS, AUDIT_CONFIGS_DIRECTORY_NAME } from './constants';

class Auditor {
    private config: AuditorConfig;
    private reporter: Reporter;
    private logger: Logger;

    constructor(
        logger: Logger,
        reporter: Reporter,
        browserPort: number,
        initialAuditConfig?: AuditConfig
    ) {
        this.logger = logger;
        this.reporter = reporter;

        const auditConfig = initialAuditConfig
            ? deepmerge(defaultAuditConfig, initialAuditConfig)
            : defaultAuditConfig;

        const auditOptions = {
            port: browserPort,
            configPath: path.resolve(__dirname, AUDIT_CONFIGS_DIRECTORY_NAME),
        };

        this.config = {
            auditConfig,
            auditOptions
        }
    }

    async run(
        url: string,
        urlName: string,
        numberOfAuditRuns?: number,
        performanceBudget?: SyntheticPerformanceBudget,
    ) {
        try {
            await this.runMobilePerformanceAudit(url, urlName, numberOfAuditRuns, performanceBudget);
            await this.runDesktopPerformanceAudit(url, urlName, numberOfAuditRuns, performanceBudget);
        } catch (error) {
            throw new Error(`Running performance audit failed\n\n${error}`);
        }
    }

    private async runMobilePerformanceAudit(
        url: string,
        urlName: string,
        numberOfAuditRuns?: number,
        performanceBudget?: SyntheticPerformanceBudget
    ) {
        await this.runPerformanceAudit(
            url,
            urlName,
            DeviceTypes.mobile,
            numberOfAuditRuns,
            performanceBudget
        );
    }

    private async runDesktopPerformanceAudit(
        url: string,
        urlName: string,
        numberOfAuditRuns?: number,
        performanceBudget?: SyntheticPerformanceBudget
    ) {
        await this.runPerformanceAudit(
            url,
            urlName,
            DeviceTypes.desktop,
            numberOfAuditRuns,
            performanceBudget
        );
    }

    private async runPerformanceAudit(
        url: string,
        urlName: string,
        deviceType: DeviceTypes,
        numberOfAuditRuns = DEFAULT_NUMBER_OF_AUDIT_RUNS,
        performanceBudget?: SyntheticPerformanceBudget,
    ) {
        const {
            auditConfig,
            auditOptions
        } = this.config;

        if (performanceBudget) {
            const lighthouseBudget = createLighthouseBudget(performanceBudget, deviceType);

            auditConfig[deviceType].settings.budgets = [lighthouseBudget];
        } else {
            auditConfig[deviceType].settings.budgets = null;
        }

        const auditResults: AuditResult[] = [];

        for (let run = 1; run <= numberOfAuditRuns; run++) {
            this.logger.print(`${emoji.get('mag_right')}  Running ${numberOfAuditRuns > 1 ? `${run} of ${numberOfAuditRuns} ` : ''}performance audit for ${deviceType} devices...`);

            const auditResult = await lighthouse(
                url,
                auditOptions,
                auditConfig[deviceType]
            ) as AuditResult;

            auditResults.push(auditResult);
        }

        const medianAuditResult = this.getMedianAuditResult(auditResults, deviceType);

        if (medianAuditResult) {
            this.reporter.createReport(medianAuditResult, urlName, deviceType);
        }
    }

    private getMedianAuditResult(auditResults: AuditResult[], deviceType: DeviceTypes) {
        if (auditResults.length === 0) {
            this.logger.printWarning(`\n${emoji.get('warning')}   No audit results found for ${deviceType} devices\n`);

            return null;
        }

        const validAuditResults = this.validateAuditResultsByPerformanceCategoryScore(auditResults);

        if (validAuditResults.length === 0) {
            this.logger.printWarning(`\n${emoji.get('warning')}   No valid audit results found for ${deviceType} devices\n`);

            return null;
        }

        const sortedAuditResults = this.sortAuditResultsByPerformanceCategoryScore(validAuditResults);

        const middleIndexOfSortedAuditResultsArray = Math.floor(sortedAuditResults.length / 2);

        // We do not consider the case of an even number of samples (audit results) due to the complex structure of the analyzed data
        const medianAuditResult = sortedAuditResults[middleIndexOfSortedAuditResultsArray];

        return medianAuditResult;
    }

    private validateAuditResultsByPerformanceCategoryScore(auditResults: AuditResult[]) {
        return auditResults.filter(auditResult => {
            const performanceCategoryScore = auditResult?.lhr?.categories?.performance?.score;

            if (typeof performanceCategoryScore === 'number' && !isNaN(performanceCategoryScore)) {
                return true;
            }

            return false;
        });
    }

    private sortAuditResultsByPerformanceCategoryScore(auditResults: AuditResult[]) {
        return auditResults.sort((a, b) => {
            const performanceCategoryScoreOfFirstAuditResult = a?.lhr?.categories?.performance?.score as number;
            const performanceCategoryScoreOfSecondAuditResult = b?.lhr?.categories?.performance?.score as number;

            return performanceCategoryScoreOfFirstAuditResult - performanceCategoryScoreOfSecondAuditResult;
        });
    }
}

export default Auditor;
