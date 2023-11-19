import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { LoggerFilter, LoggerConfig, LoggerFactory, CreditCardLoggerFilter, LogLevelString } from '../../src';
import { ConsoleLogger } from '../../src/console/ConsoleLogger';

describe('ConsoleLogger', () => {
  let logger: ConsoleLogger;
  let mockFactory: LoggerFactory;
  let mockFilters: LoggerFilter[];
  let consoleLogSpy: sinon.SinonSpy;
  let consoleInfoSpy: sinon.SinonSpy;
  let consoleDebugSpy: sinon.SinonSpy;
  let consoleWarnSpy: sinon.SinonSpy;
  let consoleErrorSpy: sinon.SinonSpy;

  beforeEach(() => {
    mockFactory = {
      // Mock factory methods
      newLogger: sinon.fake.returns({}) as any
    };

    mockFilters = [
      new CreditCardLoggerFilter()
    ];

    const config: LoggerConfig = {
      name: 'TestLogger',
      level: 'info',
      adornments: {
        framework: '@mu-ts'
      }
    };

    consoleLogSpy = sinon.spy(console, 'log');
    consoleInfoSpy = sinon.spy(console, 'info');
    consoleDebugSpy = sinon.spy(console, 'debug');
    consoleWarnSpy = sinon.spy(console, 'warn');
    consoleErrorSpy = sinon.spy(console, 'error');
    logger = new ConsoleLogger(config, mockFactory, mockFilters);
  });

  afterEach(() => {
    consoleLogSpy.restore();
    consoleInfoSpy.restore();
    consoleDebugSpy.restore();
    consoleWarnSpy.restore();
    consoleErrorSpy.restore();
  });

  it('should throw an error if name is not provided', () => {
    expect(() => new ConsoleLogger({} as LoggerConfig, mockFactory)).to.throw();
  });

  describe('child', () => {
    it('should create a child logger', () => {
      const childLogger = logger.child('child');
      expect(childLogger).to.not.be.null;
    });
  });

  describe('start and stop', () => {
    it('should start and stop timers', () => {
      logger.start('label');
      logger.stop('label');
      expect(consoleLogSpy.called).to.be.true;
    });
  });

  describe('setLevel and getLevel', () => {
    it('should set and get log level', () => {
      logger.setLevel('debug');
      expect(logger.getLevel()).to.equal('debug');
    });
  });

  describe('Logging Methods', () => {
    it('should log info', () => {
      logger.info('Test info');
      expect(consoleLogSpy.called).to.be.true;
    });

    it('should log INFO', () => {
      logger.setLevel('INFO' as LogLevelString);
      logger.info('Test info');
      expect(consoleLogSpy.called).to.be.true;
    });

    it('should log trace', () => {
      logger.setLevel('trace');
      logger.trace('Test trace');
      expect(consoleDebugSpy.called).to.be.true;
    });

    it('should log debug', () => {
      logger.setLevel('debug');
      logger.debug('Test debug');
      expect(consoleDebugSpy.called).to.be.true;
    });

    it('should log warn', () => {
      logger.warn('Test warn');
      expect(consoleWarnSpy.called).to.be.true;
    });

    it('should log error', () => {
      logger.error('Test error');
      expect(consoleErrorSpy.called).to.be.true;
    });

    it('should log fatal', () => {
      logger.fatal('Test fatal');
      expect(consoleErrorSpy.called).to.be.true;
    });
  });

  describe('Log Level Checks', () => {
    it('should check if isTrace is true', () => {
      logger.setLevel('trace');
      expect(logger.isTrace()).to.be.true;
    });

    it('should check if isDebug is true', () => {
      logger.setLevel('debug');
      expect(logger.isDebug()).to.be.true;
    });

    it('should check if isInfo is true', () => {
      expect(logger.isInfo()).to.be.true;
    });

    it('should check if isWarn is true', () => {
      logger.setLevel('warn');
      expect(logger.isWarn()).to.be.true;
    });

    it('should check if isError is true', () => {
      logger.setLevel('error');
      expect(logger.isError()).to.be.true;
    });

    it('should check if isFatal is true', () => {
      expect(logger.isFatal()).to.be.true;
    });
  });

  it('should not log if the level is below the current logger level', () => {
    logger.setLevel('warn');
    logger.info('Should not be logged');
    expect(consoleLogSpy.notCalled).to.be.true;
  });

  describe('should handle various types of parameters in log function', () => {
    it('log array and objects', () => {
      logger.info('String', new Error('An error'), { an: 'object' }, ['an', 'array']);
      expect(consoleLogSpy.called).to.be.true;
    });
    
    it('should log clazz', () => {
      const response: any = (logger as unknown).toStatement('info', { clazz: 'SpecialClass' });
      expect(response.clazz).to.equal('SpecialClass');
    });
    
    it('should log error', () => {
      let response: any = (logger as unknown).toStatement('info', new Error('Big problem'));
      expect(response.err.type).to.equal('Error');
      
      response = (logger as unknown).toStatement('info', new Error('Big problem'), new Error('Big problem2'));
      expect(response.errs).to.not.be.undefined;
      
    });

    it('should log function', () => {
      const response: any = (logger as unknown).toStatement('info', { func: 'specialFunc()' });
      expect(response.func).to.equal('specialFunc()');
    });

    it('should log msg', () => {
      const response: any = (logger as unknown).toStatement('info', { msg: 'special msg' });
      expect(response.msg).to.equal('special msg');
    });
  });

  // it('should handle various types of parameters in toStatement function', () => {
  //   // You may need to create a spy or fake for the private `toStatement` method, 
  //   // or you can test it indirectly through public methods that use it.
  // });

  // it('should deep copy objects correctly', () => {
  //   // Test deep copy functionality
  //   // You may need to create a spy or fake for the private `deepCopy` method, 
  //   // or you can test it indirectly through public methods that use it.
  // });
});