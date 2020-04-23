# Perfectum Synthetic
Library for measuring synthetic performance metrics :vertical_traffic_light:

## Features
* Build and launch your project :rocket:
* Authentication before performance audit :ticket:
* Reporting for desktop and mobile devices :clipboard:
* Using performance budgets, including segregation by device type and application page :rotating_light:

## Built With
* [Chrome Launcher](https://github.com/GoogleChrome/chrome-launcher)
* [Lighthouse](https://github.com/GoogleChrome/lighthouse)
* [Puppeteer](https://github.com/puppeteer/puppeteer)

## Installation
```sh
yarn add @perfectum/synthetic -D
```

## Usage
For more convenient work with this package, we recommend using [Perfectum CLI](../cli/).

```javascript
import Perfectum from '@perfectum/synthetic';

new Perfectum({
  urls: {
    main: 'https://www.example.com/',
    profile: 'https://www.example.com/profile/',
  },
  budgets: [
    {
      'url': 'main',
      'first-contentful-paint': {
        'mobile': {
          'target': 2150,
          'current': 2650
         },
        'desktop': {
          'target': 1850,
          'current': 2350
        }
      },
      'interactive': {
        'mobile': {
          'target': 2950,
          'current': 3550
        },
        'desktop': {
          'target': 2650,
          'current': 3250
        }
      }
    }
  ],
  numberOfAuditRuns: 5,
  buildProjectTimeout: 10,
  startProjectTimeout: 10,
  buildProjectCommand: 'yarn run build',
  startProjectCommand: 'yarn run start',
  buildProjectCompleteStringPattern: 'The project was built',
  startProjectCompleteStringPattern: 'You can now view example in the browser'
});
```
