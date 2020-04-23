import { CommandsNames } from './constants';
import { auditCommandStore } from './audit';

export const commandsStore = {
    [CommandsNames.audit]: auditCommandStore
}
