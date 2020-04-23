import { auditCommandBuilder } from './builder';
import { InitialConfig } from '../../utils/get-initial-config';

export type ParsedArgv = ReturnType<typeof auditCommandBuilder>['argv'] & InitialConfig;
