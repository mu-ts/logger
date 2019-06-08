import { Logger } from './Logger';
import * as Bunyan from 'bunyan';

const bunyanLogger: Bunyan = Bunyan.createLogger({
  name: process.env['AWS_LAMBDA_FUNCTION_NAME'] || 'default',
  level: <Bunyan.LogLevelString>process.env['LOG_LEVEL'] || 'info',
  streams: [
    {
      level: 'trace',
      stream: process.stdout, // log INFO and above to stdout
    },
    {
      level: 'debug',
      stream: process.stdout, // log INFO and above to stdout
    },
    {
      level: 'info',
      stream: process.stdout, // log INFO and above to stdout
    },
    {
      level: 'error',
      stream: process.stderr, // log INFO and above to stdout
    },
    {
      level: 'fatal',
      stream: process.stderr, // log INFO and above to stdout
    },
  ],
});

bunyanLogger.info(
  {
    memory: process.env['AWS_LAMBDA_FUNCTION_MEMORY_SIZE'],
    version: process.env['AWS_LAMBDA_FUNCTION_VERSION'],
    region: process.env['AWS_REGION'],
    runtime: process.env['AWS_LAMBDA_RUNTIME_API'],
    handler: process.env['_HANDLER'],
  },
  'init'
);

/**
 * Convenience method for getting a console logger instance.
 */
export function defaultLogger(): Logger {
  return bunyanLogger;
}

/**
 *
 * @param level to define on the default logger.
 */
export function setLevel(level: Bunyan.LogLevelString): void {
  bunyanLogger.level(level);
}

/**
 *
 * @param component to define on each child logging statement.
 */
export function named(component: string, options?: { [key: string]: string }): Logger {
  return bunyanLogger.child(Object.assign(options || {}, { component }));
}

export { Logger };
