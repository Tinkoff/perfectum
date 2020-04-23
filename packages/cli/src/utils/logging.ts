import { green, yellow, red } from 'kleur';

export const print = (message: string) => console.log(green(message));
export const printError = (message: string) => console.log(red(message));
export const printWarning = (message: string) => console.log(yellow(message));
