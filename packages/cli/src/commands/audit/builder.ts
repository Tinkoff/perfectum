import { Argv } from 'yargs';

export const auditCommandBuilder = (yargs: Argv) => {
    return yargs
        .options('urls', {
            alias: 'u',
            describe: 'The set of URLs (e.g. individual application pages) whose performance you want to audit'
        })
        .options('config', {
            alias: 'c',
            type: 'string',
            describe: 'Path to configuration file'
        })
        .options('numberOfAuditRuns', {
            alias: 'n',
            type: 'number',
            describe: 'Number of performance audit runs'
        })
        .options('authenticationScriptPath', {
            type: 'string',
            describe: 'Path to authentication script file'
        })
        .options('commandExecutionContextPath', {
            type: 'string',
            describe: 'Path to execution context directory'
        })
        .options('skipBuildProject', {
            type: 'boolean',
            describe: 'Skip the build phase of the project'
        })
        .options('skipStartProject', {
            type: 'boolean',
            describe: 'Skip the start phase of the project'
        })
        .options('startProjectCommand', {
            type: 'string',
            describe: 'Command to start the project'
        })
        .options('buildProjectCommand', {
            type: 'string',
            describe: 'Command to build the project'
        })
        .options('startProjectTimeout', {
            type: 'number',
            describe: 'Timeout for the project start command in minutes'
        })
        .options('buildProjectTimeout', {
            type: 'number',
            describe: 'Timeout for the project build command in minutes'
        })
        .options('startProjectCompleteStringPattern', {
            type: 'string',
            describe: 'String pattern for listening to the end of the project start'
        })
        .options('buildProjectCompleteStringPattern', {
            type: 'string',
            describe: 'String pattern for listening to the end of the project build'
        })
        .options('clearReportFilesDirectoryBeforeAudit', {
            type: 'boolean',
            describe: 'Clear the directory with report files before audit'
        })
};
