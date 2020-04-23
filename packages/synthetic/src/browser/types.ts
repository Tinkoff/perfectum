export type BrowserConfig = Record<string, unknown>;

export type BrowserMetadata = {
    "Browser": string;
    "User-Agent": string;
    "V8-Version": string;
    "WebKit-Version": string;
    "Protocol-Version": string;
    "webSocketDebuggerUrl": string;
}
