import 'mocha';
import { expect } from 'chai';
import { LogLevelString, Logger } from '../../src/index';
import { ConsoleLoggerFactory } from '../../src/console/ConsoleLoggerFactory';

describe('ConsoleLoggerFactory', () => {
  let mockLoggerFactory: ConsoleLoggerFactory;

  beforeEach(() => {
    mockLoggerFactory = new ConsoleLoggerFactory();
  });

  describe('newLogger', () => {
    const newLogger = (level?: LogLevelString) => {
      const logger: Logger = mockLoggerFactory.newLogger({ name: 'test', level });
      expect(logger).to.not.undefined;
    };

    it('accepts name only', () => newLogger());
    it('accepts name and trace level', () => newLogger('trace'));
    it('accepts name and debug level', () => newLogger('debug'));
    it('accepts name and info level', () => newLogger('info'));
    it('accepts name and warn level', () => newLogger('warn'));
    it('accepts name and error level', () => newLogger('error'));
    it('accepts name and fatal level', () => newLogger('fatal'));

    it('fails with no name', () => {
      expect(() => mockLoggerFactory.newLogger({})).to.throw(
        Error,
        'Name must be provied in options, when calling newLogger().'
      );
    });
  });
});
