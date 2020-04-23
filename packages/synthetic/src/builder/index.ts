import emoji from 'node-emoji';
import { runCommandProcessAndWaitForComplete } from '../utils/command-runner';
import { BuilderConfig } from './types';
import Logger from '../logger';

class Builder {
    private config: BuilderConfig;
    private logger: Logger;

    constructor(initialConfig: BuilderConfig, logger: Logger) {
        this.config = initialConfig;
        this.logger = logger;
    }

    async run() {
        const {
            buildProjectCommand,
            buildProjectTimeout,
            commandExecutionContextPath,
            buildProjectCompleteStringPattern
        } = this.config;

        const logger = this.logger;

        if (!buildProjectCommand) {
            throw new Error('Missed the "buildProjectCommand" property');
        }

        if (!buildProjectCompleteStringPattern) {
            throw new Error('Missed the "buildProjectCompleteStringPattern" property');
        }

        logger.print(`${emoji.get('package')}  Building project...`);

        const stopBuilderProcessCallback = await runCommandProcessAndWaitForComplete(
            logger,
            buildProjectCommand,
            buildProjectTimeout,
            buildProjectCompleteStringPattern,
            commandExecutionContextPath,
        );

        return stopBuilderProcessCallback;
    }
}

export default Builder;
