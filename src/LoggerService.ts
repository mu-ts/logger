import { Logger, LoggerConfig, LoggerFactory, LoggerFilter, LogLevelString } from './index';
import { DefaultLevels } from './interfaces/DefaultLevels';
import { ConsoleLoggerFactory } from './console/ConsoleLoggerFactory';

/**
 * All 'original' logger should be created from this service. It will ensure that when
 * they are created the proper level is assigned to them, from defaults and environment
 * variables.
 */
export class LoggerService {
  private static readonly DEFAULT_LEVEL_NAME: string = 'default_level';

  private static cache: Record<string, Logger> = {};

  private static defaultLevels: DefaultLevels | undefined;

  private static loggerFactory: LoggerFactory | undefined;

  private static filters?: LoggerFilter[] | undefined;

  /**
   *
   * @param filter will look at the value, attributes or contents of a statement and
   *               remove or replace (redact) it. This is used to avoid leaking sensitive
   *               data like passwords, credit cards or secrets.
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
    if (!this.defaultLevels) this.defaultLevels = this.getDefaultLevels();
    this.defaultLevels.default_level = level;
  }

  /**
   *
   * @return default level of all created loggers.
   */
  public static getLevel(): LogLevelString {
    if (!this.defaultLevels) this.defaultLevels = this.getDefaultLevels();
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
    const { name } = options;

    if (!name) {
      throw new Error('A named logger requires a name as a part of the LoggerConfig.');
    }

    const safeName: string = name.toLowerCase();
    const defaultLevels: DefaultLevels = this.getDefaultLevels();

    /**
     * *** LEVEL **** ------>
     * Figure out what level to use for this logger. Only use environment configuration
     * if a level is not hard coded. If, an environment value is provided with an
     * exclamation point on the name, then override.
     */
    let { level } = options;

    if (defaultLevels[`!${safeName}`]) level = defaultLevels[`!${safeName}`];
    if (!level && defaultLevels[safeName]) level = defaultLevels[safeName];
    if (!level) level = defaultLevels[this.DEFAULT_LEVEL_NAME] || 'info';

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
    if (!this.defaultLevels) {
      const staticConfig: string = process.env.LOG_LEVEL || 'info';
      const configs: string[] = staticConfig.split(';').filter((level: string | undefined) => !!level || level !== '');
      this.defaultLevels = {
        default_level: configs.shift() as LogLevelString,
      };

      for (const config of configs) {
        const [_levelName, _levelType]: string[] = config.split(' ');
        this.defaultLevels[_levelName] = _levelType?.toLowerCase() as LogLevelString;
      }
    }

    return this.defaultLevels;
  }
}
