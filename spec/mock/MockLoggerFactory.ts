import { LoggerFactory, LoggerConfig, Logger } from '../../src';
import { MockLogger } from './MockLogger';

export class MockLoggerFactory implements LoggerFactory {
  public newLogger(options: LoggerConfig): Logger {
    return new MockLogger(options, this);
  }
}
