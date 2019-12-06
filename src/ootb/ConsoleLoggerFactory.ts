import { LoggerConfig, LoggerFactory, Logger } from '..';
import { ConsoleLogger } from './ConsoleLogger';

/**
 * Default implementation of the LoggerFactory to return instances of
 * ConsoleLogger.
 */
export class ConsoleLoggerFactory implements LoggerFactory {
  public newLogger(options: LoggerConfig): Logger {
    if (!options.name) throw new Error('Name must be provied in options, when calling newLogger().');
    return new ConsoleLogger(options, this);
  }
}
