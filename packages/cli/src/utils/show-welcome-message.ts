import figlet from 'figlet';
import { yellow } from 'kleur';
import { CLI_WELCOME_MESSAGE } from './constants';

export const showWelcomeMessage = () => console.log(
    yellow(figlet.textSync(CLI_WELCOME_MESSAGE, { horizontalLayout: 'full' }))
);
