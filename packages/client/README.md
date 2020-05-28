# Perfectum Client
Library for measuring client performance metrics :rocket:

## Features
* Using the latest APIs for better performance measurement :dart:
* Measure only user-centric performance metrics :man:
* Minimal impact on application performance :zap:
* Small library size (< 3Kb gzip) :fire:

## Built With
* [Beacon API](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API)
* [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API)
* [PerformanceObserver API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)

## Collected Metrics
* [First Paint Time](https://w3c.github.io/paint-timing/)
* [First Contentful Paint Time](https://w3c.github.io/paint-timing/)
* [Largest Contentful Paint Time](https://wicg.github.io/largest-contentful-paint/)
* [Cumulative Layout Shift](https://wicg.github.io/layout-instability/)
* [First Input Delay Duration](https://wicg.github.io/event-timing/)
* [First Input Delay Start Time](https://wicg.github.io/event-timing/)
* [First Input Delay Event Name](https://wicg.github.io/event-timing/)
* [Total Long Tasks](https://w3c.github.io/longtasks/)
* [First Long Task Start Time](https://w3c.github.io/longtasks/)
* [First Long Task Duration](https://w3c.github.io/longtasks/)
* [Domain Lookup Time](https://w3c.github.io/navigation-timing/)
* [Server Connection Time](https://w3c.github.io/navigation-timing/)
* [Server Response Time](https://w3c.github.io/navigation-timing/)
* [Download Document Time](https://w3c.github.io/navigation-timing/)
* [Network Information](https://wicg.github.io/netinfo/)
* [Device Information](https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent/)
* [Custom Metrics](https://wicg.github.io/element-timing/)

## Installation
```sh
yarn add @perfectum/client
```

## Usage
```javascript
import Perfectum from '@perfectum/client';

Perfectum.init({
  sendMetricsUrl: 'http://example.com/metrics',
  sendMetricsData: {
      app: 'example',
      env: 'production'
  },
  sendMetricsCallback: (metrics) => {
    const data = JSON.stringify(metrics);

    window.navigator.sendBeacon('http://example.com/metrics', data);
  },
});
```

By default, before the user closes the page (unload event), the Perfectum will send an object with the collected metrics to the address specified in the ***sendMetricsUrl*** property.

If you need to add data to the resulting object with collected metrics, for example, the name of the application or the type of environment, you can specify the object with additional data in the ***sendMetricsData*** property.

If you want to implement your own logic for sending the collected metrics, you can specify a callback in the ***sendMetricsCallback*** property that will be called before the user closes the page (unload event). When calling a callback, an [object](./src/performance/types.ts#L25) with collected metrics will be passed as an argument.

## Custom Metrics
Custom metrics are the ability to measure the performance of individual elements on a page or the operations performed in your project. These metrics are necessary to provide the most accurate picture of how users perceive the performance of your application. There are two approaches to measuring custom metrics:

**Measurement at the initialization stage of the application**

At this stage, we may need to measure the time of appearance of the most important page elements on the user's screen, such as a hero image, cta button, lead form etc. For this type of measurement, you need to add the ***elementtiming*** attribute to the HTML element whose performance or time of appearance on the page you would like to measure.

```javascript
<h1 elementtiming="metric-name">Example App</h1>
```

**Measurement at the stage of interaction with the application**

At this stage, we may need to measure the performance of the priority task, the time spent on an important request, or the rendering of specific page components. For this type of measurement, you need to use the special interface provided in the form of two static methods, ***startMeasure*** and ***stopMeasure***.

```javascript
import Perfectum from '@perfectum/client';

Perfectum.startMeasure('metric-name');

someKindOfImportantTask();

Perfectum.stopMeasure('metric-name');
```
