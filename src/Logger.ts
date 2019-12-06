import { LogLevelString } from './LogLevelString';
import { LoggerConfig } from './LoggerConfig';

/**
 * Each logger instance should be created via the LoggerService using 'named'. The value
 * for 'named' will determine the optional `process.env.LOG_LEVEL` that can be provided
 * to change the level for a specific logger, rather than having to programatically
 * define the level for each individual logger.
 *
 * For example:
 *
 * process.env.LOG_LEVEL = 'info';
 * const logger: Logger = LoggerService.named('my')
 * const otherLogger: Logger = LoggerService.named('my.other')
 *
 * In the case of the two loggers above, each has a name associated to them, and use
 * the default default logging level defined ('info').
 *
 * I can change the logging level of 'my.other' by adding another statement to the
 * LOG_LEVEL environment variable. The example below changes 'my.other' logging level
 * to trace.
 *
 * process.env.LOG_LEVEL = 'info;my.other trace';
 *
 */
export interface Logger {
  /**
   * Function is similar to that of `console.time(label)` where a point in time
   * is saved to be recalled later, to print out the amount of time that passed between
   * the two events.
   *
   * See the '@duration()` decorator for easier execution of this functionality.
   *
   * @param label of the time tracker.
   * @return the time in nannoseconds
   */
  start(label: string): void;

  /**
   * Function is similar to that of `console.timeEnd('label')` where the duration in
   * time between the execution of `start` and `end()` is measured and printed out
   * to the console. The timer is then destroyed to release the memory associated
   * with it.
   *
   * See the '@duration()` decorator for easier execution of this functionality.
   *
   * @param label
   * @param level to log the statement out ot the console at. Defaults to 'debug'.
   */
  stop(label: string, level?: LogLevelString): void;

  /**
   *
   * @param level to set the logget to.
   */
  setLevel(level: LogLevelString): void;

  /**
   * Returns the current logging level of this logger.
   */
  getLevel(): LogLevelString;

  /**
   * Creates a child instance from this logger. Depending on the underlying implementation
   * it will attempt to keep track of, and report, the heirarchy of this logger.
   *
   * @param options to set on each logger statement.
   */
  child(name: string, options?: LoggerConfig): Logger;

  /**
   * Returns a boolean: is the `trace` level enabled?
   */
  isTrace(): boolean;

  /**
   * Lowest level, will only show if trace is enabled for this logger.
   *
   * @param params Any collection of string, errors or objects to be printed to the console.
   */
  trace(...params: Error | string | any): void;

  /**
   * Returns a boolean: is the `debug` level enabled?
   */
  isDebug(): boolean;

  /**
   * Second lowest level, will only show if trace or debug is enabled for this logger.
   *
   * @param params Any collection of string, errors or objects to be printed to the console.
   */
  debug(...params: Error | string | any): void;

  /**
   * Returns a boolean: is the `info` level enabled?
   */
  isInfo(): boolean;

  /**
   * 3rd tier logging, so will only show if info, trace or debug are enabled.
   *
   * @param params Any collection of string, errors or objects to be printed to the console.
   */
  info(...params: Error | string | any): void;

  /**
   * Returns a boolean: is the `warn` level enabled?
   */
  isWarn(): boolean;

  /**
   * 4th tier logging, so will only show if warn, info, trace or debug are enabled. This level
   * of logging statements output to the console under the `.warn` level if it is available
   * as it is with the default console logger.
   *
   * @param params Any collection of string, errors or objects to be printed to the console.
   */
  warn(...params: Error | string | any): void;

  /**
   * Returns a boolean: is the `error` level enabled?
   */
  isError(): boolean;

  /**
   * 5th tier, shows when error, warn, info, debug or trace is enabled. At this level
   * or higher the statements are printed out with higher urgency. Meaning, for the
   * default logger `console.error` is used instead of `console.log`.
   *
   * @param params Any collection of string, errors or objects to be printed to the console.
   */
  error(...params: Error | string | any): void;

  /**
   * Returns a boolean: is the `fatal` level enabled.
   */
  isFatal(): boolean;

  /**
   * Highest teir of logging that always shows. Statements are printed out with higher
   * urgency. Meaning, for the default logger `console.error` is used instead of `console.log`.
   *
   * @param params Any collection of string, errors or objects to be printed to the console.
   */
  fatal(...params: Error | string | any): void;

  /**
   * Logs a statement out at the level specified. The rules specified in the documentation for
   * each log level are respected for this specific log level.
   *
   * @param level to log this statement out at.
   * @param params Any collection of string, errors or objects to be printed to the console.
   */
  log(level: LogLevelString, ...params: Error | string | any): void;
}
