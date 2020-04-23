import fetch from 'node-fetch';
import deepmerge from 'deepmerge';
import { launch as launchBrowser } from 'chrome-launcher';
import { BrowserConfig, BrowserMetadata, } from './types';

class Browser {
    private config: BrowserConfig;

    constructor(initialBrowserConfig?: BrowserConfig) {
        const defaultBrowserConfig = {
            chromeFlags: ['--headless', '--no-sandbox']
        };

        const browserConfig = initialBrowserConfig
            ? deepmerge(defaultBrowserConfig, initialBrowserConfig)
            : defaultBrowserConfig;

        this.config = browserConfig;
    }

    async run() {
        try {
            const browser = await launchBrowser(this.config);

            const stopBrowserProcessCallback = async () => await browser.kill();

            const browserPort = browser.port;
            const browserMetadata = await this.getBrowserMetadata(browserPort);
            const browserWebSocketUrl = browserMetadata?.webSocketDebuggerUrl;

            if (!browserWebSocketUrl) {
                throw 'WebSocket debugger url was not found';
            }

            return {
                browserPort,
                browserWebSocketUrl,
                stopBrowserProcessCallback
            };
        } catch (error) {
            throw new Error(`Starting browser failed\n\n${error}`);
        }
    }

    private async getBrowserMetadata(port: number) {
        const browserMetadataResponse = await fetch(`http://localhost:${port}/json/version`);
        const browserMetadata = await browserMetadataResponse.json() as BrowserMetadata;

        return browserMetadata;
    }
}

export default Browser;
