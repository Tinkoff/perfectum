export const isMobileDevice = () => {
    if (navigator.userAgent.indexOf('Mobi') !== -1) { // eslint-disable-line @typescript-eslint/prefer-includes
        return true
    }

    return false
};
