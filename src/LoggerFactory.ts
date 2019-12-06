import { Logger, LoggerService } from '.';
import { LoggerConfig } from './LoggerConfig';

/**
 * Contract for overriding the default logging implementaiton.
 */
export interface LoggerFactory {
  /**
   *
   * @param options used to create the new Logger class.
   */
  newLogger(options: LoggerConfig): Logger;
}
