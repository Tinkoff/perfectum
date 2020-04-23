import { auditCommandBuilder } from './builder';
import { auditCommandHandler } from './handler';
import { AUDIT_COMMAND } from './constants';

export const auditCommandStore= {
    cmd: AUDIT_COMMAND.command,
    desc: AUDIT_COMMAND.description,
    builder: auditCommandBuilder,
    handler: auditCommandHandler
};
