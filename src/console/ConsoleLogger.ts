import { Logger, LogLevelString, LoggerFactory, LoggerFilter } from '../index';
import { LoggerConfig } from '../interfaces/LoggerConfig';
import { LoggerStatement } from '../interfaces/LoggerStatement';

export class ConsoleLogger implements Logger {
  private readonly name: string;
  private readonly loggerFactory: LoggerFactory;
  private readonly adornments: { [key: string]: string } | undefined;
  private level: LogLevelString;
  private filters: LoggerFilter[] | undefined;

  constructor(options: LoggerConfig, loggerFactory: LoggerFactory, filters?: LoggerFilter[]) {
    this.loggerFactory = loggerFactory;
    if (!options.name) throw new Error('Name must be provied in the options for a new ConsoleLogger.');
    this.name = options.name;
    this.level = options.level || 'info';
    this.adornments = options.adornments;
    this.filters = filters;
  }

  /**
   *
   * @param options to create the child logger with. If only a string is provided the
   *        parents logging level is used.
   */
  public child(_options: string | LoggerConfig): Logger {
    const options: LoggerConfig = typeof _options === 'string' ? { name: _options } : _options;
    const childName: string = options.name || `${this.name}.child`;
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
    /**
     * Statements are not created until a logging statement is
     * actually requested to avoid unnecssary work.
     */
    switch (level) {
      case 'trace':
        if (this.isTrace()) console.log(this.toStatement(level, ...params));
        break;
      case 'debug':
        if (this.isDebug()) console.log(this.toStatement(level, ...params));
        break;
      case 'info':
        if (this.isInfo()) console.log(this.toStatement(level, ...params));
        break;
      case 'warn':
        if (this.isWarn()) console.warn(this.toStatement(level, ...params));
        break;
      case 'error':
        if (this.isError()) console.error(this.toStatement(level, ...params));
        break;
      case 'fatal':
      default:
        if (this.isFatal()) console.error(this.toStatement(level, ...params));
        break;
    }
  }

  /**
   *
   * @param params to format into a log statement.
   */
  private toStatement(level: LogLevelString, ...params: Error | string | any): LoggerStatement {
    const statement: LoggerStatement = params
      .filter((param: Error | string | any) => param !== undefined)
      .reduce((accumulator: LoggerStatement, param: Error | string | any): LoggerStatement => {
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

    statement.name = this.name;
    statement.level = level;

    /**
     * Force attributes on the statement output, that are defined as adornments to the logging
     * statement. This violates the LoggerStatement interface, by design, as the interface is
     * defined as the 'standard' LoggerStatement and adornments are there as static values
     * to attach to each statement as an additional marker. I dont want to explicitly open
     * up the LoggerStatement interface to allow any possible value, as it will become a
     * meaningless interface.
     */
    if (this.adornments) {
      Object.keys(this.adornments).forEach((key: string) => ((statement as any)[key] = this.adornments[key]));
    }

    if (statement.data || statement.msg) {
      /**
       * If a deep clone is not done of the objects then there is a risk of
       * modifying a logged object during filtering of logged out data.
       */
      if (statement.data) statement.data = this.deepCopy(statement.data);
      if (this.filters) this.filters.forEach((filter: LoggerFilter) => filter.filter(statement));
    }

    return statement;
  }

  /**
   *
   * @param target to create a clone of.
   */
  private deepCopy(target: any): any {
    /**
     * This is pretty heavy handed. We can update this to a more efficient
     * algorithm if a performance issue is located with it.
     */
    return JSON.parse(JSON.stringify(target));
  }
}
