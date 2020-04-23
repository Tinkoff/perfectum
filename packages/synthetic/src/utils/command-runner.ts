import emoji from 'node-emoji';
import killProcessTree from 'tree-kill';
import { spawn, ChildProcess } from 'child_process';
import Logger from '../logger';

export const runCommandProcessAndWaitForComplete = async (
    logger: Logger,
    command: string,
    commandTimeout = 5,
    commandCompleteStringPattern: string,
    commandExecutionContextPath?: string,
) => {
    const commandChildProcess = runChildProcess(command, commandExecutionContextPath);

    const stopCommandProcessCallback = createStopProcessCallback(commandChildProcess.pid, logger);

    const commandProcessData = await waitForCommandCompleteOrTimeout(
        logger,
        command,
        commandTimeout,
        commandChildProcess,
        commandCompleteStringPattern
    );

    const {
        isCommandTimedOut,
        isCommandCompleted,
        standardErrorCommandData,
        standardOutputCommandData
    } = commandProcessData;

    if (isCommandCompleted) {
        return stopCommandProcessCallback;
    }

    await stopCommandProcessCallback();

    // WEB-379: Organize correct work with exceptions
    if (isCommandTimedOut) {
        throw new Error(`Command "${command}" timed out`);
    } else {
        let errorMessage = `Running command "${command}" failed\n\n`;

        if (standardErrorCommandData) {
            errorMessage += `${emoji.get('speech_balloon')}  STDERR: ${standardErrorCommandData}\n`;
        }

        if (standardOutputCommandData) {
            errorMessage += `${emoji.get('speech_balloon')}  STDOUT: ${standardOutputCommandData}`;
        }

        throw new Error(errorMessage);
    }
};

async function waitForCommandCompleteOrTimeout (
    logger: Logger,
    command: string,
    commandTimeout: number,
    commandChildProcess: ChildProcess,
    commandCompleteStringPattern: string
) {
    const commandProcessData = {
        standardErrorCommandData: '',
        standardOutputCommandData: '',
        isCommandTimedOut: false,
        isCommandCompleted: false
    }

    try {
        if (!commandChildProcess.stdout || !commandChildProcess.stderr) {
            return commandProcessData;
        }

        let cancelCommandTimeoutCallback: () => void;
        let successfulCommandCompleteCallback: () => void;
        let unsuccessfulCommandCompleteCallback: () => void;

        const commandCompletePromise = new Promise((resolve, reject) => {
            successfulCommandCompleteCallback = resolve;
            unsuccessfulCommandCompleteCallback = reject;
        });

        const commandTimeoutPromise = new Promise(resolve => {
            const commandTimeoutInMilliseconds = commandTimeout * 60 * 1000;

            const commandTimeoutId = setTimeout(() => {
                commandProcessData.isCommandTimedOut = true;

                resolve();
            }, commandTimeoutInMilliseconds);

            cancelCommandTimeoutCallback = () => clearTimeout(commandTimeoutId);
        });

        const standardOutputDataListener = (chunk: Buffer) => {
            const stringifiedChunk = chunk.toString();

            commandProcessData.standardOutputCommandData += stringifiedChunk;
            commandProcessData.isCommandCompleted = stringifiedChunk.includes(commandCompleteStringPattern);

            if (commandProcessData.isCommandCompleted) {
                cancelCommandTimeoutCallback();
                successfulCommandCompleteCallback();
            }
        };

        const standardErrorDataListener = (chunk: Buffer) => {
            const stringifiedChunk = chunk.toString();

            commandProcessData.standardErrorCommandData += stringifiedChunk;
        };

        const processExitListener = (code: number | null) => {
            if (code !== null && code !== 0) {
                cancelCommandTimeoutCallback();
                unsuccessfulCommandCompleteCallback();
            }
        };

        commandChildProcess.on('exit', processExitListener);
        commandChildProcess.stderr.on('data', standardErrorDataListener);
        commandChildProcess.stdout.on('data', standardOutputDataListener);

        await Promise.race([commandCompletePromise, commandTimeoutPromise]);

        commandChildProcess.stderr.off('data', standardErrorDataListener);
        commandChildProcess.stdout.off('data', standardOutputDataListener);
        commandChildProcess.off('exit', processExitListener);

        return commandProcessData;
    } catch (error) {
        if (error) {
            logger.printError(`\n${emoji.get('rotating_light')}  ${error}\n`);
        }

        return commandProcessData;
    }
}

function runChildProcess(command: string, commandExecutionContextPath?: string) {
    return spawn(command, {
        shell: true,
        stdio: 'pipe',
        cwd: commandExecutionContextPath || process.cwd()
    })
}

function createStopProcessCallback(processIdentifier: number, logger: Logger) {
    return () => new Promise<void>(resolve => {
        killProcessTree(processIdentifier, error => {
            if (error) {
                logger.printError(`\n${emoji.get('rotating_light')}  Stopping a process with PID ${processIdentifier} failed\n\n${error}\n`);
            }

            resolve();
        });
    });
}
