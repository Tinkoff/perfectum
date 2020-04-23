import yargs from 'yargs';
import { commandsStore } from './commands';
import { CommandsNames } from './commands/constants';
import { getInitialConfigFromFile } from './utils/get-initial-config';

export const runCommandLineInterface = () => {
    yargs
        .help('help')
        .usage('perfectum <command> <options>')
        .demand(1)
        .command(
            commandsStore[CommandsNames.audit].cmd,
            commandsStore[CommandsNames.audit].desc,
            commandsStore[CommandsNames.audit].builder,
            commandsStore[CommandsNames.audit].handler // eslint-disable-line @typescript-eslint/no-misused-promises
        )
        .config(getInitialConfigFromFile())
        .argv
}
