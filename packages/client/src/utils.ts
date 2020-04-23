const isBrowserEnvironment = () => (
    typeof window !== 'undefined'
)

const isPageStateVisible = () => (
    window.document &&
    window.document.hidden !== undefined &&
    window.document.hidden === false
)

const isSupportNavigatorApi = () => (
    'navigator' in window
)

const isSupportSendBeaconApi = () => (
    'sendBeacon' in navigator
)

const isSupportPerformanceApi = () => (
    'performance' in window
)

const isSupportUserTimingApi = () => (
    'mark' in performance &&
    'measure' in performance
)

const isSupportPerformanceObserverApi = () => (
    'PerformanceObserver' in window
)

const isSupportSupportedEntryTypesProperty = () => (
    'supportedEntryTypes' in PerformanceObserver
)

export const isSupportedEnvironment = () => (
    isBrowserEnvironment() &&
    isPageStateVisible() &&
    isSupportNavigatorApi() &&
    isSupportSendBeaconApi() &&
    isSupportPerformanceApi() &&
    isSupportUserTimingApi() &&
    isSupportPerformanceObserverApi() &&
    isSupportSupportedEntryTypesProperty()
)
