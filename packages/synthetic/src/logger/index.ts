import { green, yellow, red, bold } from 'kleur';
import { LoggerConfig } from './types';

export default class Logger {
    private config: LoggerConfig;

    constructor(initialConfig: LoggerConfig) {
        this.config = initialConfig;
    }

    print(message: string) {
        console.log(green(message));
    }

    printTitle(message: string) {
        console.log(bold().underline().cyan(`\n${message}\n`));
    }

    printWarning(message: string) {
        console.log(yellow(message));
    }

    printError(message: string) {
        console.log(red(message));
    }
}
