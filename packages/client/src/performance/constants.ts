import { EntryTypes } from './types';

export const DEFAULT_OBSERVED_ENTRY_TYPES = [
    EntryTypes.paint,
    EntryTypes.element,
    EntryTypes.longTask,
    EntryTypes.navigation,
    EntryTypes.firstInput,
    EntryTypes.layoutShift,
    EntryTypes.largestContentfulPaint
];
