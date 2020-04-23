import {
    DeviceTypes,
    ResourceTypes,
    MetricValueTypes,
    SyntheticPerformanceBudget,
    SyntheticPerformanceMetrics
} from '../../types';
import { LighthouseBudget } from '../configs/types';

export const createLighthouseBudget = (
    performanceBudget: SyntheticPerformanceBudget,
    deviceType: DeviceTypes,
    metricValueType = MetricValueTypes.current
) => {
    const lighthouseBudget: LighthouseBudget = {
        timings: [],
        resourceSizes: [],
        resourceCounts: []
    };

    const validMetricNames = getValidMetricNames(performanceBudget);
    const timingsMetricNames = getTimingsMetricNames(validMetricNames);
    const resourceMetricNames = getResourceMetricNames(validMetricNames);

    addTimingsMetricTresholdsToLighthouseBudget(
        timingsMetricNames,
        performanceBudget,
        lighthouseBudget,
        deviceType,
        metricValueType
    );

    addResourceMetricTresholdsToLighthouseBudget(
        resourceMetricNames,
        performanceBudget,
        lighthouseBudget,
        deviceType,
        metricValueType
    );

    return lighthouseBudget;
}

function getValidMetricNames(performanceBudget: SyntheticPerformanceBudget) {
    const allowedMetricNames = Object.values(SyntheticPerformanceMetrics);
    const metricNamesFromPerformanceBudget = Object.keys(performanceBudget) as SyntheticPerformanceMetrics[];

    return metricNamesFromPerformanceBudget.filter(
        metricName => allowedMetricNames.includes(metricName)
    );
}

function getTimingsMetricNames(metricNames: SyntheticPerformanceMetrics[]) {
    return metricNames.filter(metricName => {
        if (
            metricName === SyntheticPerformanceMetrics.resourceSizes ||
            metricName === SyntheticPerformanceMetrics.resourceRequests
        ) {
            return false;
        }

        return true;
    });
}

function getResourceMetricNames(metricNames: SyntheticPerformanceMetrics[]) {
    return metricNames.filter(metricName => {
        if (
            metricName === SyntheticPerformanceMetrics.resourceSizes ||
            metricName === SyntheticPerformanceMetrics.resourceRequests
        ) {
            return true;
        }

        return false;
    });
}

function isValidBudgetValue(budgetValue: number | string) {
    return typeof budgetValue === 'number' && !isNaN(budgetValue);
}

function addTimingsMetricTresholdsToLighthouseBudget(
    timingsMetricNames: SyntheticPerformanceMetrics[],
    performanceBudget: SyntheticPerformanceBudget,
    lighthouseBudget: LighthouseBudget,
    deviceType: DeviceTypes,
    metricValueType: MetricValueTypes
) {
    timingsMetricNames.forEach(metricName => {
        const budgetValue = performanceBudget[metricName]?.[deviceType]?.[metricValueType];

        if (!isValidBudgetValue(budgetValue)) {
            return;
        }

        lighthouseBudget.timings.push({
            metric: metricName,
            budget: budgetValue
        });
    })
}

function addResourceMetricTresholdsToLighthouseBudget(
    resourceMetricNames: SyntheticPerformanceMetrics[],
    performanceBudget: SyntheticPerformanceBudget,
    lighthouseBudget: LighthouseBudget,
    deviceType: DeviceTypes,
    metricValueType: MetricValueTypes
) {
    resourceMetricNames.forEach(metricName => {
        if (metricName === SyntheticPerformanceMetrics.resourceSizes) {
            const resourceTypes = Object.keys(performanceBudget[metricName]) as ResourceTypes[];

            resourceTypes.forEach((resourceType) => {
                const budgetValue = performanceBudget[metricName]?.[resourceType]?.[deviceType]?.[metricValueType];

                if (!isValidBudgetValue(budgetValue)) {
                    return;
                }

                lighthouseBudget.resourceSizes.push({
                    resourceType,
                    budget: budgetValue
                });
            })

            return;
        }

        if (metricName === SyntheticPerformanceMetrics.resourceRequests) {
            const resourceTypes = Object.keys(performanceBudget[metricName]) as ResourceTypes[];

            resourceTypes.forEach((resourceType) => {
                const budgetValue = performanceBudget[metricName]?.[resourceType]?.[deviceType]?.[metricValueType];

                if (!isValidBudgetValue(budgetValue)) {
                    return;
                }

                lighthouseBudget.resourceCounts.push({
                    resourceType,
                    budget: budgetValue
                });
            })

            return;
        }
    })
}
