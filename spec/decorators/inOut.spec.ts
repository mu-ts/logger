import 'mocha';
import { expect } from 'chai';
import { inOut } from '../../src/decorators/inOut';
import { LogLevelString, LoggerService } from '../../src/index';
import { MockLoggerFactory } from '../mock/MockLoggerFactory';
import { MockLoggerStatement } from '../mock/MockLoggerStatement';
import { MockLogger } from '../mock/MockLogger';

describe('@inOut', () => {
  const loggerFactory: MockLoggerFactory = new MockLoggerFactory();
  LoggerService.setLoggerFactory(loggerFactory);

  class TestClass {
    constructor() {}

    public doSync(value: string): string {
      return ` --> ${value}`;
    }

    public async doASync(value: string): Promise<string> {
      return new Promise((resolve, reject) => setTimeout(() => resolve(` --> ${value}`), 25));
    }
  }

  it('define without error.', () => {
    expect(() => inOut()).to.not.be.undefined;
  });

  describe('on synchronous functions', () => {
    const testSynchronous = (level?: LogLevelString) => {
      const functionName: string = 'doSync';
      const doInOut: Function = inOut({ atLevel: level });
      const descriptor: PropertyDescriptor = doInOut(
        TestClass.prototype,
        functionName,
        Object.getOwnPropertyDescriptor(TestClass.prototype, functionName)
      );

      expect(descriptor).to.not.be.undefined;

      const argument: string = 'test-1';

      const logger: MockLogger = LoggerService.named(`TestClass.inOut`) as MockLogger;
      logger.clearLogStatements();

      descriptor.value(argument);

      const statements: MockLoggerStatement[] = logger.getLogStatements();

      expect(statements).to.have.lengthOf(2);

      expect(statements[0])
        .to.have.property('type')
        .that.equals(`log.${level || 'debug'}`);
      expect(statements[0]).to.have.property('params');
      const statementIn: any = statements[0].getParams()[0];
      expect(statementIn)
        .to.have.property('func')
        .that.equals(`${functionName}()`);
      expect(statementIn)
        .to.have.property('clazz')
        .that.equals('TestClass');
      expect(statementIn)
        .to.have.property('msg')
        .that.equals('inOut -->');
      expect(statementIn)
        .to.have.property('args')
        .that.eqls([argument]);

      expect(statements[1])
        .to.have.property('type')
        .that.equals(`log.${level || 'debug'}`);
      expect(statements[1]).to.have.property('params');
      const statementOut: any = statements[1].getParams()[0];
      expect(statementOut)
        .to.have.property('func')
        .that.equals(`${functionName}()`);
      expect(statementOut)
        .to.have.property('clazz')
        .that.equals('TestClass');
      expect(statementOut)
        .to.have.property('msg')
        .that.equals('inOut <--');
      expect(statementOut)
        .to.have.property('result')
        .that.eqls(` --> ${argument}`);
    };

    it('at default level (debug).', () => testSynchronous());
    it('at trace level.', () => testSynchronous('trace'));
    it('at debug level.', () => testSynchronous('debug'));
    it('at info level.', () => testSynchronous('info'));
    it('at warn level.', () => testSynchronous('warn'));
    it('at error level.', () => testSynchronous('error'));
    it('at fatal level.', () => testSynchronous('fatal'));
  });

  describe('on an asynchronous functions', () => {
    const testASynchronous = async (level?: LogLevelString) => {
      const functionName: string = 'doASync';
      const doInOut: Function = inOut({ atLevel: level });
      const descriptor: PropertyDescriptor = doInOut(
        TestClass.prototype,
        functionName,
        Object.getOwnPropertyDescriptor(TestClass.prototype, functionName)
      );

      expect(descriptor).to.not.be.undefined;

      const argument: string = 'test-1';

      const logger: MockLogger = LoggerService.named(`TestClass.inOut`) as MockLogger;
      logger.clearLogStatements();

      await descriptor.value(argument);

      const statements: MockLoggerStatement[] = logger.getLogStatements();

      expect(statements).to.have.lengthOf(3);

      expect(statements[0])
        .to.have.property('type')
        .that.equals(`log.${level || 'debug'}`);
      expect(statements[0]).to.have.property('params');
      const statementIn: any = statements[0].getParams()[0];
      expect(statementIn)
        .to.have.property('func')
        .that.equals(`${functionName}()`);
      expect(statementIn)
        .to.have.property('clazz')
        .that.equals('TestClass');
      expect(statementIn)
        .to.have.property('msg')
        .that.equals('inOut -->');
      expect(statementIn)
        .to.have.property('args')
        .that.eqls([argument]);

      expect(statements[1])
        .to.have.property('type')
        .that.equals(`log.${level || 'debug'}`);
      expect(statements[1]).to.have.property('params');
      const statementMiddle: any = statements[1].getParams()[0];
      expect(statementMiddle)
        .to.have.property('func')
        .that.equals(`${functionName}()`);
      expect(statementMiddle)
        .to.have.property('clazz')
        .that.equals('TestClass');
      expect(statementMiddle)
        .to.have.property('msg')
        .that.equals('inOut -- promisified function');

      expect(statements[2])
        .to.have.property('type')
        .that.equals(`log.${level || 'debug'}`);
      expect(statements[2]).to.have.property('params');
      const statementOut: any = statements[2].getParams()[0];
      expect(statementOut)
        .to.have.property('func')
        .that.equals(`${functionName}()`);
      expect(statementOut)
        .to.have.property('clazz')
        .that.equals('TestClass');
      expect(statementOut)
        .to.have.property('msg')
        .that.equals('inOut <--');
      expect(statementOut)
        .to.have.property('result')
        .that.eqls(` --> ${argument}`);
    };

    it('at default level (debug).', () => testASynchronous());
    it('at trace level.', () => testASynchronous('trace'));
    it('at debug level.', () => testASynchronous('debug'));
    it('at info level.', () => testASynchronous('info'));
    it('at warn level.', () => testASynchronous('warn'));
    it('at error level.', () => testASynchronous('error'));
    it('at fatal level.', () => testASynchronous('fatal'));
  });
});
