import { Logger, LoggerFactory, LoggerFilter, LogLevelString } from '../index';
import { LoggerConfig } from '../interfaces/LoggerConfig';
import { LoggerStatement } from '../interfaces/LoggerStatement';

export class ConsoleLogger implements Logger {
  private _level: LogLevelString;
  
  private readonly name: string;

  private readonly adornments?: Record<string, string>;

  constructor(
    { name, level = 'info', adornments }: LoggerConfig,
    private readonly loggerFactory: LoggerFactory,
    private readonly filters?: LoggerFilter[]
  ) {
    if (!name) throw new Error('Name must be provided in the options for a new ConsoleLogger.');
    this.name = name;
    this.level = level;
    this.adornments = adornments;
  }

  /**
   *
   * @param _options to create the child logger with. If only a string is provided the
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
    console.time(`${this.name}.${label}`);
  }

  public stop(label: string): void {
    console.timeEnd(`${this.name}.${label}`);
  }

  public setLevel(level: LogLevelString): void {
    this.level = level;
  }

  private set level(level: LogLevelString) {
    this._level = level.toLowerCase() as LogLevelString;
  }

  private get level() {
    return this._level;
  }

  public getLevel(): LogLevelString {
    return this.level;
  }

  public isTrace() {
    return ['trace'].includes(this.level);
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
    return true;
  }

  public trace(...params: unknown[]) {
    this.log('trace', ...params);
  }

  public debug(...params: unknown[]) {
    this.log('debug', ...params);
  }

  public info(...params: unknown[]) {
    this.log('info', ...params);
  }

  public warn(...params: unknown[]) {
    this.log('warn', ...params);
  }

  public error(...params: unknown[]) {
    this.log('error', ...params);
  }

  public fatal(...params: unknown[]) {
    this.log('fatal', ...params);
  }

  public log(level: LogLevelString, ...params: unknown[]): void {
    /**
     * Statements are not created until a logging statement is
     * actually requested to avoid unnecessary work.
     */
    switch (level) {
      case 'trace':
        if (this.isTrace()) console.debug(ConsoleLogger.toString(this.toStatement(level, ...params)));
        break;
      case 'debug':
        if (this.isDebug()) console.debug(ConsoleLogger.toString(this.toStatement(level, ...params)));
        break;
      case 'info':
        if (this.isInfo()) console.log(ConsoleLogger.toString(this.toStatement(level, ...params)));
        break;
      case 'warn':
        if (this.isWarn()) console.warn(ConsoleLogger.toString(this.toStatement(level, ...params)));
        break;
      case 'error':
        if (this.isError()) console.error(ConsoleLogger.toString(this.toStatement(level, ...params)));
        break;
      case 'fatal':
      default:
        if (this.isFatal()) console.error(ConsoleLogger.toString(this.toStatement(level, ...params)));
        break;
    }
  }

  /**
   *
   * @param params to format into a log statement.
   */
  private toStatement(level: LogLevelString, ...params: unknown[]): LoggerStatement {
    const statement: LoggerStatement = params
      .filter((param: unknown) => param !== undefined)
      .reduce((accumulator: LoggerStatement, param: unknown): LoggerStatement => {

        if (!accumulator.at) accumulator.at = new Date();

        if (!accumulator.clazz) {
          if (typeof param !== 'string' && (param as LoggerStatement).clazz) {
            accumulator.clazz = `${(param as LoggerStatement).clazz}`;
          }
        }

        if (!accumulator.func) {
          if (typeof param === 'string' && param.endsWith('()')) accumulator.func = param;
          else if ((param as LoggerStatement).func) {
            accumulator.func = `${(param as LoggerStatement).func}`;
          }
        }

        if (!accumulator.msg) {
          if (typeof param === 'string' && !param.endsWith('()')) accumulator.msg = param;
          else if ((param as LoggerStatement).msg) {
            accumulator.msg = `${(param as LoggerStatement).msg}`;
          } else if ((param as Error).message) {
            accumulator.msg = `${(param as Error).message}`;
          }
        }

        if (param instanceof Error) {
          const anError: Error = {
            ...{
              type: param.constructor.name,
              message: param.message,
              stack: param.stack,
            },
            ...param,
          };
          if (!accumulator.err) accumulator.err = anError;
          else if (accumulator.err) {
            accumulator.errs = [accumulator.err, anError];
            delete accumulator.err;
          } else if (accumulator.errs) {
            accumulator.errs.push(anError);
          }
        } else if (param && typeof param === 'object') {
          if (!accumulator.data) accumulator.data = {};
          const name: string = param.constructor.name;
          if (name === 'Object') accumulator.data = { ...accumulator.data, ...param };
          else {
            accumulator.data[name] = { ...param };
          }
        }

        return accumulator;
      }, {} as LoggerStatement);

    statement.name = this.name;
    statement.level = level;

    /**
     * Force attributes on the statement output, that are defined as adornments to the logging
     * statement. This violates the LoggerStatement interface, by design, as the interface is
     * defined as the 'standard' LoggerStatement and adornments are there as static values
     * to attach to each statement as an additional marker. I don't want to explicitly open
     * up the LoggerStatement interface to allow any possible value, as it will become a
     * meaningless interface.
     */
    if (this.adornments) {
      Object.keys(this.adornments).forEach((key: string) => ((statement as any)[key] = this.adornments?.[key]));
    }

    if (statement.data || statement.msg) {
      /**
       * If a deep clone is not done of the objects then there is a risk of
       * modifying a logged object during filtering of logged out data.
       */
      if (statement.data) statement.data = this.deepCopy(statement.data) as Record<string, unknown>;
      // if (this.filters) this.filters.forEach((filter: LoggerFilter) => filter.filter(statement));
    }
    return this.readableOutput(statement); // re-order output for readability
  }

  /**
   *
   * @param target to create a clone of.
   */
  private deepCopy(target: unknown): unknown {
    /**
     * This is pretty heavy-handed. We can update this to a more efficient
     * algorithm if a performance issue is located with it.
     */
    return JSON.parse(this.serialize<Record<string, unknown>>(target as Record<string, unknown>));
  }

  private serialize<T>(object: T): string {
    const serialized: string = JSON.stringify(
      object,
      (name: string, value: any) => {
        if (!this.filters) return value;
        if (typeof value === 'object'
            || (typeof value !== 'string' && typeof value !== 'number')) return value;

        let newValue: any = value;
        for (const filter of this.filters) {
          if (String(newValue).includes('REDACTED')) return newValue;
          /* Filter out redacted fields. */
          newValue = filter.redact({ fieldName: name, value: newValue });
        }
        return newValue;
      },
      undefined,
    );
    return serialized;
  }

  private static toString(statement: LoggerStatement): string {
    return JSON.stringify(statement, null, 2);
  }

  private readableOutput(statement: LoggerStatement) {
    const {
      clazz, name, func, msg, data, at, ...rest
    } = statement;
    return {
      clazz, name, func, msg, data, ...rest, at,
    }; // re-order output for readability
  }
}
