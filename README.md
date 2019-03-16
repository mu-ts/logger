# logger

Simple logging framework for FaaS.

# Usage

To get a logger instance you can call `.child(name)` from a parent logger, or you can use the `.getLogger()` static function on the Logger class.

```
// Using .getChild()
constructor(parentLogger:Logger){
    this.logger = parentLogger.child('child_name');
}
// Using static .getLogger()
this.logger = Logger.getLogger('my.name');
```

Once you have your logger you can use the functions within and proper gating of execution will be done based on the log level or conditions provided.

# Namespaces

So each logger gets a namespace, and child loggers created from a parent use the parents namespace as a prefix to its own. So if you have a root logger 'mu' and call `.child('endpoints')` the child's namespace will be `mu.endpoints`.

# Environment Variables

You can define default log levels for namespaces as well as a global default using the 'LOG_LEVEL' environment variable. Below are the rules to adhere to:

1. Log levels are integers 0 = trace, 3 = debug, 5 = info (default), 7 = warn, 10 = error
1. For multiple values, separate each definition with a semi-colon ';'.
1. To set the level for a specific group or namespace use the name first and the log level second.

Example: `LOGLEVEL=5;mu.config 3;mu.endpoints 7
