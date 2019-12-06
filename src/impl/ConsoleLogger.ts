import { Logger, LogLevelString, LoggerFactory, LoggerService } from '..';
import { LoggerConfig } from '../LoggerConfig';
import { ConsoleLoggerFactory } from './ConsoleLoggerFactory';
import { ConsoleStatement } from './ConsoleStatement';

export class ConsoleLogger implements Logger {
  private readonly name: string;
  private readonly loggerFactory: LoggerFactory;
  private level: LogLevelString;

  constructor(options: LoggerConfig, loggerFactory: LoggerFactory) {
    this.loggerFactory = loggerFactory;
    this.name = options.name;
    this.level = options.level || 'info';
  }

  /**
   *
   * @param options to create the child logger with. If only a string is provided the
   *        parents logging level is used.
   */
  public child(options: string | LoggerConfig): Logger {
    const childName: string = typeof options === 'string' ? options : (options as LoggerConfig).name || 'child';
    return this.loggerFactory.newLogger({
      name: `${this.name}.${childName}`,
      level: typeof options !== 'string' ? options.level || this.level : this.level,
    });
  }

  public start(label: string): void {
    console.time(`${this.name}.${label}`);
  }

  public stop(label: string): void {
    console.timeEnd(`${this.name}.${label}`);
  }

  public setLevel(level: LogLevelString): void {
    this.level = level;
  }

  public getLevel(): LogLevelString {
    return this.level;
  }

  public isTrace() {
    return this.level === 'trace';
  }

  public isDebug() {
    return ['trace', 'debug'].includes(this.level);
  }

  public isInfo() {
    return ['trace', 'debug', 'info'].includes(this.level);
  }

  public isWarn() {
    return ['trace', 'debug', 'info', 'warn'].includes(this.level);
  }

  public isError() {
    return ['trace', 'debug', 'info', 'warn', 'error'].includes(this.level);
  }

  public isFatal() {
    return ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].includes(this.level);
  }

  public log(level: LogLevelString, ...params: Error | string | any): void {
    const statement: ConsoleStatement = this.toStatement(...params);

    statement.name = this.name;
    statement.level = level;

    switch (statement.level) {
      case 'trace':
      case 'debug':
      case 'info':
        console.log(statement);
        break;
      case 'warn':
        console.warn(statement);
        break;
      case 'error':
      case 'fatal':
      default:
        console.error(statement);
    }
  }

  public trace(...params: Error | string | any) {
    this.log('trace', ...params);
  }

  public debug(...params: Error | string | any) {
    this.log('debug', ...params);
  }

  public info(...params: Error | string | any) {
    this.log('info', ...params);
  }

  public warn(...params: Error | string | any) {
    this.log('warn', ...params);
  }

  public error(...params: Error | string | any) {
    this.log('error', ...params);
  }

  public fatal(...params: Error | string | any) {
    this.log('fatal', ...params);
  }

  /**
   *
   * @param params to format into a log statement.
   */
  private toStatement(...params: Error | string | any): ConsoleStatement {
    const statement: ConsoleStatement = params
      .filter((param: Error | string | any) => param !== undefined)
      .reduce((accumulator: ConsoleStatement, param: Error | string | any): ConsoleStatement => {
        if (!accumulator.at) accumulator.at = new Date();

        if (!accumulator.clazz) {
          if (typeof param !== 'string' && param.clazz) {
            accumulator.clazz = `${param.clazz}`;
            delete param.clazz;
          }
        }

        if (!accumulator.func) {
          if (typeof param === 'string' && param.endsWith('()')) accumulator.func = param;
          else if (param.func) {
            accumulator.func = `${param.func}`;
            delete param.func;
          }
        }

        if (!accumulator.msg) {
          if (typeof param === 'string' && !param.endsWith('()')) accumulator.msg = param;
          else if (param.msg) {
            accumulator.msg = `${param.msg}`;
            delete param.msg;
          } else if (param.message) {
            accumulator.msg = `${param.message}`;
            delete param.message;
          }
        }

        if (!accumulator.err && param instanceof Error) accumulator.err = param;
        else if (params.length === 1 && typeof param === 'object') {
          accumulator = { ...accumulator, ...param };
        } else if (params.length > 1 && typeof param === 'object') {
          if (!accumulator.data) accumulator.data = {};
          const name: string = param.constructor.name;
          if (name === 'Object') accumulator.data = { ...accumulator.data, ...param };
          else {
            accumulator.data[name] = { ...param };
          }
        }

        return accumulator;
      }, {});

    return statement;
  }
}

// class User {
//   name: string = 'joe';
// }
// const loggerFactory: LoggerFactory = new ConsoleLoggerFactory();
// const logger: Logger = new ConsoleLogger({ name: 'test', level: 'trace' }, loggerFactory);

// // logger.trace({ trace: true }, { msg: 'Message that needs attention.', kk: true }, new User(), new Error());

// logger.trace('Couldnt get this to work.t', 'test()', new User());
// // logger.warn('Couldnt get this to work.w', new Error());
// // logger.error('Couldnt get this to work.e', new Error());
// // logger.fatal('Couldnt get this to work. f', new Error());

// LoggerService.init();
