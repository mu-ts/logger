import * as Bunyan from 'bunyan';
import { LogLevelString } from './LogLevelString';
import { Logger } from './index';
import { DefaultLevels } from './DefaultLevels';

export class LoggerService {
  private static cache: { [key: string]: Logger } = {};
  private static defaultLevels: DefaultLevels = LoggerService.getDefaultLevels();
  private static bunyanLogger: Bunyan = Bunyan.createLogger({
    name: process.env['AWS_LAMBDA_FUNCTION_NAME'] || 'defaulty',
    level: LoggerService.defaultLevels['default_level'],
  });

  private constructor() {}

  /**
   * Convenience method for getting a console logger instance.
   */
  public static defaultLogger(): Logger {
    return this.bunyanLogger;
  }

  /**
   *
   * @param level to define on the default logger.
   */
  public static setLevel(level: LogLevelString): void {
    this.defaultLevels.default_level = level;
    this.bunyanLogger.level(level);
  }

  /**
   *
   * @param component to define on each child logging statement.
   * @param optional attributes to attach to the logging instance.
   */
  public static named(component: string, options?: { [key: string]: string }): Logger {
    let logger: Logger | undefined = this.cache[component.toLowerCase()];

    if (!logger) {
      logger = this.bunyanLogger.child({
        ...(options || {}),
        ...{ component },
      });

      if (options && options.level) {
        logger.level(options.level as LogLevelString);
      } else if (this.defaultLevels[component.toLowerCase()]) {
        logger.level(this.defaultLevels[component.toLowerCase()]);
      }

      this.cache[component.toLowerCase()] = logger;
    }

    return logger;
  }

  /**
   * Generates derault logging levels for
   */
  private static getDefaultLevels(): DefaultLevels {
    const staticConfig: string = process.env.LOG_LEVEL || 'info';
    const configs: string[] = staticConfig.split(';');
    const levels: DefaultLevels = {
      default_level: configs.shift() as LogLevelString,
    };

    for (const config of configs) {
      const parts: string[] = config.split(' ');
      levels[parts[0].toLowerCase()] = parts[1] as LogLevelString;
    }
    return levels;
  }
}
