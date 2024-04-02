import { Logger, LoggerConfig, LoggerFactory, LoggerFilter } from '../index';
import { ConsoleLogger } from './ConsoleLogger';

/**
 * Default implementation of the LoggerFactory to return instances of
 * ConsoleLogger.
 */
export class ConsoleLoggerFactory implements LoggerFactory {
  public newLogger(options: LoggerConfig, filters?: LoggerFilter[]): Logger {
    if (!options.name) throw new Error('Name must be provided in options, when calling newLogger().');
    return new ConsoleLogger(options, this, filters);
  }
}
