import { LoggerFactory, LoggerConfig, Logger } from '../../src';
import { MockLogger } from './MockLogger';

export class MockLoggerFactory implements LoggerFactory {
  private logger: Logger;

  public newLogger(options: LoggerConfig): Logger {
    if (!this.logger) this.logger = new MockLogger(options, this);
    return this.logger;
  }

  getLogger(): Logger {
    return this.logger;
  }
}
