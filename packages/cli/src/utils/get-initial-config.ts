import fs from 'fs';
import path from 'path';
import deepmerge from 'deepmerge';
import yargsParser from 'yargs-parser';
import { SyntheticPerformanceConfig } from '@perfectum/synthetic';
import { DEFAULT_CONFIG_FILE_NAME } from './constants';

export const getInitialConfigFromFile = () => {
    const configFilePath = getConfigFilePath();
    const configFile = readConfigFile(configFilePath);

    const initialConfig: InitialConfig = {
        configFile,
        configFilePath
    };

    return initialConfig;
}

function getConfigFilePath() {
    const defaultConfigFilePath = getDefaultConfigFilePath();
    const configFilePathFromCliArgument = getConfigFilePathFromCliArgument();

    return configFilePathFromCliArgument || defaultConfigFilePath;
}

function getDefaultConfigFilePath() {
    const defaultConfigFilePath = path.resolve(DEFAULT_CONFIG_FILE_NAME);

    if (!isConfigFilePathExists(defaultConfigFilePath)) {
        return;
    }

    return defaultConfigFilePath;
}

function getConfigFilePathFromCliArgument() {
    const parsedArgv = yargsParser(process.argv.slice(2)) as ParsedArgv;

    if (!parsedArgv.config) {
        return;
    }

    const configFilePathFromCliArgument = path.resolve(parsedArgv.config);

    if (!isConfigFilePathExists(configFilePathFromCliArgument)) {
        throw new Error(`Config file path ${parsedArgv.config} does not exist`);
    }

    return configFilePathFromCliArgument;
}

function readConfigFile(configFilePath?: string) {
    if (!configFilePath) {
        return;
    }

    let config = JSON.parse(fs.readFileSync(configFilePath, 'utf8')) as ConfigFile;

    if (config.extends) {
        const currentConfigFileDirectoryPath = path.dirname(configFilePath);
        const parentConfigFilePath = path.resolve(path.join(currentConfigFileDirectoryPath, config.extends));

        if (!isConfigFilePathExists(parentConfigFilePath)) {
            throw new Error(`Base config file path ${config.extends} does not exist`);
        }

        // Удаляем свойство extends из конфига, для того чтобы yargs
        // не использовал его для резолва parent-конфигурации самостоятельно
        delete config.extends;

        const parentConfig = readConfigFile(parentConfigFilePath);

        if (parentConfig) {
            config = deepmerge(parentConfig, config);
        }
    }

    return config;
}

function isConfigFilePathExists(configFilePath: string) {
    return fs.existsSync(configFilePath);
}

type ParsedArgv = yargsParser.Arguments & {
    config?: string;
}

export type ConfigFile = {
    extends?: string;
    synthetic?: SyntheticPerformanceConfig;
}

export type InitialConfig = {
    configFile?: ConfigFile;
    configFilePath?: string;
}
