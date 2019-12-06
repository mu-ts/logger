import { Logger, LogLevelString, LoggerFactory } from '..';
import { LoggerConfig } from '../LoggerConfig';
import { ConsoleStatement } from './ConsoleStatement';

export class ConsoleLogger implements Logger {
  private readonly name: string;
  private readonly loggerFactory: LoggerFactory;
  private level: LogLevelString;

  constructor(options: LoggerConfig, loggerFactory: LoggerFactory) {
    this.loggerFactory = loggerFactory;
    if (!options.name) throw new Error('Name must be provied in the options for a new ConsoleLogger.');
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
    try {
      console.time(`${this.name}.${label}`);
    } catch (error) {
      console.warn('Error creating start timer.', error);
    }
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
    return ['debug', 'trace'].includes(this.level);
  }

  public isInfo() {
    return ['info', 'debug', 'trace'].includes(this.level);
  }

  public isWarn() {
    return ['warn', 'info', 'debug', 'trace'].includes(this.level);
  }

  public isError() {
    return ['error', 'warn', 'info', 'debug', 'trace'].includes(this.level);
  }

  public isFatal() {
    return true;
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

  public log(level: LogLevelString, ...params: Error | string | any): void {
    const statement: ConsoleStatement = this.toStatement(...params);

    statement.name = this.name;
    statement.level = level;

    switch (statement.level) {
      case 'trace':
        if (this.isTrace()) console.log(statement);
        break;
      case 'debug':
        if (this.isDebug()) console.log(statement);
        break;
      case 'info':
        if (this.isInfo()) console.log(statement);
        break;
      case 'warn':
        if (this.isWarn()) console.warn(statement);
        break;
      case 'error':
        if (this.isError()) console.error(statement);
        break;
      case 'fatal':
      default:
        if (this.isFatal()) console.error(statement);
        break;
    }
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

        if (param instanceof Error) {
          if (!accumulator.err) accumulator.err = param;
          else if (accumulator.err) {
            accumulator.errs = [accumulator.err, param];
          } else if (accumulator.errs) {
            accumulator.errs.push(param);
          }
        } else if (typeof param === 'object') {
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
