import { Logger, LoggerFactory, LogLevelString, LoggerConfig } from '../../src';
import { MockLoggerStatement } from './MockLoggerStatement';

export class MockLogger implements Logger {
  private readonly name: string;
  private readonly loggerFactory: LoggerFactory;
  private level: LogLevelString;
  private logStatements: any[];

  constructor(options: LoggerConfig, loggerFactory: LoggerFactory) {
    this.loggerFactory = loggerFactory;
    if (!options.name) throw new Error('Name must be provied in the options for a new ConsoleLogger.');
    this.name = options.name;
    this.level = options.level || 'info';
    this.logStatements = [];
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
    this.logStatements.push(new MockLoggerStatement('start', { label }));
  }

  public stop(label: string): void {
    this.logStatements.push(new MockLoggerStatement('stop', { label }));
  }

  public setLevel(level: LogLevelString): void {
    this.logStatements.push(new MockLoggerStatement('setLevel', { level }));
    this.level = level;
  }

  public getLevel(): LogLevelString {
    this.logStatements.push(new MockLoggerStatement('getLevel'));
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
    this.logStatements.push(new MockLoggerStatement(`log.${level}`, params));
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
}
