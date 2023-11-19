import 'mocha';
import { expect } from 'chai';
import { duration, LoggerService } from '../../src';
import { MockLoggerFactory } from '../mock/MockLoggerFactory';
import { MockLogger } from '../mock/MockLogger';
import { MockLoggerStatement } from '../mock/MockLoggerStatement';

describe('@duration', () => {
  const loggerFactory: MockLoggerFactory = new MockLoggerFactory();
  LoggerService.setLoggerFactory(loggerFactory);

  class TestClass {
    constructor() {}

    public doSync(value: string): string {
      return ` --> ${value}`;
    }

    public async doASync(value: string): Promise<string> {
      return new Promise(resolve => setTimeout(() => resolve(` --> ${value}`), 25));
    }
  }

  it('define without error.', () => {
    expect(() => duration()).to.not.be.undefined;
  });

  it('measure a synchronous function', () => {
    const functionName: string = 'doSync';
    const doduration: Function = duration();
    const descriptor: PropertyDescriptor = doduration(
      TestClass.prototype.constructor,
      functionName,
      Object.getOwnPropertyDescriptor(TestClass.prototype, functionName)
    );

    expect(descriptor).to.not.be.undefined;

    const logger: MockLogger = LoggerService.named(`TestClass.duration`) as MockLogger;
    logger.clearLogStatements();

    descriptor.value('test');

    const statements: MockLoggerStatement[] = logger.getLogStatements();

    expect(statements).to.have.lengthOf(2);
    expect(statements[0])
      .to.have.property('type')
      .that.equals('start');
    expect(statements[0]).to.have.property('params');
    expect(statements[0].getParams()[0])
      .to.have.property('label')
      .that.equals(functionName);

    expect(statements[1])
      .to.have.property('type')
      .that.equals('stop');
    expect(statements[1]).to.have.property('params');
    expect(statements[1].getParams()[0])
      .to.have.property('label')
      .that.equals(functionName);
  });

  it('measure an asynchronous function', async () => {
    const functionName: string = 'doASync';
    const doduration: Function = duration();
    const descriptor: PropertyDescriptor = doduration(
      TestClass.prototype.constructor,
      functionName,
      Object.getOwnPropertyDescriptor(TestClass.prototype, functionName)
    );

    expect(descriptor).to.not.be.undefined;

    const logger: MockLogger = LoggerService.named(`TestClass.duration`) as MockLogger;
    logger.clearLogStatements();

    await descriptor.value('test');

    const statements: MockLoggerStatement[] = logger.getLogStatements();

    expect(statements).to.have.lengthOf(2);
    expect(statements[0])
      .to.have.property('type')
      .that.equals('start');
    expect(statements[0]).to.have.property('params');
    expect(statements[0].getParams()[0])
      .to.have.property('label')
      .that.equals(functionName);

    expect(statements[1])
      .to.have.property('type')
      .that.equals('stop');
    expect(statements[1]).to.have.property('params');
    expect(statements[1].getParams()[0])
      .to.have.property('label')
      .that.equals(functionName);
  });
});
