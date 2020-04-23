import emoji from 'node-emoji';
import Logger from './logger';
import Auditor from './auditor';
import Browser from './browser';
import Builder from './builder';
import Starter from './starter';
import Reporter from './reporter';
import Authenticator from './authenticator';
import { BrowserConfig } from './browser/types';
import { BuilderConfig } from './builder/types';
import { StarterConfig } from './starter/types';
import { AuditConfig } from './auditor/configs/types';
import { AuthenticatorConfig } from './authenticator/types';
import { validatePerformanceConfig } from './utils/config-validators';
import {
    StopProcessCallbackQueue,
    SyntheticPerformanceBudget,
    SyntheticPerformanceConfig
} from './types';
export { SyntheticPerformanceConfig } from './types';

class SyntheticPerformance {
    private config: SyntheticPerformanceConfig;
    private logger: Logger;
    private auditor: Auditor | null = null;
    private reporter: Reporter;
    private authenticator: Authenticator | null = null;
    private stopProcessCallbackQueue: StopProcessCallbackQueue = [];

    constructor(config: SyntheticPerformanceConfig) {
        this.config = config;
        this.logger = new Logger({});
        this.reporter = new Reporter(this.logger, config.reporterConfig);
    }

    async run() {
        try {
            const config = this.config;
            const logger = this.logger;
            const reporter = this.reporter;

            logger.printTitle('Initialization');

            validatePerformanceConfig(config, logger);

            const {
                urls,
                budgets,
                auditConfig,
                browserConfig,
                skipBuildProject,
                skipStartProject,
                numberOfAuditRuns,
                startProjectCommand,
                startProjectTimeout,
                buildProjectCommand,
                buildProjectTimeout,
                authenticationScriptPath,
                commandExecutionContextPath,
                startProjectCompleteStringPattern,
                buildProjectCompleteStringPattern,
                clearReportFilesDirectoryBeforeAudit
            } = config;

            const auditNeedBuildProject = Boolean(buildProjectCommand && !skipBuildProject);
            const auditNeedStartProject = Boolean(startProjectCommand && !skipStartProject);

            if (auditNeedBuildProject || auditNeedStartProject) {
                logger.printTitle('Preparing your project');
            }

            if (auditNeedBuildProject) {
                await this.buildProject({
                    buildProjectCommand,
                    buildProjectTimeout,
                    commandExecutionContextPath,
                    buildProjectCompleteStringPattern
                }, logger);
            }

            if (auditNeedStartProject) {
                await this.startProject({
                    startProjectCommand,
                    startProjectTimeout,
                    commandExecutionContextPath,
                    startProjectCompleteStringPattern
                }, logger);
            }

            if (clearReportFilesDirectoryBeforeAudit) {
                reporter.clearReportFilesDirectory();
            }

            const {
                browserPort,
                browserWebSocketUrl
            } = await this.launchBrowser(browserConfig);

            const urlNamesForPerformanceAudit = Object.keys(urls);

            for (const urlName of urlNamesForPerformanceAudit) {
                const url = urls[urlName];

                logger.printTitle(`Starting performance audit for ${url}`);

                if (authenticationScriptPath) {
                    await this.authenticateProject(url, {
                        browserWebSocketUrl,
                        authenticationScriptPath
                    }, logger);
                }

                await this.auditProject(
                    url,
                    urlName,
                    logger,
                    reporter,
                    browserPort,
                    numberOfAuditRuns,
                    auditConfig,
                    budgets
                );

                logger.print(`${emoji.get('tada')}  Performance audit completed!\n`);
            }
        } catch (error) {
            this.logger.printError(`\n${emoji.get('rotating_light')}  ${error}\n`);
        } finally {
            await this.stopRunningProcesses();
        }
    }

    private async buildProject(config: BuilderConfig, logger: Logger) {
        const stopBuilderProcessCallback = await new Builder(config, logger).run();

        this.stopProcessCallbackQueue.push(stopBuilderProcessCallback);
    }

    private async startProject(config: StarterConfig, logger: Logger) {
        const stopStarterProcessCallback = await new Starter(config, logger).run();

        this.stopProcessCallbackQueue.push(stopStarterProcessCallback);
    }

    private async authenticateProject(url: string, config: AuthenticatorConfig, logger: Logger) {
        if (!this.authenticator) {
            this.authenticator = new Authenticator(config, logger);
        }

        await this.authenticator.run(url);
    }

    private async auditProject(
        url: string,
        urlName: string,
        logger: Logger,
        reporter: Reporter,
        browserPort: number,
        numberOfAuditRuns?: number,
        auditConfig?: AuditConfig,
        performanceBudgets?: SyntheticPerformanceBudget[]
    ) {
        if (!this.auditor) {
            this.auditor = new Auditor(
                logger,
                reporter,
                browserPort,
                auditConfig
            );
        }

        const performanceBudgetForCurrentUrl = performanceBudgets && performanceBudgets
            .filter(budget => budget.url === urlName)
            .shift();

        await this.auditor.run(url, urlName, numberOfAuditRuns, performanceBudgetForCurrentUrl);
    }

    private async launchBrowser(browserConfig?: BrowserConfig) {
        const {
            browserPort,
            browserWebSocketUrl,
            stopBrowserProcessCallback
        } = await new Browser(browserConfig).run();

        this.stopProcessCallbackQueue.push(stopBrowserProcessCallback);

        return {
            browserPort,
            browserWebSocketUrl
        };
    }

    private async stopRunningProcesses() {
        const stopProcessCallbackQueue = this.stopProcessCallbackQueue;

        if (stopProcessCallbackQueue.length) {
            for (const stopProcessCallback of stopProcessCallbackQueue) {
                await stopProcessCallback()
            }
        }
    }
}

export default SyntheticPerformance;
