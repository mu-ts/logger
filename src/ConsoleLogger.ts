import { Logger, LogLevel } from "./Logger";

/**
 * Interface that defines all the core behaviors available for logging.
 */
export class ConsoleLogger implements Logger {
  private level: LogLevel;
  private name: string;

  constructor(name: string, level?: LogLevel) {
    const defaultLevel: LogLevel = this.getDefaultLevel();
    this.level = level || defaultLevel;
    this.name = name;
  }

  public trace(message: string, context?: any, condition: boolean = true): void {
    if (condition) this.log(LogLevel.trace, message, context);
  }

  public debug(message: string, context?: any, condition?: boolean): void {
    if (condition) this.log(LogLevel.debug, message, context);
  }

  public info(message: string, context?: any, condition?: boolean): void {
    if (condition) this.log(LogLevel.info, message, context);
  }

  public warn(message: string, context?: any, condition?: boolean): void {
    if (condition) this.log(LogLevel.warn, message, context);
  }

  public error(message: string, context?: any, condition?: boolean): void {
    if (condition) this.log(LogLevel.error, message, context);
  }

  public startTimer(label?: string): void {
    console.time(`${name}:${label}`);
  }

  public endTimer(label?: string): void {
    console.timeEnd(`${name}:${label}`);
  }

  public resetTimer(label?: string): void {
    console.countReset(`${name}:${label}`);
  }

  /**
   * Outputs memory information to the console.
   */
  public memory(): void {
    console.memory();
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
