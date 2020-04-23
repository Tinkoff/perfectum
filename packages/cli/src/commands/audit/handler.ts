import path from 'path';
import emoji from 'node-emoji';
import deepmerge from 'deepmerge';
import SyntheticPerformance, { SyntheticPerformanceConfig } from '@perfectum/synthetic';
import { printError } from '../../utils/logging';
import { ParsedArgv } from './types';

export const auditCommandHandler = async (argv: ParsedArgv) => {
    try {
        const resolvedAuthenticationScriptPath = resolveAuthenticationScriptPath(argv);
        const resolvedCommandExecutionContextPath = resolveCommandExecutionContextPath(argv);

        const syntheticPerformanceConfigFromFile = getSyntheticPerformanceConfigFromFile(argv);

        // Remove unnecessary properties added during initialization of the config (get-initial-config.ts)
        delete argv.configFile;
        delete argv.configFilePath;

        const syntheticPerformanceConfigFromCli = argv;

        const syntheticPerformanceConfig = deepmerge(
            syntheticPerformanceConfigFromFile || {},
            syntheticPerformanceConfigFromCli,
        ) as SyntheticPerformanceConfig;

        syntheticPerformanceConfig.authenticationScriptPath = resolvedAuthenticationScriptPath;
        syntheticPerformanceConfig.commandExecutionContextPath = resolvedCommandExecutionContextPath;

        await runSyntheticPerformanceAudit(syntheticPerformanceConfig);

        process.exit(0);
    } catch (error) {
        printError(`\n${emoji.get('rotating_light')}  Audit command failed\n\n${error}\n`);

        process.exit(1);
    }
};

function resolveAuthenticationScriptPath(argv: ParsedArgv) {
    if (!argv.configFilePath) {
        return;
    }

    const configFileDirectoryPath = path.dirname(argv.configFilePath);
    const authenticationScriptPathFromCli = argv.authenticationScriptPath;
    const authenticationScriptPathFromConfigFile = argv?.configFile?.synthetic?.authenticationScriptPath;

    if (authenticationScriptPathFromCli) {
        return path.resolve(path.join(
            configFileDirectoryPath,
            authenticationScriptPathFromCli
        ));
    }

    if (authenticationScriptPathFromConfigFile) {
        return path.resolve(path.join(
            configFileDirectoryPath,
            authenticationScriptPathFromConfigFile
        ));
    }
}

function resolveCommandExecutionContextPath(argv: ParsedArgv) {
    if (!argv.configFilePath) {
        return;
    }

    const configFileDirectoryPath = path.dirname(argv.configFilePath);
    const commandExecutionContextPathFromCli = argv.commandExecutionContextPath;
    const commandExecutionContextPathFromConfigFile = argv?.configFile?.synthetic?.commandExecutionContextPath;

    if (commandExecutionContextPathFromCli) {
        return path.resolve(path.join(
            configFileDirectoryPath,
            commandExecutionContextPathFromCli
        ));
    }

    if (commandExecutionContextPathFromConfigFile) {
        return path.resolve(path.join(
            configFileDirectoryPath,
            commandExecutionContextPathFromConfigFile
        ));
    }

    const defaultCommandExecutionContextPath = configFileDirectoryPath;

    return defaultCommandExecutionContextPath;
}

function getSyntheticPerformanceConfigFromFile(argv: ParsedArgv) {
    if (argv?.configFile?.synthetic) {
        const syntheticPerformanceConfigFromFile = argv.configFile.synthetic;

        return syntheticPerformanceConfigFromFile;
    }
}

async function runSyntheticPerformanceAudit(config: SyntheticPerformanceConfig) {
    await new SyntheticPerformance(config).run();
}
