import fs from 'fs';
import path from 'path';
import emoji from 'node-emoji';
import puppeteer from 'puppeteer';
import Logger from '../logger';
import { TYPESCRIPT_FILE_EXTENSION } from './constants';
import { AuthenticatorConfig, AuthenticationScript } from './types';

class Authenticator {
    private logger: Logger;
    private config: AuthenticatorConfig;
    private authenticationScript: AuthenticationScript | null = null;

    constructor(config: AuthenticatorConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
    }

    async run(url: string) {
        const {
            browserWebSocketUrl,
            authenticationScriptPath
        } = this.config;

        if (!this.authenticationScript) {
            this.loadAuthenticationScript(authenticationScriptPath);
        }

        if (this.authenticationScript) {
            const browser = await puppeteer.connect({
                browserWSEndpoint: browserWebSocketUrl
            });

            try {
                this.logger.print(`${emoji.get('robot_face')}  Running authentication script...\n`);

                await this.authenticationScript({ url, browser });
            } catch (error) {
                throw new Error(`Running authentication script failed\n\n${error}`);
            } finally {
                browser.disconnect();
            }
        }
    }

    private loadAuthenticationScript(authenticationScriptPath: string) {
        const absoluteAuthenticationScriptPath = path.resolve(process.cwd(), authenticationScriptPath);
        const isAuthenticationScriptPathExists = fs.existsSync(absoluteAuthenticationScriptPath);

        if (!isAuthenticationScriptPathExists) {
            throw new Error(`Authentication script path "${authenticationScriptPath}" does not exist`);
        }

        const authenticationScriptFileExtension = path.extname(absoluteAuthenticationScriptPath);

        if (authenticationScriptFileExtension === TYPESCRIPT_FILE_EXTENSION) {
            require('ts-node').register({ 
                skipProject: true,
                transpileOnly: true,
                compilerOptions: {
                    allowJs: true,
                    module: 'CommonJS'
                }
            });
        }

        this.authenticationScript = require(absoluteAuthenticationScriptPath).default;

        if (this.authenticationScript === undefined) {
            throw new Error('The contents of the authentication script file were not found. \n\nSee the examples of authentication script files in the repository of the project @perfectum/cli.');
        }
    }
}

export default Authenticator;
