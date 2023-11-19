import 'mocha';
import { expect } from 'chai';
import { MockLoggerFactory } from './mock/MockLoggerFactory';
import { Logger, LoggerFactory, LogLevelString, LoggerService } from '../src';

process.env.LOG_LEVEL =
  'info;TestForTrace trace;TestForDebug debug;TestForInfo info;TestForWarn warn;TestForError error;TestForFattal fatal;';

describe('LoggerService', () => {
  describe('setLoggerFactory()', () => {
    it('set a valid LoggerFactory', () => {
      expect(() => LoggerService.setLoggerFactory(new MockLoggerFactory())).to.not.throw(Error);
    });

    it('fail if LoggerFactory is invalid', () => {
      expect(() => LoggerService.setLoggerFactory({} as LoggerFactory)).to.throw(Error);
    });
  });

  describe('setLevel()', () => {
    const testGetLevel = (toLevel: LogLevelString, level?: LogLevelString) => {
      LoggerService.setLevel(level);
      LoggerService.setLevel(toLevel);
      const theLevel: LogLevelString = LoggerService.getLevel();
      expect(theLevel).to.equal(toLevel);
    };

    describe('from default', () => {
      it('to trace level', () => testGetLevel('trace'));
      it('to debug level', () => testGetLevel('debug'));
      it('to info level', () => testGetLevel('info'));
      it('to warn level', () => testGetLevel('warn'));
      it('to error level', () => testGetLevel('error'));
      it('to fatal level', () => testGetLevel('fatal'));
    });

    describe('from trace', () => {
      it('to debug level', () => testGetLevel('debug', 'trace'));
      it('to info level', () => testGetLevel('info', 'trace'));
      it('to warn level', () => testGetLevel('warn', 'trace'));
      it('to error level', () => testGetLevel('error', 'trace'));
      it('to fatal level', () => testGetLevel('fatal', 'trace'));
    });

    describe('from debug', () => {
      it('to trace level', () => testGetLevel('trace', 'debug'));
      it('to info level', () => testGetLevel('info', 'debug'));
      it('to warn level', () => testGetLevel('warn', 'debug'));
      it('to error level', () => testGetLevel('error', 'debug'));
      it('to fatal level', () => testGetLevel('fatal', 'debug'));
    });

    describe('from info', () => {
      it('to trace level', () => testGetLevel('trace', 'info'));
      it('to debug level', () => testGetLevel('debug', 'info'));
      it('to warn level', () => testGetLevel('warn', 'info'));
      it('to error level', () => testGetLevel('error', 'info'));
      it('to fatal level', () => testGetLevel('fatal', 'info'));
    });

    describe('from warn', () => {
      it('to trace level', () => testGetLevel('trace', 'warn'));
      it('to debug level', () => testGetLevel('debug', 'warn'));
      it('to info level', () => testGetLevel('info', 'warn'));
      it('to error level', () => testGetLevel('error', 'warn'));
      it('to fatal level', () => testGetLevel('fatal', 'warn'));
    });

    describe('from error', () => {
      it('to trace level', () => testGetLevel('trace', 'error'));
      it('to debug level', () => testGetLevel('debug', 'error'));
      it('to info level', () => testGetLevel('info', 'error'));
      it('to warn level', () => testGetLevel('warn', 'error'));
      it('to fatal level', () => testGetLevel('fatal', 'error'));
    });

    describe('from fatal', () => {
      it('to trace level', () => testGetLevel('trace', 'fatal'));
      it('to debug level', () => testGetLevel('debug', 'fatal'));
      it('to info level', () => testGetLevel('info', 'fatal'));
      it('to warn level', () => testGetLevel('warn', 'fatal'));
      it('to error level', () => testGetLevel('error', 'fatal'));
    });
  });

  describe('getLevel()', () => {
    const testGetLevel = (level?: LogLevelString) => {
      LoggerService.setLevel(level || 'info');
      const theLevel: LogLevelString = LoggerService.getLevel();
      expect(theLevel).to.equal(level || 'info');

      // Reset the level back to info to avoid polluting other tests.
      LoggerService.setLevel('info');
    };

    it('at default level', () => testGetLevel());
    it('at trace level', () => testGetLevel('trace'));
    it('at debug level', () => testGetLevel('debug'));
    it('at info level', () => testGetLevel('info'));
    it('at warn level', () => testGetLevel('warn'));
    it('at error level', () => testGetLevel('error'));
    it('at fatal level', () => testGetLevel('fatal'));
  });

  describe('named()', () => {
    const newNamedLogger = (label?: string, level?: LogLevelString) => {
      const logger: Logger = LoggerService.named({ name: label, level });
      expect(logger).to.not.be.undefined;
      expect(logger.getLevel()).to.equal(level || 'info');
    };

    it('named "testx", at default level', () => newNamedLogger('testx'));
    it('named "test1", at trace level', () => newNamedLogger('test1', 'trace'));
    it('named "test2", at debug level', () => newNamedLogger('test2', 'debug'));
    it('named "test3", at info level', () => newNamedLogger('test3', 'info'));
    it('named "test4", at warn level', () => newNamedLogger('test4', 'warn'));
    it('named "test5", at error level', () => newNamedLogger('test5', 'error'));
    it('named "test6", at fatal level', () => newNamedLogger('test6', 'fatal'));

    it('named "TestForTrace" with LOG_LEVEL default of trace', () => newNamedLogger('TestForTrace', 'trace'));
    it('named "TestForDebug" with LOG_LEVEL default of debug', () => newNamedLogger('TestForDebug', 'debug'));
    it('named "TestForInfo" with LOG_LEVEL default of info', () => newNamedLogger('TestForInfo', 'info'));
    it('named "TestForWarn" with LOG_LEVEL default of warn', () => newNamedLogger('TestForWarn', 'warn'));
    it('named "TestForError" with LOG_LEVEL default of error', () => newNamedLogger('TestForError', 'error'));
    it('named "TestForFatal" with LOG_LEVEL default of fatal', () => newNamedLogger('TestForFatal', 'fatal'));

    it('should throw exception when name is missing', () => {
      expect(() => LoggerService.named({})).to.throw(
        Error,
        'A named logger requires a name as a part of the LoggerConfig.'
      );
      expect(() => LoggerService.named({ level: 'debug' })).to.throw(
        Error,
        'A named logger requires a name as a part of the LoggerConfig.'
      );
    });
  });
});
