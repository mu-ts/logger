import { Logger, LoggerFilter } from '../index';
import { LoggerConfig } from './LoggerConfig';

/**
 * Contract for overriding the default logging implementation.
 */
export interface LoggerFactory {
  /**
   *
   * @param options used to create the new Logger class.
   * @param filters
   */
  newLogger(options: LoggerConfig, filters?: LoggerFilter[]): Logger;
}
