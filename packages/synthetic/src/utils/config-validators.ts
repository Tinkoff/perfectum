import emoji from 'node-emoji';
import Logger from '../logger';
import { SyntheticPerformanceConfig, SyntheticPerformanceBudget } from '../types';

export const validatePerformanceConfig = (config: SyntheticPerformanceConfig, logger: Logger) => {
    logger.print(`${emoji.get('gear')}   Checking config...`);

    const { urls, budgets, numberOfAuditRuns } = config;

    validateUrlsProperty(urls)

    if (numberOfAuditRuns !== undefined) {
        validateNumberOfAuditRunsProperty(numberOfAuditRuns);
    }

    if (budgets !== undefined) {
        validateBudgetsProperty(budgets);
    }
}

function validateUrlsProperty(urls: Record<string, string> | undefined) {
    if (urls === undefined) {
        throw new Error('Specify "urls" property to run a performance audit');
    }

    if (typeof urls !== 'object' || Array.isArray(urls) || urls === null) {
        throw new Error('The "urls" property must be an object');
    }

    if (Object.keys(urls).length === 0) {
        throw new Error('Specify at least one URL in the "urls" property to run a performance audit');
    }

    Object.values(urls).forEach(url => {
        if (typeof url !== 'string') {
            throw new Error('The values of the "urls" property object must be a string');
        }
    })
}

function validateBudgetsProperty(budgets: SyntheticPerformanceBudget[]) {
    if (!Array.isArray(budgets)) {
        throw new Error('The "budgets" property must be an array');
    }

    budgets.forEach(budget => {
        if (typeof budget.url !== 'string') {
            throw new Error('The "url" property in budget must be a string');
        }
    })
}

function validateNumberOfAuditRunsProperty(numberOfAuditRuns: number) {
    if (typeof numberOfAuditRuns !== 'number' || isNaN(numberOfAuditRuns)) {
        throw new Error('The "numberOfAuditRuns" property must be a number');
    }

    if (typeof numberOfAuditRuns === 'number' && numberOfAuditRuns < 1) {
        throw new Error('The value of the "numberOfAuditRuns" property must not be less than one');
    }
}
