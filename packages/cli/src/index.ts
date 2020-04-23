import emoji from 'node-emoji';
import { printError } from './utils/logging';
import { showWelcomeMessage } from './utils/show-welcome-message';
import { clearTerminalWindow } from './utils/clear-terminal-window';
import { runCommandLineInterface } from './cli';

try {
    clearTerminalWindow();
    showWelcomeMessage();
    runCommandLineInterface();
} catch (error) {
    printError(`\n${emoji.get('rotating_light')}  ${error}\n`);

    process.exit(1);
}
