import { Logger, LogLevel } from './';

/**
 * Interface that defines all the core behaviors available for logging.
 */
export class ConsoleLogger implements Logger {
  private level: LogLevel;
  private name: string;

  constructor(name: string, level?: LogLevel) {
    this.level = level !== undefined ? level : this.getDefaultLevel();
    this.name = name;
  }

  public trace(message: string, context?: any, condition: boolean = true): void {
    if (condition) this.log(LogLevel.trace, message, context);
  }

  public debug(message: string, context?: any, condition: boolean = true): void {
    if (condition) this.log(LogLevel.debug, message, context);
  }

  public info(message: string, context?: any, condition: boolean = true): void {
    if (condition) this.log(LogLevel.info, message, context);
  }

  public warn(message: string, context?: any, condition: boolean = true): void {
    if (condition) this.log(LogLevel.warn, message, context);
  }

  public error(message: string, context?: any, condition: boolean = true): void {
    if (condition) this.log(LogLevel.error, message, context);
  }

  public startTimer(label?: string): void {
    console.time(`${this.name}:${label}`);
  }

  public endTimer(label?: string): void {
    console.timeEnd(`${this.name}:${label}`);
  }

  public resetTimer(label?: string): void {
    console.countReset(`${this.name}:${label}`);
  }

  public child(name: string): Logger {
    return new ConsoleLogger(`${this.name}.${name}`, this.level);
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
        else console.error(this.format(level, message));
      } else {
        if (context) console.log(this.format(level, message), context);
        else console.log(this.format(level, message));
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
    const rootLevels: string | undefined = process.env['LOG_LEVEL'];
    if (!rootLevels) return LogLevel.info;
    const rootLevel: Array<string> = rootLevels.split(';');
    const levelKey = rootLevel[0] as keyof typeof LogLevel;
    return LogLevel[levelKey];
  }
}
