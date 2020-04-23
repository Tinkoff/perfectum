import emoji from 'node-emoji';
import { runCommandProcessAndWaitForComplete } from '../utils/command-runner';
import Logger from '../logger';
import { StarterConfig } from './types';

class Starter {
    private config: StarterConfig;
    private logger: Logger;

    constructor(initialConfig: StarterConfig, logger: Logger) {
        this.config = initialConfig;
        this.logger = logger;
    }

    async run() {
        const {
            startProjectCommand,
            startProjectTimeout,
            commandExecutionContextPath,
            startProjectCompleteStringPattern
        } = this.config;

        const logger = this.logger;

        if (!startProjectCommand) {
            throw new Error('Missed the "startProjectCommand" property');
        }

        if (!startProjectCompleteStringPattern) {
            throw new Error('Missed the "startProjectCompleteStringPattern" property');
        }

        logger.print(`${emoji.get('rocket')}  Starting project...`);

        const stopStarterProcessCallback = await runCommandProcessAndWaitForComplete(
            logger,
            startProjectCommand,
            startProjectTimeout,
            startProjectCompleteStringPattern,
            commandExecutionContextPath
        );

        return stopStarterProcessCallback;
    }
}

export default Starter;
