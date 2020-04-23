import { LoggerConfig, InitialLoggerConfig } from './types';

export default class Logger {
    private config: LoggerConfig = {
        logging: false
    };

    constructor(initialConfig: InitialLoggerConfig = {}) {
        this.config = {
            ...this.config,
            ...initialConfig
        };
    }

    printError(methodName: string, error: Error) {
        if (this.config.logging) {
            window.console.log(`${methodName} failed, because ${error.message}`);
        }
    }
}
