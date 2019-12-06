import 'mocha';
import { expect } from 'chai';
import { inOut } from '../../src/decorators/inOut';
import { LogLevelString } from '../../src';

xdescribe('inOut', () => {
  class TestClass {
    constructor() {}

    public doSync(value: string): string {
      return ` --> ${value}`;
    }

    public async doASync(value: string): Promise<string> {
      return new Promise((resolve, reject) => setTimeout(() => resolve(` --> ${value}`), 25));
    }
  }

  it('Should return method definition without error.', () => {
    const funxion: Function = inOut();
    expect(funxion).to.not.be.undefined;
  });

  describe('should work for synchronous execution.', () => {
    let logOutput: any[];
    let warnOutput: any[];
    let errorOutput: any[];
    let consoleLogRef: any;
    let consoleWarnRef: any;
    let consoleErrorRef: any;

    beforeEach(() => {
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
    });

    it('at default level (debug).', () => {
      const doInOut: Function = inOut();
      const descriptor: PropertyDescriptor = doInOut(
        TestClass.prototype.constructor,
        'doSync',
        Object.getOwnPropertyDescriptor(TestClass.prototype, 'doSync')
      );

      expect(descriptor).to.not.be.undefined;

      descriptor.value('test');

      expect(logOutput).to.have.lengthOf(2);
      expect(logOutput[0])
        .to.have.property('func')
        .that.equals('doSync()');
      expect(logOutput[0])
        .to.have.property('name')
        .that.equals('Function.inOut');
      expect(logOutput[0])
        .to.have.property('level')
        .that.equals('debug');
      expect(logOutput[0])
        .to.have.property('msg')
        .that.equals('inOut -->');
      expect(logOutput[1])
        .to.have.property('msg')
        .that.equals('inOut <--');
      expect(logOutput[1])
        .to.have.property('level')
        .that.equals('debug');
    });

    it('at trace level.', () => {
      const doInOut: Function = inOut({ level: 'trace' });
      const descriptor: PropertyDescriptor = doInOut(
        TestClass.prototype.constructor,
        'doSync',
        Object.getOwnPropertyDescriptor(TestClass.prototype, 'doSync')
      );

      expect(descriptor).to.not.be.undefined;

      descriptor.value('test');

      expect(logOutput).to.have.lengthOf(2);
      expect(logOutput[0])
        .to.have.property('func')
        .that.equals('doSync()');
      expect(logOutput[0])
        .to.have.property('name')
        .that.equals('Function.inOut');
      expect(logOutput[0])
        .to.have.property('level')
        .that.equals('trace');
      expect(logOutput[0])
        .to.have.property('msg')
        .that.equals('inOut -->');
      expect(logOutput[1])
        .to.have.property('msg')
        .that.equals('inOut <--');
      expect(logOutput[1])
        .to.have.property('level')
        .that.equals('trace');
    });

    it('at info level.', () => {
      const doInOut: Function = inOut({ level: 'info' });
      const descriptor: PropertyDescriptor = doInOut(
        TestClass.prototype.constructor,
        'doSync',
        Object.getOwnPropertyDescriptor(TestClass.prototype, 'doSync')
      );

      expect(descriptor).to.not.be.undefined;

      descriptor.value('test');

      expect(logOutput).to.have.lengthOf(2);
      expect(logOutput[0])
        .to.have.property('func')
        .that.equals('doSync()');
      expect(logOutput[0])
        .to.have.property('name')
        .that.equals('Function.inOut');
      expect(logOutput[0])
        .to.have.property('level')
        .that.equals('info');
      expect(logOutput[0])
        .to.have.property('msg')
        .that.equals('inOut -->');
      expect(logOutput[1])
        .to.have.property('msg')
        .that.equals('inOut <--');
      expect(logOutput[1])
        .to.have.property('level')
        .that.equals('info');
    });

    it('at warn level.', () => {
      const level: LogLevelString = 'warn';
      const doInOut: Function = inOut({ level });
      const descriptor: PropertyDescriptor = doInOut(
        TestClass.prototype.constructor,
        'doSync',
        Object.getOwnPropertyDescriptor(TestClass.prototype, 'doSync')
      );

      expect(descriptor).to.not.be.undefined;

      descriptor.value('test');

      expect(warnOutput).to.have.lengthOf(2);
      expect(warnOutput[0])
        .to.have.property('func')
        .that.equals('doSync()');
      expect(warnOutput[0])
        .to.have.property('name')
        .that.equals('Function.inOut');
      expect(warnOutput[0])
        .to.have.property('level')
        .that.equals(level);
      expect(warnOutput[0])
        .to.have.property('msg')
        .that.equals('inOut -->');
      expect(warnOutput[1])
        .to.have.property('msg')
        .that.equals('inOut <--');
      expect(warnOutput[1])
        .to.have.property('level')
        .that.equals(level);
    });

    it('at error level.', () => {
      const doInOut: Function = inOut({ level: 'error' });
      const descriptor: PropertyDescriptor = doInOut(
        TestClass.prototype.constructor,
        'doSync',
        Object.getOwnPropertyDescriptor(TestClass.prototype, 'doSync')
      );

      expect(descriptor).to.not.be.undefined;

      descriptor.value('test');

      expect(errorOutput).to.have.lengthOf(2);
      expect(errorOutput[0])
        .to.have.property('func')
        .that.equals('doSync()');
      expect(errorOutput[0])
        .to.have.property('name')
        .that.equals('Function.inOut');
      expect(errorOutput[0])
        .to.have.property('level')
        .that.equals('error');
      expect(errorOutput[0])
        .to.have.property('msg')
        .that.equals('inOut -->');
      expect(errorOutput[1])
        .to.have.property('msg')
        .that.equals('inOut <--');
      expect(errorOutput[1])
        .to.have.property('level')
        .that.equals('error');
    });

    it('at fatal level.', () => {
      const doInOut: Function = inOut({ level: 'fatal' });
      const descriptor: PropertyDescriptor = doInOut(
        TestClass.prototype.constructor,
        'doSync',
        Object.getOwnPropertyDescriptor(TestClass.prototype, 'doSync')
      );

      expect(descriptor).to.not.be.undefined;

      descriptor.value('test');

      expect(errorOutput).to.have.lengthOf(2);
      expect(errorOutput[0])
        .to.have.property('func')
        .that.equals('doSync()');
      expect(errorOutput[0])
        .to.have.property('name')
        .that.equals('Function.inOut');
      expect(errorOutput[0])
        .to.have.property('level')
        .that.equals('fatal');
      expect(errorOutput[0])
        .to.have.property('msg')
        .that.equals('inOut -->');
      expect(errorOutput[1])
        .to.have.property('msg')
        .that.equals('inOut <--');
      expect(errorOutput[1])
        .to.have.property('level')
        .that.equals('fatal');
    });
  });

  describe('should work for asynchronous (Promisified) execution.', () => {
    let logOutput: any[];
    let warnOutput: any[];
    let errorOutput: any[];
    let consoleLogRef: any;
    let consoleWarnRef: any;
    let consoleErrorRef: any;

    beforeEach(() => {
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
    });

    it('at default level (debug).', async () => {
      const level: LogLevelString = 'debug';
      const doInOut: Function = inOut();
      const descriptor: PropertyDescriptor = doInOut(
        TestClass.prototype.constructor,
        'doASync',
        Object.getOwnPropertyDescriptor(TestClass.prototype, 'doASync')
      );

      expect(descriptor).to.not.be.undefined;

      await descriptor.value('test');

      expect(logOutput).to.have.lengthOf(3);
      expect(logOutput[0])
        .to.have.property('func')
        .that.equals('doASync()');
      expect(logOutput[0])
        .to.have.property('name')
        .that.equals('Function.inOut');
      expect(logOutput[0])
        .to.have.property('level')
        .that.equals(level);
      expect(logOutput[0])
        .to.have.property('msg')
        .that.equals('inOut -->');
      expect(logOutput[1])
        .to.have.property('msg')
        .that.equals('inOut -- promisified function');
      expect(logOutput[1])
        .to.have.property('level')
        .that.equals(level);
      expect(logOutput[2])
        .to.have.property('msg')
        .that.equals('inOut <--');
      expect(logOutput[2])
        .to.have.property('level')
        .that.equals(level);
    });

    it('at trace level.', async () => {
      const level: LogLevelString = 'trace';
      const doInOut: Function = inOut({ level });
      const descriptor: PropertyDescriptor = doInOut(
        TestClass.prototype.constructor,
        'doASync',
        Object.getOwnPropertyDescriptor(TestClass.prototype, 'doASync')
      );

      expect(descriptor).to.not.be.undefined;

      await descriptor.value('test');

      expect(logOutput).to.have.lengthOf(3);
      expect(logOutput[0])
        .to.have.property('func')
        .that.equals('doASync()');
      expect(logOutput[0])
        .to.have.property('name')
        .that.equals('Function.inOut');
      expect(logOutput[0])
        .to.have.property('level')
        .that.equals(level);
      expect(logOutput[0])
        .to.have.property('msg')
        .that.equals('inOut -->');
      expect(logOutput[1])
        .to.have.property('msg')
        .that.equals('inOut -- promisified function');
      expect(logOutput[1])
        .to.have.property('level')
        .that.equals(level);
      expect(logOutput[2])
        .to.have.property('msg')
        .that.equals('inOut <--');
      expect(logOutput[2])
        .to.have.property('level')
        .that.equals(level);
    });

    it('at info level.', async () => {
      const level: LogLevelString = 'info';
      const doInOut: Function = inOut({ level });
      const descriptor: PropertyDescriptor = doInOut(
        TestClass.prototype.constructor,
        'doASync',
        Object.getOwnPropertyDescriptor(TestClass.prototype, 'doASync')
      );

      expect(descriptor).to.not.be.undefined;

      await descriptor.value('test');

      expect(logOutput).to.have.lengthOf(3);
      expect(logOutput[0])
        .to.have.property('func')
        .that.equals('doASync()');
      expect(logOutput[0])
        .to.have.property('name')
        .that.equals('Function.inOut');
      expect(logOutput[0])
        .to.have.property('level')
        .that.equals(level);
      expect(logOutput[0])
        .to.have.property('msg')
        .that.equals('inOut -->');
      expect(logOutput[1])
        .to.have.property('msg')
        .that.equals('inOut -- promisified function');
      expect(logOutput[1])
        .to.have.property('level')
        .that.equals(level);
      expect(logOutput[2])
        .to.have.property('msg')
        .that.equals('inOut <--');
      expect(logOutput[2])
        .to.have.property('level')
        .that.equals(level);
    });

    it('at warn level.', async () => {
      const level: LogLevelString = 'warn';
      const doInOut: Function = inOut({ level });
      const descriptor: PropertyDescriptor = doInOut(
        TestClass.prototype.constructor,
        'doASync',
        Object.getOwnPropertyDescriptor(TestClass.prototype, 'doASync')
      );

      expect(descriptor).to.not.be.undefined;

      await descriptor.value('test');

      expect(warnOutput).to.have.lengthOf(3);
      expect(warnOutput[0])
        .to.have.property('func')
        .that.equals('doASync()');
      expect(warnOutput[0])
        .to.have.property('name')
        .that.equals('Function.inOut');
      expect(warnOutput[0])
        .to.have.property('level')
        .that.equals(level);
      expect(warnOutput[0])
        .to.have.property('msg')
        .that.equals('inOut -->');
      expect(warnOutput[1])
        .to.have.property('msg')
        .that.equals('inOut -- promisified function');
      expect(warnOutput[1])
        .to.have.property('level')
        .that.equals(level);
      expect(warnOutput[2])
        .to.have.property('msg')
        .that.equals('inOut <--');
      expect(warnOutput[2])
        .to.have.property('level')
        .that.equals(level);
    });

    it('at error level.', async () => {
      const level: LogLevelString = 'error';
      const doInOut: Function = inOut({ level });
      const descriptor: PropertyDescriptor = doInOut(
        TestClass.prototype.constructor,
        'doASync',
        Object.getOwnPropertyDescriptor(TestClass.prototype, 'doASync')
      );

      expect(descriptor).to.not.be.undefined;

      await descriptor.value('test');

      expect(errorOutput).to.have.lengthOf(3);
      expect(errorOutput[0])
        .to.have.property('func')
        .that.equals('doASync()');
      expect(errorOutput[0])
        .to.have.property('name')
        .that.equals('Function.inOut');
      expect(errorOutput[0])
        .to.have.property('level')
        .that.equals(level);
      expect(errorOutput[0])
        .to.have.property('msg')
        .that.equals('inOut -->');
      expect(errorOutput[1])
        .to.have.property('msg')
        .that.equals('inOut -- promisified function');
      expect(errorOutput[1])
        .to.have.property('level')
        .that.equals(level);
      expect(errorOutput[2])
        .to.have.property('msg')
        .that.equals('inOut <--');
      expect(errorOutput[2])
        .to.have.property('level')
        .that.equals(level);
    });

    it('at fatal level.', async () => {
      const level: LogLevelString = 'fatal';
      const doInOut: Function = inOut({ level });
      const descriptor: PropertyDescriptor = doInOut(
        TestClass.prototype.constructor,
        'doASync',
        Object.getOwnPropertyDescriptor(TestClass.prototype, 'doASync')
      );

      expect(descriptor).to.not.be.undefined;

      await descriptor.value('test');

      expect(errorOutput).to.have.lengthOf(3);
      expect(errorOutput[0])
        .to.have.property('func')
        .that.equals('doASync()');
      expect(errorOutput[0])
        .to.have.property('name')
        .that.equals('Function.inOut');
      expect(errorOutput[0])
        .to.have.property('level')
        .that.equals(level);
      expect(errorOutput[0])
        .to.have.property('msg')
        .that.equals('inOut -->');
      expect(errorOutput[1])
        .to.have.property('msg')
        .that.equals('inOut -- promisified function');
      expect(errorOutput[1])
        .to.have.property('level')
        .that.equals(level);
      expect(errorOutput[2])
        .to.have.property('msg')
        .that.equals('inOut <--');
      expect(errorOutput[2])
        .to.have.property('level')
        .that.equals(level);
    });
  });
});
