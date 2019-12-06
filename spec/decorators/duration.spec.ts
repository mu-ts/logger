import 'mocha';
import { expect } from 'chai';
import { duration } from '../../src/decorators/duration';
import { LogLevelString, LoggerService } from '../../src';
import { MockLoggerFactory } from '../mock/MockLoggerFactory';

xdescribe('duration', () => {
  class TestClass {
    constructor() {}

    public doSync(value: string): string {
      return ` --> ${value}`;
    }

    public async doASync(value: string): Promise<string> {
      return new Promise((resolve, reject) => setTimeout(() => resolve(` --> ${value}`), 25));
    }
  }

  beforeEach(() => {
    LoggerService.setLoggerFactory(new MockLoggerFactory());
  });

  it('Should return method definition without error.', () => {
    const funxion: Function = duration();
    expect(funxion).to.not.be.undefined;
  });

  describe('should work for synchronous execution.', () => {
    let logOutput: any[];
    let consoleLogRef: any;

    beforeEach(() => {
      consoleLogRef = console.log;

      logOutput = [];

      console.log = (...args: any[]) => {
        args.forEach((param: any) => logOutput.push(param));
      };
    });

    afterEach(() => {
      console.log = consoleLogRef;
    });

    it('at default level.', () => {
      const doduration: Function = duration();
      const descriptor: PropertyDescriptor = doduration(
        TestClass.prototype.constructor,
        'doSync',
        Object.getOwnPropertyDescriptor(TestClass.prototype, 'doSync')
      );

      expect(descriptor).to.not.be.undefined;

      descriptor.value('test');

      expect(logOutput).to.have.lengthOf(3);

      console.error('logOutput', logOutput);
    });
  });

  describe('should work for asynchronous (Promisified) execution.', () => {
    let logOutput: any[];
    let consoleLogRef: any;

    beforeEach(() => {
      consoleLogRef = console.log;

      logOutput = [];

      console.log = (...args: any[]) => {
        args.forEach((param: any) => logOutput.push(param));
      };
    });

    afterEach(() => {
      console.log = consoleLogRef;
    });

    it('at default level.', async () => {
      const level: LogLevelString = 'debug';
      const doduration: Function = duration();
      const descriptor: PropertyDescriptor = doduration(
        TestClass.prototype.constructor,
        'doASync',
        Object.getOwnPropertyDescriptor(TestClass.prototype, 'doASync')
      );

      expect(descriptor).to.not.be.undefined;

      await descriptor.value('test');

      expect(logOutput).to.have.lengthOf(0);
    });
  });
});
