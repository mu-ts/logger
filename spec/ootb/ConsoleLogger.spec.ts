import 'mocha';
import { randomBytes } from 'crypto';
import { expect } from 'chai';
import { LogLevelString, Logger } from '../../src';
import { ConsoleLogger } from '../../src/ootb/ConsoleLogger';
import { MockLoggerFactory } from '../mock/MockLoggerFactory';

describe('ConsoleLogger', () => {
  let logger: ConsoleLogger | undefined;
  let mockLoggerFactory: MockLoggerFactory;
  let logOutput: any[];
  let warnOutput: any[];
  let errorOutput: any[];
  let consoleLogRef: any;
  let consoleWarnRef: any;
  let consoleErrorRef: any;

  const randomString = (length: number) => {
    return randomBytes(length)
      .toString('hex')
      .substring(0, length);
  };

  beforeEach(() => {
    mockLoggerFactory = new MockLoggerFactory();
    consoleLogRef = console.log;
    consoleWarnRef = console.warn;
    consoleErrorRef = console.error;

    logOutput = [];
    warnOutput = [];
    errorOutput = [];

    console.log = (...args: any[]) => {
      args.forEach((param: any) => logOutput.push(param));
    };
    console.warn = (...args: any[]) => {
      args.forEach((param: any) => warnOutput.push(param));
    };
    console.error = (...args: any[]) => {
      args.forEach((param: any) => errorOutput.push(param));
    };
  });

  afterEach(() => {
    console.log = consoleLogRef;
    console.warn = consoleWarnRef;
    console.error = consoleErrorRef;

    logger = undefined;
  });

  describe('construct', () => {
    const testConstructAtLevel = (level?: LogLevelString) => {
      const loggerName: string = `tester.${level}`;
      logger = new ConsoleLogger({ name: loggerName, level }, mockLoggerFactory);
      expect(logger).to.not.be.undefined;
      expect(logger).to.have.all.keys('level', 'loggerFactory', 'name');
      expect(logger)
        .to.have.property('name')
        .that.equals(loggerName);
      expect(logger)
        .to.have.property('level')
        .that.equals(level || 'info');
    };

    it('with default level', () => testConstructAtLevel());
    it('with trace level', () => testConstructAtLevel('trace'));
    it('with debug level', () => testConstructAtLevel('debug'));
    it('with info level', () => testConstructAtLevel('info'));
    it('with warn level', () => testConstructAtLevel('warn'));
    it('with error level', () => testConstructAtLevel('error'));
    it('with fatal level', () => testConstructAtLevel('fatal'));
  });

  describe('start()', () => {
    const testStartAtLevel = (label: string, level?: LogLevelString) => {
      logger = new ConsoleLogger({ name: 'start.tester', level }, mockLoggerFactory);
      logger.start(label);
    };

    describe('unique label', () => {
      it('at default level', () => testStartAtLevel(`label.${randomString(6)}`));
      it('at trace level', () => testStartAtLevel(`label.${randomString(6)}`, 'trace'));
      it('at debug level', () => testStartAtLevel(`label.${randomString(6)}`, 'debug'));
      it('at info level', () => testStartAtLevel(`label.${randomString(6)}`, 'info'));
      it('at warn level', () => testStartAtLevel(`label.${randomString(6)}`, 'warn'));
      it('at error level', () => testStartAtLevel(`label.${randomString(6)}`, 'error'));
      it('at fatal level', () => testStartAtLevel(`label.${randomString(6)}`, 'fatal'));
    });

    describe('previous label, dont throw exception', () => {
      testStartAtLevel(`label`);
      it('at default level', () => testStartAtLevel(`label`));
      it('at trace level', () => testStartAtLevel(`label`, 'trace'));
      it('at debug level', () => testStartAtLevel(`label`, 'debug'));
      it('at info level', () => testStartAtLevel(`label`, 'info'));
      it('at warn level', () => testStartAtLevel(`label`, 'warn'));
      it('at error level', () => testStartAtLevel(`label`, 'error'));
      it('at fatal level', () => testStartAtLevel(`label`, 'fatal'));
    });
  });

  describe('stop()', () => {
    const testStopAtLevel = (label: string, level?: LogLevelString) => {
      logger = new ConsoleLogger({ name: 'start.tester', level }, mockLoggerFactory);
      logger.start(label);
      logger.stop(label);
    };

    describe('unique label', () => {
      it('at default level', () => testStopAtLevel(`label.${randomString(6)}`));
      it('at trace level', () => testStopAtLevel(`label.${randomString(6)}`, 'trace'));
      it('at debug level', () => testStopAtLevel(`label.${randomString(6)}`, 'debug'));
      it('at info level', () => testStopAtLevel(`label.${randomString(6)}`, 'info'));
      it('at warn level', () => testStopAtLevel(`label.${randomString(6)}`, 'error'));
      it('at fatal level', () => testStopAtLevel(`label.${randomString(6)}`, 'fatal'));
    });

    describe('previous label, dont throw exception', () => {
      it('at default level', () => testStopAtLevel(`label`));
      it('at trace level', () => testStopAtLevel(`label`, 'trace'));
      it('at debug level', () => testStopAtLevel(`label`, 'debug'));
      it('at info level', () => testStopAtLevel(`label`, 'info'));
      it('at warn level', () => testStopAtLevel(`label`, 'warn'));
      it('at error level', () => testStopAtLevel(`label`, 'error'));
      it('at fatal level', () => testStopAtLevel(`label`, 'fatal'));
    });
  });

  describe('getLevel()', () => {
    const testGetLevel = (label: string, level?: LogLevelString) => {
      logger = new ConsoleLogger({ name: label, level }, mockLoggerFactory);
      const theLevel: LogLevelString = logger.getLevel();
      expect(theLevel).to.equal(level || 'info');
    };

    it('at default level', () => testGetLevel(`label`));
    it('at trace level', () => testGetLevel(`label`, 'trace'));
    it('at debug level', () => testGetLevel(`label`, 'debug'));
    it('at info level', () => testGetLevel(`label`, 'info'));
    it('at warn level', () => testGetLevel(`label`, 'warn'));
    it('at error level', () => testGetLevel(`label`, 'error'));
    it('at fatal level', () => testGetLevel(`label`, 'fatal'));
  });

  describe('setLevel()', () => {
    const testGetLevel = (label: string, toLevel: LogLevelString, level?: LogLevelString) => {
      logger = new ConsoleLogger({ name: label, level }, mockLoggerFactory);
      logger.setLevel(toLevel);
      const theLevel: LogLevelString = logger.getLevel();
      expect(theLevel).to.equal(toLevel);
    };

    describe('from default', () => {
      it('to trace level', () => testGetLevel(`label`, 'trace'));
      it('to debug level', () => testGetLevel(`label`, 'debug'));
      it('to info level', () => testGetLevel(`label`, 'info'));
      it('to warn level', () => testGetLevel(`label`, 'warn'));
      it('to error level', () => testGetLevel(`label`, 'error'));
      it('to fatal level', () => testGetLevel(`label`, 'fatal'));
    });

    describe('from trace', () => {
      it('to debug level', () => testGetLevel(`label`, 'debug', 'trace'));
      it('to info level', () => testGetLevel(`label`, 'info', 'trace'));
      it('to warn level', () => testGetLevel(`label`, 'warn', 'trace'));
      it('to error level', () => testGetLevel(`label`, 'error', 'trace'));
      it('to fatal level', () => testGetLevel(`label`, 'fatal', 'trace'));
    });

    describe('from debug', () => {
      it('to trace level', () => testGetLevel(`label`, 'trace', 'debug'));
      it('to info level', () => testGetLevel(`label`, 'info', 'debug'));
      it('to warn level', () => testGetLevel(`label`, 'warn', 'debug'));
      it('to error level', () => testGetLevel(`label`, 'error', 'debug'));
      it('to fatal level', () => testGetLevel(`label`, 'fatal', 'debug'));
    });

    describe('from info', () => {
      it('to trace level', () => testGetLevel(`label`, 'trace', 'info'));
      it('to debug level', () => testGetLevel(`label`, 'debug', 'info'));
      it('to warn level', () => testGetLevel(`label`, 'warn', 'info'));
      it('to error level', () => testGetLevel(`label`, 'error', 'info'));
      it('to fatal level', () => testGetLevel(`label`, 'fatal', 'info'));
    });

    describe('from warn', () => {
      it('to trace level', () => testGetLevel(`label`, 'trace', 'warn'));
      it('to debug level', () => testGetLevel(`label`, 'debug', 'warn'));
      it('to info level', () => testGetLevel(`label`, 'info', 'warn'));
      it('to error level', () => testGetLevel(`label`, 'error', 'warn'));
      it('to fatal level', () => testGetLevel(`label`, 'fatal', 'warn'));
    });

    describe('from error', () => {
      it('to trace level', () => testGetLevel(`label`, 'trace', 'error'));
      it('to debug level', () => testGetLevel(`label`, 'debug', 'error'));
      it('to info level', () => testGetLevel(`label`, 'info', 'error'));
      it('to warn level', () => testGetLevel(`label`, 'warn', 'error'));
      it('to fatal level', () => testGetLevel(`label`, 'fatal', 'error'));
    });

    describe('from fatal', () => {
      it('to trace level', () => testGetLevel(`label`, 'trace', 'fatal'));
      it('to debug level', () => testGetLevel(`label`, 'debug', 'fatal'));
      it('to info level', () => testGetLevel(`label`, 'info', 'fatal'));
      it('to warn level', () => testGetLevel(`label`, 'warn', 'fatal'));
      it('to error level', () => testGetLevel(`label`, 'error', 'fatal'));
    });
  });

  describe('is', () => {
    const testIsTrace = (expected: boolean, level?: LogLevelString) => {
      logger = new ConsoleLogger({ name: 'is.check', level }, mockLoggerFactory);
      expect(logger.isTrace()).to.equal(expected);
    };

    describe('Trace()', () => {
      it('at default level', () => testIsTrace(false));
      it('at trace level', () => testIsTrace(true, 'trace'));
      it('at debug level', () => testIsTrace(false, 'debug'));
      it('at info level', () => testIsTrace(false, 'info'));
      it('at warn level', () => testIsTrace(false, 'warn'));
      it('at error level', () => testIsTrace(false, 'error'));
      it('at fatal level', () => testIsTrace(false, 'fatal'));
    });

    const testIsDebug = (expected: boolean, level?: LogLevelString) => {
      logger = new ConsoleLogger({ name: 'is.check', level }, mockLoggerFactory);
      expect(logger.isDebug()).to.equal(expected);
    };

    describe('Debug()', () => {
      it('at default level', () => testIsDebug(false));
      it('at trace level', () => testIsDebug(true, 'trace'));
      it('at debug level', () => testIsDebug(true, 'debug'));
      it('at info level', () => testIsDebug(false, 'info'));
      it('at warn level', () => testIsDebug(false, 'warn'));
      it('at error level', () => testIsDebug(false, 'error'));
      it('at fatal level', () => testIsDebug(false, 'fatal'));
    });

    const testIsInfo = (expected: boolean, level?: LogLevelString) => {
      logger = new ConsoleLogger({ name: 'is.check', level }, mockLoggerFactory);
      expect(logger.isInfo()).to.equal(expected);
    };

    describe('Info()', () => {
      it('at default level', () => testIsInfo(true));
      it('at trace level', () => testIsInfo(true, 'trace'));
      it('at debug level', () => testIsInfo(true, 'debug'));
      it('at info level', () => testIsInfo(true, 'info'));
      it('at warn level', () => testIsInfo(false, 'warn'));
      it('at error level', () => testIsInfo(false, 'error'));
      it('at fatal level', () => testIsInfo(false, 'fatal'));
    });

    const testIsWarn = (expected: boolean, level?: LogLevelString) => {
      logger = new ConsoleLogger({ name: 'is.check', level }, mockLoggerFactory);
      expect(logger.isWarn()).to.equal(expected);
    };

    describe('Warn()', () => {
      it('at default level', () => testIsWarn(true));
      it('at trace level', () => testIsWarn(true, 'trace'));
      it('at debug level', () => testIsWarn(true, 'debug'));
      it('at info level', () => testIsWarn(true, 'info'));
      it('at warn level', () => testIsWarn(true, 'warn'));
      it('at error level', () => testIsWarn(false, 'error'));
      it('at fatal level', () => testIsWarn(false, 'fatal'));
    });

    const testIsError = (expected: boolean, level?: LogLevelString) => {
      logger = new ConsoleLogger({ name: 'is.check', level }, mockLoggerFactory);
      expect(logger.isError()).to.equal(expected);
    };

    describe('Error()', () => {
      it('at default level', () => testIsError(true));
      it('at trace level', () => testIsError(true, 'trace'));
      it('at debug level', () => testIsError(true, 'debug'));
      it('at info level', () => testIsError(true, 'info'));
      it('at warn level', () => testIsError(true, 'warn'));
      it('at error level', () => testIsError(true, 'error'));
      it('at fatal level', () => testIsError(false, 'fatal'));
    });

    const testIsFatal = (expected: boolean, level?: LogLevelString) => {
      logger = new ConsoleLogger({ name: 'is.check', level }, mockLoggerFactory);
      expect(logger.isFatal()).to.equal(expected);
    };

    describe('Fatal()', () => {
      it('at default level', () => testIsFatal(true));
      it('at trace level', () => testIsFatal(true, 'trace'));
      it('at debug level', () => testIsFatal(true, 'debug'));
      it('at info level', () => testIsFatal(true, 'info'));
      it('at warn level', () => testIsFatal(true, 'warn'));
      it('at error level', () => testIsFatal(true, 'error'));
      it('at fatal level', () => testIsFatal(true, 'fatal'));
    });
  });

  describe('log()', () => {
    beforeEach(() => {
      logOutput = [];
      warnOutput = [];
      errorOutput = [];
    });

    describe('a "string" message', () => {
      const testMessage = (
        param: string | Error | any,
        atLevel: LogLevelString,
        shouldShow: boolean,
        level?: LogLevelString
      ) => {
        logger = new ConsoleLogger({ name: 'is.check', level }, mockLoggerFactory);
        logger.log(atLevel, param);

        let output: any[];

        if (atLevel === 'fatal' || atLevel === 'error') output = errorOutput;
        else if (atLevel === 'warn') output = warnOutput;
        else output = logOutput;

        if (!shouldShow) {
          expect(output.length).to.equal(0);
        } else {
          expect(output.length).to.equal(1);
          expect(output[0]).to.have.keys('at', 'msg', 'name', 'level');
          expect(output[0])
            .to.have.property('msg')
            .that.equals(param);
          expect(output[0])
            .to.have.property('level')
            .that.equals(atLevel);
        }
      };
      describe('trace ', () => {
        it('at default level', () => testMessage('Simple test.', 'trace', false));
        it('at trace level', () => testMessage('Simple test.', 'trace', true, 'trace'));
        it('at debug level', () => testMessage('Simple test.', 'trace', false, 'debug'));
        it('at info level', () => testMessage('Simple test.', 'trace', false, 'info'));
        it('at warn level', () => testMessage('Simple test.', 'trace', false, 'warn'));
        it('at error level', () => testMessage('Simple test.', 'trace', false, 'error'));
        it('at fatal level', () => testMessage('Simple test.', 'trace', false, 'fatal'));
      });

      describe('debug message ', () => {
        it('at default level', () => testMessage('Simple test.', 'debug', false));
        it('at trace level', () => testMessage('Simple test.', 'debug', true, 'trace'));
        it('at debug level', () => testMessage('Simple test.', 'debug', true, 'debug'));
        it('at info level', () => testMessage('Simple test.', 'debug', false, 'info'));
        it('at warn level', () => testMessage('Simple test.', 'debug', false, 'warn'));
        it('at error level', () => testMessage('Simple test.', 'debug', false, 'error'));
        it('at fatal level', () => testMessage('Simple test.', 'debug', false, 'fatal'));
      });

      describe('info message ', () => {
        it('at default level', () => testMessage('Simple test.', 'info', true));
        it('at trace level', () => testMessage('Simple test.', 'info', true, 'trace'));
        it('at debug level', () => testMessage('Simple test.', 'info', true, 'debug'));
        it('at info level', () => testMessage('Simple test.', 'info', true, 'info'));
        it('at warn level', () => testMessage('Simple test.', 'info', false, 'warn'));
        it('at error level', () => testMessage('Simple test.', 'info', false, 'error'));
        it('at fatal level', () => testMessage('Simple test.', 'info', false, 'fatal'));
      });

      describe('warn message ', () => {
        it('at default level', () => testMessage('Simple test.', 'warn', true));
        it('at trace level', () => testMessage('Simple test.', 'warn', true, 'trace'));
        it('at debug level', () => testMessage('Simple test.', 'warn', true, 'debug'));
        it('at info level', () => testMessage('Simple test.', 'warn', true, 'info'));
        it('at warn level', () => testMessage('Simple test.', 'warn', true, 'warn'));
        it('at error level', () => testMessage('Simple test.', 'warn', false, 'error'));
        it('at fatal level', () => testMessage('Simple test.', 'warn', false, 'fatal'));
      });

      describe('error message ', () => {
        it('at default level', () => testMessage('Simple test.', 'error', true));
        it('at trace level', () => testMessage('Simple test.', 'error', true, 'trace'));
        it('at debug level', () => testMessage('Simple test.', 'error', true, 'debug'));
        it('at info level', () => testMessage('Simple test.', 'error', true, 'info'));
        it('at warn level', () => testMessage('Simple test.', 'error', true, 'warn'));
        it('at error level', () => testMessage('Simple test.', 'error', true, 'error'));
        it('at fatal level', () => testMessage('Simple test.', 'error', false, 'fatal'));
      });

      describe('fatal message ', () => {
        it('at default level', () => testMessage('Simple test.', 'fatal', true));
        it('at trace level', () => testMessage('Simple test.', 'fatal', true, 'trace'));
        it('at debug level', () => testMessage('Simple test.', 'fatal', true, 'debug'));
        it('at info level', () => testMessage('Simple test.', 'fatal', true, 'info'));
        it('at warn level', () => testMessage('Simple test.', 'fatal', true, 'warn'));
        it('at error level', () => testMessage('Simple test.', 'fatal', true, 'error'));
        it('at fatal level', () => testMessage('Simple test.', 'fatal', true, 'fatal'));
      });
    });

    describe('an Error()', () => {
      const testError = (
        param: string | Error | any,
        atLevel: LogLevelString,
        shouldShow: boolean,
        level?: LogLevelString
      ) => {
        logger = new ConsoleLogger({ name: 'is.check', level }, mockLoggerFactory);
        logger.log(atLevel, param);

        let output: any[];

        if (atLevel === 'fatal' || atLevel === 'error') output = errorOutput;
        else if (atLevel === 'warn') output = warnOutput;
        else output = logOutput;

        if (!shouldShow) {
          expect(output.length).to.equal(0);
        } else {
          expect(output.length).to.equal(1);
          expect(output[0]).to.have.keys('at', 'err', 'msg', 'name', 'level');
          // expect(output[0])
          //   .to.have.property('msg')
          //   .that.equals(param.message);
          expect(output[0])
            .to.have.property('err')
            .that.equal(param);
          expect(output[0])
            .to.have.property('level')
            .that.equals(atLevel);
        }
      };

      describe('trace ', () => {
        it('at default level', () => testError(new Error('Simple test.'), 'trace', false));
        it('at trace level', () => testError(new Error('Simple test.'), 'trace', true, 'trace'));
        it('at debug level', () => testError(new Error('Simple test.'), 'trace', false, 'debug'));
        it('at info level', () => testError(new Error('Simple test.'), 'trace', false, 'info'));
        it('at warn level', () => testError(new Error('Simple test.'), 'trace', false, 'warn'));
        it('at error level', () => testError(new Error('Simple test.'), 'trace', false, 'error'));
        it('at fatal level', () => testError(new Error('Simple test.'), 'trace', false, 'fatal'));
      });

      describe('debug message ', () => {
        it('at default level', () => testError(new Error('Simple test.'), 'debug', false));
        it('at trace level', () => testError(new Error('Simple test.'), 'debug', true, 'trace'));
        it('at debug level', () => testError(new Error('Simple test.'), 'debug', true, 'debug'));
        it('at info level', () => testError(new Error('Simple test.'), 'debug', false, 'info'));
        it('at warn level', () => testError(new Error('Simple test.'), 'debug', false, 'warn'));
        it('at error level', () => testError(new Error('Simple test.'), 'debug', false, 'error'));
        it('at fatal level', () => testError(new Error('Simple test.'), 'debug', false, 'fatal'));
      });

      describe('info message ', () => {
        it('at default level', () => testError(new Error('Simple test.'), 'info', true));
        it('at trace level', () => testError(new Error('Simple test.'), 'info', true, 'trace'));
        it('at debug level', () => testError(new Error('Simple test.'), 'info', true, 'debug'));
        it('at info level', () => testError(new Error('Simple test.'), 'info', true, 'info'));
        it('at warn level', () => testError(new Error('Simple test.'), 'info', false, 'warn'));
        it('at error level', () => testError(new Error('Simple test.'), 'info', false, 'error'));
        it('at fatal level', () => testError(new Error('Simple test.'), 'info', false, 'fatal'));
      });

      describe('warn message ', () => {
        it('at default level', () => testError(new Error('Simple test.'), 'warn', true));
        it('at trace level', () => testError(new Error('Simple test.'), 'warn', true, 'trace'));
        it('at debug level', () => testError(new Error('Simple test.'), 'warn', true, 'debug'));
        it('at info level', () => testError(new Error('Simple test.'), 'warn', true, 'info'));
        it('at warn level', () => testError(new Error('Simple test.'), 'warn', true, 'warn'));
        it('at error level', () => testError(new Error('Simple test.'), 'warn', false, 'error'));
        it('at fatal level', () => testError(new Error('Simple test.'), 'warn', false, 'fatal'));
      });

      describe('error message ', () => {
        it('at default level', () => testError(new Error('Simple test.'), 'error', true));
        it('at trace level', () => testError(new Error('Simple test.'), 'error', true, 'trace'));
        it('at debug level', () => testError(new Error('Simple test.'), 'error', true, 'debug'));
        it('at info level', () => testError(new Error('Simple test.'), 'error', true, 'info'));
        it('at warn level', () => testError(new Error('Simple test.'), 'error', true, 'warn'));
        it('at error level', () => testError(new Error('Simple test.'), 'error', true, 'error'));
        it('at fatal level', () => testError(new Error('Simple test.'), 'error', false, 'fatal'));
      });

      describe('fatal message ', () => {
        it('at default level', () => testError(new Error('Simple test.'), 'fatal', true));
        it('at trace level', () => testError(new Error('Simple test.'), 'fatal', true, 'trace'));
        it('at debug level', () => testError(new Error('Simple test.'), 'fatal', true, 'debug'));
        it('at info level', () => testError(new Error('Simple test.'), 'fatal', true, 'info'));
        it('at warn level', () => testError(new Error('Simple test.'), 'fatal', true, 'warn'));
        it('at error level', () => testError(new Error('Simple test.'), 'fatal', true, 'error'));
        it('at fatal level', () => testError(new Error('Simple test.'), 'fatal', true, 'fatal'));
      });
    });

    describe('an Object()', () => {
      class TestObject {
        constructor(public name: string, public age: number) {}
      }
      const testObject = (
        param: string | Error | any,
        atLevel: LogLevelString,
        shouldShow: boolean,
        level?: LogLevelString
      ) => {
        logger = new ConsoleLogger({ name: 'is.check', level }, mockLoggerFactory);
        logger.log(atLevel, param);

        let output: any[];

        if (atLevel === 'fatal' || atLevel === 'error') output = errorOutput;
        else if (atLevel === 'warn') output = warnOutput;
        else output = logOutput;

        if (!shouldShow) {
          expect(output.length).to.equal(0);
        } else {
          expect(output.length).to.equal(1);
          expect(output[0]).to.have.keys('at', 'data', 'name', 'level');
          expect(output[0])
            .to.have.property('data')
            .that.eqls({ TestObject: { ...param } });
          expect(output[0])
            .to.have.property('level')
            .that.equals(atLevel);
        }
      };

      describe('trace ', () => {
        it('at default level', () => testObject(new TestObject('Simple test.', 23), 'trace', false));
        it('at trace level', () => testObject(new TestObject('Simple test.', 23), 'trace', true, 'trace'));
        it('at debug level', () => testObject(new TestObject('Simple test.', 23), 'trace', false, 'debug'));
        it('at info level', () => testObject(new TestObject('Simple test.', 23), 'trace', false, 'info'));
        it('at warn level', () => testObject(new TestObject('Simple test.', 23), 'trace', false, 'warn'));
        it('at error level', () => testObject(new TestObject('Simple test.', 23), 'trace', false, 'error'));
        it('at fatal level', () => testObject(new TestObject('Simple test.', 23), 'trace', false, 'fatal'));
      });

      describe('debug message ', () => {
        it('at default level', () => testObject(new TestObject('Simple test.', 23), 'debug', false));
        it('at trace level', () => testObject(new TestObject('Simple test.', 23), 'debug', true, 'trace'));
        it('at debug level', () => testObject(new TestObject('Simple test.', 23), 'debug', true, 'debug'));
        it('at info level', () => testObject(new TestObject('Simple test.', 23), 'debug', false, 'info'));
        it('at warn level', () => testObject(new TestObject('Simple test.', 23), 'debug', false, 'warn'));
        it('at error level', () => testObject(new TestObject('Simple test.', 23), 'debug', false, 'error'));
        it('at fatal level', () => testObject(new TestObject('Simple test.', 23), 'debug', false, 'fatal'));
      });

      describe('info message ', () => {
        it('at default level', () => testObject(new TestObject('Simple test.', 23), 'info', true));
        it('at trace level', () => testObject(new TestObject('Simple test.', 23), 'info', true, 'trace'));
        it('at debug level', () => testObject(new TestObject('Simple test.', 23), 'info', true, 'debug'));
        it('at info level', () => testObject(new TestObject('Simple test.', 23), 'info', true, 'info'));
        it('at warn level', () => testObject(new TestObject('Simple test.', 23), 'info', false, 'warn'));
        it('at error level', () => testObject(new TestObject('Simple test.', 23), 'info', false, 'error'));
        it('at fatal level', () => testObject(new TestObject('Simple test.', 23), 'info', false, 'fatal'));
      });

      describe('warn message ', () => {
        it('at default level', () => testObject(new TestObject('Simple test.', 23), 'warn', true));
        it('at trace level', () => testObject(new TestObject('Simple test.', 23), 'warn', true, 'trace'));
        it('at debug level', () => testObject(new TestObject('Simple test.', 23), 'warn', true, 'debug'));
        it('at info level', () => testObject(new TestObject('Simple test.', 23), 'warn', true, 'info'));
        it('at warn level', () => testObject(new TestObject('Simple test.', 23), 'warn', true, 'warn'));
        it('at error level', () => testObject(new TestObject('Simple test.', 23), 'warn', false, 'error'));
        it('at fatal level', () => testObject(new TestObject('Simple test.', 23), 'warn', false, 'fatal'));
      });

      describe('error message ', () => {
        it('at default level', () => testObject(new TestObject('Simple test.', 23), 'error', true));
        it('at trace level', () => testObject(new TestObject('Simple test.', 23), 'error', true, 'trace'));
        it('at debug level', () => testObject(new TestObject('Simple test.', 23), 'error', true, 'debug'));
        it('at info level', () => testObject(new TestObject('Simple test.', 23), 'error', true, 'info'));
        it('at warn level', () => testObject(new TestObject('Simple test.', 23), 'error', true, 'warn'));
        it('at error level', () => testObject(new TestObject('Simple test.', 23), 'error', true, 'error'));
        it('at fatal level', () => testObject(new TestObject('Simple test.', 23), 'error', false, 'fatal'));
      });

      describe('fatal message ', () => {
        it('at default level', () => testObject(new TestObject('Simple test.', 23), 'fatal', true));
        it('at trace level', () => testObject(new TestObject('Simple test.', 23), 'fatal', true, 'trace'));
        it('at debug level', () => testObject(new TestObject('Simple test.', 23), 'fatal', true, 'debug'));
        it('at info level', () => testObject(new TestObject('Simple test.', 23), 'fatal', true, 'info'));
        it('at warn level', () => testObject(new TestObject('Simple test.', 23), 'fatal', true, 'warn'));
        it('at error level', () => testObject(new TestObject('Simple test.', 23), 'fatal', true, 'error'));
        it('at fatal level', () => testObject(new TestObject('Simple test.', 23), 'fatal', true, 'fatal'));
      });
    });

    describe('a message and object', () => {
      class TestObject {
        constructor(public name: string, public age: number) {}
      }

      const testMessageAndObject = (
        param: (string | Error | any)[],
        atLevel: LogLevelString,
        shouldShow: boolean,
        level?: LogLevelString
      ) => {
        logger = new ConsoleLogger({ name: 'is.check', level }, mockLoggerFactory);
        logger.log(atLevel, param[0], param[1]);

        let output: any[];

        if (atLevel === 'fatal' || atLevel === 'error') output = errorOutput;
        else if (atLevel === 'warn') output = warnOutput;
        else output = logOutput;

        if (!shouldShow) {
          expect(output.length).to.equal(0);
        } else {
          expect(output.length).to.equal(1);
          expect(output[0]).to.have.keys('at', 'data', 'name', 'msg', 'level');
          expect(output[0])
            .to.have.property('data')
            .that.eqls({ TestObject: { ...param[1] } });
          expect(output[0])
            .to.have.property('msg')
            .that.equals(param[0]);
          expect(output[0])
            .to.have.property('level')
            .that.equals(atLevel);
        }
      };

      const params: any[] = ['what a great thing', new TestObject('Simple test.', 23)];

      describe('trace ', () => {
        it('at default level', () => testMessageAndObject(params, 'trace', false));
        it('at trace level', () => testMessageAndObject(params, 'trace', true, 'trace'));
        it('at debug level', () => testMessageAndObject(params, 'trace', false, 'debug'));
        it('at info level', () => testMessageAndObject(params, 'trace', false, 'info'));
        it('at warn level', () => testMessageAndObject(params, 'trace', false, 'warn'));
        it('at error level', () => testMessageAndObject(params, 'trace', false, 'error'));
        it('at fatal level', () => testMessageAndObject(params, 'trace', false, 'fatal'));
      });

      describe('debug message ', () => {
        it('at default level', () => testMessageAndObject(params, 'debug', false));
        it('at trace level', () => testMessageAndObject(params, 'debug', true, 'trace'));
        it('at debug level', () => testMessageAndObject(params, 'debug', true, 'debug'));
        it('at info level', () => testMessageAndObject(params, 'debug', false, 'info'));
        it('at warn level', () => testMessageAndObject(params, 'debug', false, 'warn'));
        it('at error level', () => testMessageAndObject(params, 'debug', false, 'error'));
        it('at fatal level', () => testMessageAndObject(params, 'debug', false, 'fatal'));
      });

      describe('info message ', () => {
        it('at default level', () => testMessageAndObject(params, 'info', true));
        it('at trace level', () => testMessageAndObject(params, 'info', true, 'trace'));
        it('at debug level', () => testMessageAndObject(params, 'info', true, 'debug'));
        it('at info level', () => testMessageAndObject(params, 'info', true, 'info'));
        it('at warn level', () => testMessageAndObject(params, 'info', false, 'warn'));
        it('at error level', () => testMessageAndObject(params, 'info', false, 'error'));
        it('at fatal level', () => testMessageAndObject(params, 'info', false, 'fatal'));
      });

      describe('warn message ', () => {
        it('at default level', () => testMessageAndObject(params, 'warn', true));
        it('at trace level', () => testMessageAndObject(params, 'warn', true, 'trace'));
        it('at debug level', () => testMessageAndObject(params, 'warn', true, 'debug'));
        it('at info level', () => testMessageAndObject(params, 'warn', true, 'info'));
        it('at warn level', () => testMessageAndObject(params, 'warn', true, 'warn'));
        it('at error level', () => testMessageAndObject(params, 'warn', false, 'error'));
        it('at fatal level', () => testMessageAndObject(params, 'warn', false, 'fatal'));
      });

      describe('error message ', () => {
        it('at default level', () => testMessageAndObject(params, 'error', true));
        it('at trace level', () => testMessageAndObject(params, 'error', true, 'trace'));
        it('at debug level', () => testMessageAndObject(params, 'error', true, 'debug'));
        it('at info level', () => testMessageAndObject(params, 'error', true, 'info'));
        it('at warn level', () => testMessageAndObject(params, 'error', true, 'warn'));
        it('at error level', () => testMessageAndObject(params, 'error', true, 'error'));
        it('at fatal level', () => testMessageAndObject(params, 'error', false, 'fatal'));
      });

      describe('fatal message ', () => {
        it('at default level', () => testMessageAndObject(params, 'fatal', true));
        it('at trace level', () => testMessageAndObject(params, 'fatal', true, 'trace'));
        it('at debug level', () => testMessageAndObject(params, 'fatal', true, 'debug'));
        it('at info level', () => testMessageAndObject(params, 'fatal', true, 'info'));
        it('at warn level', () => testMessageAndObject(params, 'fatal', true, 'warn'));
        it('at error level', () => testMessageAndObject(params, 'fatal', true, 'error'));
        it('at fatal level', () => testMessageAndObject(params, 'fatal', true, 'fatal'));
      });
    });

    describe('a message and Error', () => {
      class TestObject {
        constructor(public name: string, public age: number) {}
      }

      const testMessageAndError = (
        param: (string | Error | any)[],
        atLevel: LogLevelString,
        shouldShow: boolean,
        level?: LogLevelString
      ) => {
        logger = new ConsoleLogger({ name: 'is.check', level }, mockLoggerFactory);
        logger.log(atLevel, param[0], param[1]);

        let output: any[];

        if (atLevel === 'fatal' || atLevel === 'error') output = errorOutput;
        else if (atLevel === 'warn') output = warnOutput;
        else output = logOutput;

        if (!shouldShow) {
          expect(output.length).to.equal(0);
        } else {
          expect(output.length).to.equal(1);
          expect(output[0]).to.have.keys('at', 'err', 'name', 'msg', 'level');
          expect(output[0])
            .to.have.property('err')
            .that.equal(param[1]);
          expect(output[0])
            .to.have.property('msg')
            .that.equals(param[0]);
          expect(output[0])
            .to.have.property('level')
            .that.equals(atLevel);
        }
      };

      const params: any[] = ['what a great thing', new Error('Simple test.')];

      describe('trace ', () => {
        it('at default level', () => testMessageAndError(params, 'trace', false));
        it('at trace level', () => testMessageAndError(params, 'trace', true, 'trace'));
        it('at debug level', () => testMessageAndError(params, 'trace', false, 'debug'));
        it('at info level', () => testMessageAndError(params, 'trace', false, 'info'));
        it('at warn level', () => testMessageAndError(params, 'trace', false, 'warn'));
        it('at error level', () => testMessageAndError(params, 'trace', false, 'error'));
        it('at fatal level', () => testMessageAndError(params, 'trace', false, 'fatal'));
      });

      describe('debug message ', () => {
        it('at default level', () => testMessageAndError(params, 'debug', false));
        it('at trace level', () => testMessageAndError(params, 'debug', true, 'trace'));
        it('at debug level', () => testMessageAndError(params, 'debug', true, 'debug'));
        it('at info level', () => testMessageAndError(params, 'debug', false, 'info'));
        it('at warn level', () => testMessageAndError(params, 'debug', false, 'warn'));
        it('at error level', () => testMessageAndError(params, 'debug', false, 'error'));
        it('at fatal level', () => testMessageAndError(params, 'debug', false, 'fatal'));
      });

      describe('info message ', () => {
        it('at default level', () => testMessageAndError(params, 'info', true));
        it('at trace level', () => testMessageAndError(params, 'info', true, 'trace'));
        it('at debug level', () => testMessageAndError(params, 'info', true, 'debug'));
        it('at info level', () => testMessageAndError(params, 'info', true, 'info'));
        it('at warn level', () => testMessageAndError(params, 'info', false, 'warn'));
        it('at error level', () => testMessageAndError(params, 'info', false, 'error'));
        it('at fatal level', () => testMessageAndError(params, 'info', false, 'fatal'));
      });

      describe('warn message ', () => {
        it('at default level', () => testMessageAndError(params, 'warn', true));
        it('at trace level', () => testMessageAndError(params, 'warn', true, 'trace'));
        it('at debug level', () => testMessageAndError(params, 'warn', true, 'debug'));
        it('at info level', () => testMessageAndError(params, 'warn', true, 'info'));
        it('at warn level', () => testMessageAndError(params, 'warn', true, 'warn'));
        it('at error level', () => testMessageAndError(params, 'warn', false, 'error'));
        it('at fatal level', () => testMessageAndError(params, 'warn', false, 'fatal'));
      });

      describe('error message ', () => {
        it('at default level', () => testMessageAndError(params, 'error', true));
        it('at trace level', () => testMessageAndError(params, 'error', true, 'trace'));
        it('at debug level', () => testMessageAndError(params, 'error', true, 'debug'));
        it('at info level', () => testMessageAndError(params, 'error', true, 'info'));
        it('at warn level', () => testMessageAndError(params, 'error', true, 'warn'));
        it('at error level', () => testMessageAndError(params, 'error', true, 'error'));
        it('at fatal level', () => testMessageAndError(params, 'error', false, 'fatal'));
      });

      describe('fatal message ', () => {
        it('at default level', () => testMessageAndError(params, 'fatal', true));
        it('at trace level', () => testMessageAndError(params, 'fatal', true, 'trace'));
        it('at debug level', () => testMessageAndError(params, 'fatal', true, 'debug'));
        it('at info level', () => testMessageAndError(params, 'fatal', true, 'info'));
        it('at warn level', () => testMessageAndError(params, 'fatal', true, 'warn'));
        it('at error level', () => testMessageAndError(params, 'fatal', true, 'error'));
        it('at fatal level', () => testMessageAndError(params, 'fatal', true, 'fatal'));
      });
    });

    describe('a complex statement', () => {
      class TestObject {
        constructor(public name: string, public age: number) {}
      }

      const testIt = (
        param: (string | Error | any)[],
        atLevel: LogLevelString,
        shouldShow: boolean,
        level?: LogLevelString
      ) => {
        logger = new ConsoleLogger({ name: 'is.check', level }, mockLoggerFactory);
        logger.log(atLevel, param[0], param[1], param[2], param[3]);

        let output: any[];

        if (atLevel === 'fatal' || atLevel === 'error') output = errorOutput;
        else if (atLevel === 'warn') output = warnOutput;
        else output = logOutput;

        if (!shouldShow) {
          expect(output.length).to.equal(0);
        } else {
          expect(output.length).to.equal(1);
          expect(output[0]).to.have.keys('at', 'err', 'data', 'func', 'name', 'msg', 'level');
          expect(output[0])
            .to.have.property('func')
            .that.equals(param[0]);
          expect(output[0])
            .to.have.property('msg')
            .that.equals(param[1]);
          expect(output[0])
            .to.have.property('err')
            .that.equal(param[2]);
          expect(output[0])
            .to.have.property('data')
            .that.eqls({ TestObject: { ...param[3] } });
          expect(output[0])
            .to.have.property('level')
            .that.equals(atLevel);
        }
      };

      const params: any[] = [
        'test()',
        'what a great thing',
        new Error('Simple test.'),
        new TestObject('someObject', 99),
      ];

      describe('trace ', () => {
        it('at default level', () => testIt(params, 'trace', false));
        it('at trace level', () => testIt(params, 'trace', true, 'trace'));
        it('at debug level', () => testIt(params, 'trace', false, 'debug'));
        it('at info level', () => testIt(params, 'trace', false, 'info'));
        it('at warn level', () => testIt(params, 'trace', false, 'warn'));
        it('at error level', () => testIt(params, 'trace', false, 'error'));
        it('at fatal level', () => testIt(params, 'trace', false, 'fatal'));
      });

      describe('debug message ', () => {
        it('at default level', () => testIt(params, 'debug', false));
        it('at trace level', () => testIt(params, 'debug', true, 'trace'));
        it('at debug level', () => testIt(params, 'debug', true, 'debug'));
        it('at info level', () => testIt(params, 'debug', false, 'info'));
        it('at warn level', () => testIt(params, 'debug', false, 'warn'));
        it('at error level', () => testIt(params, 'debug', false, 'error'));
        it('at fatal level', () => testIt(params, 'debug', false, 'fatal'));
      });

      describe('info message ', () => {
        it('at default level', () => testIt(params, 'info', true));
        it('at trace level', () => testIt(params, 'info', true, 'trace'));
        it('at debug level', () => testIt(params, 'info', true, 'debug'));
        it('at info level', () => testIt(params, 'info', true, 'info'));
        it('at warn level', () => testIt(params, 'info', false, 'warn'));
        it('at error level', () => testIt(params, 'info', false, 'error'));
        it('at fatal level', () => testIt(params, 'info', false, 'fatal'));
      });

      describe('warn message ', () => {
        it('at default level', () => testIt(params, 'warn', true));
        it('at trace level', () => testIt(params, 'warn', true, 'trace'));
        it('at debug level', () => testIt(params, 'warn', true, 'debug'));
        it('at info level', () => testIt(params, 'warn', true, 'info'));
        it('at warn level', () => testIt(params, 'warn', true, 'warn'));
        it('at error level', () => testIt(params, 'warn', false, 'error'));
        it('at fatal level', () => testIt(params, 'warn', false, 'fatal'));
      });

      describe('error message ', () => {
        it('at default level', () => testIt(params, 'error', true));
        it('at trace level', () => testIt(params, 'error', true, 'trace'));
        it('at debug level', () => testIt(params, 'error', true, 'debug'));
        it('at info level', () => testIt(params, 'error', true, 'info'));
        it('at warn level', () => testIt(params, 'error', true, 'warn'));
        it('at error level', () => testIt(params, 'error', true, 'error'));
        it('at fatal level', () => testIt(params, 'error', false, 'fatal'));
      });

      describe('fatal message ', () => {
        it('at default level', () => testIt(params, 'fatal', true));
        it('at trace level', () => testIt(params, 'fatal', true, 'trace'));
        it('at debug level', () => testIt(params, 'fatal', true, 'debug'));
        it('at info level', () => testIt(params, 'fatal', true, 'info'));
        it('at warn level', () => testIt(params, 'fatal', true, 'warn'));
        it('at error level', () => testIt(params, 'fatal', true, 'error'));
        it('at fatal level', () => testIt(params, 'fatal', true, 'fatal'));
      });
    });
  });
});
