import { Browser } from 'puppeteer';

export type AuthenticatorConfig = {
    browserWebSocketUrl: string;
    authenticationScriptPath: string;
}

export type AuthenticationScriptArguments = {
    url: string;
    browser: Browser;
};

export type AuthenticationScript = (args: AuthenticationScriptArguments) => Promise<void>;
