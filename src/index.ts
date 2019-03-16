/**
 * The logging levels that are avialable.
 */
export enum LogLevel {
  trace = 0,
  debug = 3,
  info = 5,
  warn = 7,
  error = 10,
}

/**
 * Interface that defines all the core behaviors available for logging.
 */
export class Logger {
  private level: LogLevel;
  private name: string;

  constructor(name: string, level?: LogLevel) {
    const defaultLevel: LogLevel = this.getDefaultLevel();
    this.level = level || defaultLevel;
    this.name = name;
  }

  /**
   * Convenience method for getting a Logger instance.
   *
   * @param name space of the logger.
   * @param level to set the logging to.
   */
  public static getLogger(name: string, level?: LogLevel): Logger {
    return new Logger(name, level);
  }

  /**
   * Trace level logging. The most detailed level of logging.
   *
   * @param message to log.
   * @param context to log.
   * @param condition, that when true, will result in this statement being printed. Default is true.
   */
  public trace(message: string, context?: any, condition: boolean = true): void {
    if (condition) this.log(LogLevel.trace, message, context);
  }

  /**
   * Debug level logging. Detailed but relavent.
   *
   * @param message to log.
   * @param context to log.
   * @param condition, that when true, will result in this statement being printed. Default is true.
   */
  public debug(message: string, context?: any, condition?: boolean): void {
    if (condition) this.log(LogLevel.debug, message, context);
  }

  /**
   * Info level logging. Helpful messages or contextual information.
   *
   * @param message to log.
   * @param context to log.
   * @param condition, that when true, will result in this statement being printed. Default is true.
   */
  public info(message: string, context?: any, condition?: boolean): void {
    if (condition) this.log(LogLevel.info, message, context);
  }

  /**
   * Warn level logging. Something is wrong, but things are not 'broken'.
   *
   * @param message to log.
   * @param context to log.
   * @param condition, that when true, will result in this statement being printed. Default is true.
   */
  public warn(message: string, context?: any, condition?: boolean): void {
    if (condition) this.log(LogLevel.warn, message, context);
  }

  /**
   * Error level logging. Its broken, and the cat is on fire!
   *
   * @param message to log.
   * @param context to log.
   * @param condition, that when true, will result in this statement being printed. Default is true.
   */
  public error(message: string, context?: any, condition?: boolean): void {
    if (condition) this.log(LogLevel.error, message, context);
  }

  /**
   * Starts a timer with the label provided, or a default if no label was provided.
   *
   * @param label of the timer.
   */
  public startTimer(label?: string): void {
    console.time(label);
  }

  /**
   * Prints out the elapsed time of the label provided, or a default if no label was provided.
   *
   * Requires that startTimer be executed first.
   *
   * @param label of the timer.
   */
  public endTimer(label?: string): void {
    console.timeEnd(label);
  }

  /**
   * Resets a timer back to undefined.
   *
   * @param label of the timer.
   */
  public resetTimer(label?: string): void {
    console.countReset(label);
  }

  /**
   * Outputs memory information to the console.
   */
  public memory(): void {
    console.memory();
  }

  /**
   * Prints out a child logger, with the same settings as this logger. However,
   * the messages will be grouped by the name provided.
   *
   * @param name of the child logger.
   */
  public child(name: string): Logger {
    return new Logger(`${this.name}.${name}`, this.level);
  }

  /**
   * Common logging function for all of the helper mesages.
   *
   * @param level Of the message to log out.
   * @param message to log.
   * @param context to log.
   */
  private log(level: LogLevel, message: string, context?: any) {
    if (this.level <= level) {
      if (level <= LogLevel.error) {
        if (context) console.error(this.format(level, message), message);
        else context.error(this.format(level, message));
      } else {
        if (context) console.log(this.format(level, message), context);
        else context.log(this.format(level, message));
      }
    }
  }

  private format(level: LogLevel, message: string): string {
    if (process.env.AWS_REGION && process.env.AWS_LAMBDA_FUNCTION_NAME) {
      return `\t[${level}] ${this.name} ${this.name}\t${message}`;
    } else {
      return `${new Date().toISOString()} [${level}]\t${this.name}\t${message}`;
    }
  }

  /**
   * Determines the default log level for the name provided.
   */
  private getDefaultLevel(name?: string): LogLevel {
    let rootLevel: string | undefined = process.env['LOG_LEVEL'];
    if (!rootLevel) return LogLevel.info;
    let rootLevels: Array<string> = rootLevel.split(';');
    let levelKey = rootLevel as keyof typeof LogLevel;
    return LogLevel[levelKey];
  }
}
