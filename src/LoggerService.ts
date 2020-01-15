import { LogLevelString, LoggerFilter, LoggerConfig, Logger, LoggerFactory } from './index';
import { DefaultLevels } from './interfaces/DefaultLevels';
import { ConsoleLoggerFactory } from './console/ConsoleLoggerFactory';

/**
 * All 'original' logger should be created from this service. It will ensure that when
 * they are created the proper level is assigned to them, from defaults and environment
 * variables.
 */
export class LoggerService {
  private static readonly DEFAULT_LEVEL_NAME: string = 'default_level';
  private static cache: { [key: string]: Logger } = {};
  private static defaultLevels: DefaultLevels = LoggerService.getDefaultLevels();
  private static loggerFactory: LoggerFactory | undefined;
  private static filters?: LoggerFilter[] | undefined;

  private constructor() {}

  /**
   *
   * @param filter will look at the value, attributes or contents of a statement and
   *               remove or replace (redact) it. This is used to avoid leaking sensitive
   *               data like passwords, credit cards or sercets.
   */
  public static registerFilter(filter: LoggerFilter): void {
    if (!this.filters) this.filters = [];
    this.filters.push(filter);
  }

  /**
   *
   * @param loggerFactory to use when creating new logger instances.
   */
  public static setLoggerFactory(loggerFactory: LoggerFactory) {
    if (!loggerFactory.newLogger) throw new Error('Logger factory is invalid.');
    this.loggerFactory = loggerFactory;
  }

  /**
   *
   * @param level to define on the default logger.
   */
  public static setLevel(level: LogLevelString): void {
    this.defaultLevels.default_level = level;
  }

  /**
   *
   * @return default level of all created loggers.
   */
  public static getLevel(): LogLevelString {
    return this.defaultLevels.default_level;
  }

  /**
   * Creates a named logger instance.
   *
   * @param name to grant this logger.
   * @param options optional attributes to attach to the logging instance.
   */
  public static named(_options: string | LoggerConfig, filters?: LoggerFilter[]): Logger {
    const options: LoggerConfig = typeof _options === 'string' ? { name: _options } : _options;
    const name: string = options.name;

    if (!name) {
      throw new Error('A named logger requires a name as a part of the LoggerConfig.');
    }

    const safeName: string = name.toLowerCase();

    /**
     * *** LEVEL **** ------>
     * Figure out what level to use for this logger. Use the provided
     * level with overrides from default values (from environment).
     */
    let level: LogLevelString | undefined = options.level;

    if (this.defaultLevels[safeName]) {
      level = this.defaultLevels[safeName];
    } else if (!level) {
      level = this.defaultLevels[this.DEFAULT_LEVEL_NAME];
    }

    if (!level) level = 'info';

    /**
     * *** LEVEL **** <------
     */

    let logger: Logger | undefined = this.cache[safeName];

    if (!logger) {
      /**
       * Default to the lightweight internal logger factory implementation.
       */
      if (!this.loggerFactory) {
        this.loggerFactory = new ConsoleLoggerFactory();
      }

      logger = this.loggerFactory.newLogger({ name, level, adornments: options.adornments }, filters || this.filters);

      this.cache[safeName] = logger;
    }

    /**
     * Sets, or re-sets, the logging level for the logger.
     */
    if (logger.getLevel() !== level) {
      logger.setLevel(level);
    }

    return logger;
  }

  /**
   * Generates default logging levels for known values
   * in the LOG_LEVEL process.env attribute.
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
