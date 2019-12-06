# logger

Simple and lightweight logging.

  //TODO accept function as an argument, that takes in level to determine if it should execute.


# Usage

To get a logger instance you can call `.child({options...})` from a parent logger, use `LoggerService.named('name',{options..})` or you can use the `defaultLogger()` static function, which creates a ConsoleLogger.

```
process.env['LOG_LEVEL'] = '5,child_name 7';

// Using .getChild()
import { Logger, LoggerService, inOut } from '@mu.ts/logger';

LoggerService.setLevel('trace')

private rootLogger: Logger = LoggerService.defaultLogger()

export class X {
  private logger:Logger;
  constructor(parentLogger: Logger){
    this.logger = LoggerService.named('child_name');
  }

  @inOut()
  public funcx(some:string): string {
    return 'x'
  }
}
```

Once you have your logger you can use the functions within and proper gating of execution will be done based on the log level or conditions provided.

# Log Level's

Your logging level will determine what statments are printed out. It is inclusive of the level you set, and all 'higher' level statements. The levels are trace, debug, info, warn and error. So if you set your level to trace, then all messages will be output. If you set your level to warn, only warn and error level statements will be output.

# Environment Variables

You can define default log levels for namespaces as well as a global default using the `LOG_LEVEL` environment variable. Below are the rules to adhere to:

1. Log levels are integers 0 = trace, 3 = debug, 5 = info (default), 7 = warn, 10 = error
1. For multiple values, separate each definition with a semi-colon ';'.
1. To set the level for a specific group or namespace use the name first and the log level second.

Example: `LOGLEVEL=5;mu.config 3;mu.endpoints 7`
