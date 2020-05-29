![Node.js CI](https://github.com/mu-ts/logger/workflows/Node.js%20CI/badge.svg)

### @mu-ts/logger
# Simple lightweight logging.

This logging framework aims to be a good enough logging framework where being lightweight is an asset. For example FaaS situations like AWS Lambda, Azure Functions, Google Functions, etc. There are a lot out there. A common problem is cold start, where bundle size has an impact.

* [Lightweight](https://bundlephobia.com/result?p=@mu-ts/logger@3.0.2), under `10k`.
* All the basics; 
    * current level checking (`isDebug()`)
    * per level logging (`debug('message')`)
    * a generic (`log('debug', myArgs, here)`)
    * `start('label')` and `stop('label')` for durations
* Non strict logging signatures, throw anything you want as arguments `error(new Error(), 'can', 'go in here', 'itsSomeWhatSmart()')`
* Data filtering, to redact sensitive data like credit cards, secrets or passwords.
* Console based logging.
* Outputs JSON for easier parsing.
* Environment configuration for log level, default value and by named logger. Optional override if ! is present in front of class name. `LOG_LEVEL=info;mylogger trace;!myOverride warn`

## Usage

Trying to keep it simple. Use `LoggerService.named()` to create a new logger. Provide either an object, with a name and level, or just a name and use the default level. __NOTE:__ _The latter option is probably the best so you can use environment variables to change it as needed._

```
import { Logger, LoggerService, inOut, duration} from '@mu-ts/logger';

process.env['LOG_LEVEL'] = 'info;X trace';

export class ClassX {
  private logger: Logger;

  constructor() {
    this.logger = LoggerService.named({ name:'ClassX', adornments: {'foo':'bar'} }); // or simply LoggerService.named('ClassX');
  }

  @duration() // What dis?
  @inOut() // And this?
  public doSync(some: string): string {
    this.logger.trace('my message is this', 'doSync()', some, { clazz: this.constructor.name });
    return 'x';
  }

  @duration() // What dis?
  @inOut() // And this?
  public async doASync(some: string): Promise<string> {
    try {
      this.logger.debug(some, 'my message is this');
      return 'x';
    } catch (error) {
      this.logger.error(error, 'Caught a thing!');
      throw error;
    }
  }
}

const x: ClassX = new ClassX();

const doAThing = async () => {
  x.doSync('Hello Viewer');
  x.doASync('Hello Longer Guy');
};

doAThing();

```

## Adornments

Fancy word to say you can provide a set of static attributes that will be applied to every output statement. This can be useful when you need to add a static value to each log statement for a logger, or set of loggers.

NOTE: Adornments do not apply to decorators, at this time.

## LOG_LEVEL

`LOG_LEVEL` is looked for on `process.env`, and when found, used to define default log levels when hard coded values are not provided for loggers. However, you can optionally override a hard coded value if you add a ! in front of the name of a specific named logger. In this case, it will override hard coded values and set it to the value defined.

For the name of each logger, any string is valid. All values are stored lowercase, so don't expect mixed cases to provide different loggers.

## Decorators

We have two decorators that can help provide a bit more traceability to your logging, `@inOut` and `@duration`.

### @inOut({level})

This decorator can be placed on a function to record each time it is executed. By default it logs at trace level, as the amount of logging can be quite verbose and detailed. 

##### Synchronous Example

```
{
  at: 2019-12-07T20:17:41.992Z,
  clazz: 'ClassX',
  func: 'doSync()',
  msg: 'inOut -->',
  data: { args: [ 'Hello Viewer' ] },
  name: 'ClassX.inOut',
  level: 'debug'
}
{
  at: 2019-12-07T20:17:42.005Z,
  clazz: 'ClassX',
  func: 'doSync()',
  msg: 'inOut <--',
  data: { result: 'x' },
  name: 'ClassX.inOut',
  level: 'debug'
}
```

##### Asynchronous Functions

In the case of async functions, you will see 3 output statements as an additional one is added to record the fact the method returned a Promise, but did not yet resolve.

```
{
  at: 2019-12-07T20:17:42.007Z,
  clazz: 'ClassX',
  func: 'doASync()',
  msg: 'inOut -->',
  data: { args: [ 'Hello Longer Guy' ] },
  name: 'ClassX.inOut',
  level: 'debug'
}
{
  at: 2019-12-07T20:17:42.013Z,
  clazz: 'ClassX',
  func: 'doASync()',
  msg: 'inOut -- promisified function',
  data: { result: {} },
  name: 'ClassX.inOut',
  level: 'debug'
}
{
  at: 2019-12-07T20:17:42.016Z,
  clazz: 'ClassX',
  func: 'doASync()',
  msg: 'inOut <--',
  data: { result: 'x' },
  name: 'ClassX.inOut',
  level: 'debug'
}
```

### @duration()

This decorator will tell you the amount of time it takes for your function to execute. If this is an async function, it will be the amount of time until the promise resolves, not the amount of time to return the promise.

Default implementation outputs values using `console.timeEnd()` the name is assembled together using the logger name, 'duration' and function name.

Example: `X.duration.doASync: 0.366ms`

But wait, that's not JSON! Yea, erring on the side of using out of the box behavior instead of building this out. It's easy to create memory leaks with this kind of behavior. When I do it, I want to take the time to do it right.

## Levels

Pretty standard here, highest level is fatal, lowest (most detailed) is trace. Levels listed below from lowest to highest:

* trace `isTrace()` `trace(...params)`
* debug `isDebug()` `debug(...params)`
* info `isInfo()` `info(...params)`
* warn `isWarn()` `warn(...params)`
* error `isError()` `error(...params)`
* fatal `isFatal()` `fatal(...params)`

For the default logger, each of these levels will use a different output method to take advantage of some of the built in functionality of `console`. So trace, debug and info are all reported using `console.log`, warn is reported using `console.warn` and then error and fatal are reported using `console.error`.

## Filters

Filters are executed against resulting statements to modify the output before it is printed to the console. They should be used sparingly since logging statements can happen quite frequently and get expensive. 

__NOTE:__ Statements clone data being output, to avoid filters manipulating your runtime data model. This can be a bit of a risk since JavaScript/Node uses 'pass by reference'.

While filters can be declared globally on the LoggerService, you can override or provide specific filters when `calling LoggerService.named()`. There is an optional 2nd argument that takes a list of filters.

### Credit Card Filtering

Looks for numbers that 'look' like a credit card. Checks both `data` and `msg` of a `LoggerStatement`. Any value found that is suspected of being a credit card value is replaced with `>>> REDACTED <<<`.

```
import { LoggerService, CreditCardLoggerFilter } from '@mu-ts/logger';
LoggerService.registerFilter(new CreditCardLoggerFilter());
```

### Sensitive Naming Filtering

This filter is untrusting of values and looks only at names of attributes. When any are found with a name that is suspect, its value is redacted.

```
import { LoggerService, SensitiveNameLoggerFilter } from '@mu-ts/logger';
LoggerService.registerFilter(new SensitiveNameLoggerFilter());
```
