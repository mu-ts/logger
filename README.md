# logger

Simple and lightweight logging.

# Usage

To get a logger instance you can call `.child(name)` from a parent logger, or you can use the `defaultLogger()` static function, which creates a ConsoleLogger.

```
process.env['LOG_LEVEL'] = '5,child_name 7';

// Using .getChild()
import { Logger } from '@mu.ts/logger';
constructor(parentLogger: Logger){
    this.logger = parentLogger.child('child_name');
}
// Using static .getLogger()
import { Logger, defaultLogger } from '@mu.ts/logger';
this.logger: Logger = defaultLogger('my.name');
```

Once you have your logger you can use the functions within and proper gating of execution will be done based on the log level or conditions provided.

# Namespaces

So each logger gets a namespace, and child loggers created from a parent use the parents namespace as a prefix to its own. So if you have a root logger `mu` and call `.child('endpoints')` the child's namespace will be `mu.endpoints`.

# Log Level's

Your logging level will determine what statments are printed out. It is inclusive of the level you set, and all 'higher' level statements. The levels are trace, debug, info, warn and error. So if you set your level to trace, then all messages will be output. If you set your level to warn, only warn and error level statements will be output.

# Environment Variables

You can define default log levels for namespaces as well as a global default using the `LOG_LEVEL` environment variable. Below are the rules to adhere to:

1. Log levels are integers 0 = trace, 3 = debug, 5 = info (default), 7 = warn, 10 = error
1. For multiple values, separate each definition with a semi-colon ';'.
1. To set the level for a specific group or namespace use the name first and the log level second.

Example: `LOGLEVEL=5;mu.config 3;mu.endpoints 7`

# Statements

The signature for trace, debug, info, warn and error are all the same. So this documentation is using `level` as a function name to indicate their interoperability. 

Each logging statement takes up to 3 arguments, with only the first argument being required. 

1. The string message that should be output to the console. 
1. An object, or second message, that adds context to this logging statement.
1. A boolean value that indicates if this logging statement should be output. This statement is seondary to log level. So if the log level is error and the logging statement is info with a condition. The condition is not attempted because the level excludes it.

`'level'(message:string, context?: any, condition?: boolean): void`

Examples:
```
const logger: Logger = defaultLogger();

logger.debug('Simple debug message', user);

logger.warn('Something is sort of wrong', error, error.message.startsWith('Maybe'));

```

# Timing

Some simplistic console statements can be output do measure execution times between points in the code. The label you define for each timer is within the context of the logger, so you do not need to worry about collissions between objects. Unless, they share the same logger namespace.

Examples:
```
const logger: Logger = defaultLogger();

logger.startTimer('creating');

...dos tuff

logger.endTimer('creating'); //Console statement will be output. Timer is still running.

logger.resetTimer('creating'); //Timer is stopped.

```

# Children

The `.child()` function was created to make maintaining a namespace a bit easier. You can have a heirarchy based on the object nesting of the loggers.

```

const logger: Logger = defaultLogger('superapp');

class Users{
  private logger: Logger;
  constructor(parentLogger:Logger){
    this.logger = logger.child('users'); //Namespace is superapp.users for this objects logging statements.
  }

}

```