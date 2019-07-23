import { expect } from 'chai';
import 'mocha';
import { LoggerService } from '../src/LoggerService';

describe('LoggerService', () => {
  it('Should get default without error', () => {
    expect(() => LoggerService.defaultLogger()).to.not.throw(Error);
  });

  it('Should get named without error', () => {
    expect(() => LoggerService.named('x')).to.not.throw(Error);
  });

  it('Should set the level to trace', () => {
    expect(() => LoggerService.setLevel('trace')).to.not.throw(Error);
    expect(LoggerService.defaultLogger().trace()).to.equal(true);
  });

  it('Should have trace method', () => {
    expect(LoggerService.defaultLogger()).to.have.property('trace');
    expect(LoggerService.named('X')).to.have.property('trace');
  });

  it('Should set the level to debug', () => {
    expect(() => LoggerService.setLevel('debug')).to.not.throw(Error);
    expect(LoggerService.defaultLogger().debug()).to.equal(true);
  });

  it('Should have debug method', () => {
    expect(LoggerService.defaultLogger()).to.have.property('debug');
    expect(LoggerService.named('X')).to.have.property('debug');
  });

  it('Should set the level to info', () => {
    expect(() => LoggerService.setLevel('info')).to.not.throw(Error);
    expect(LoggerService.defaultLogger().info()).to.equal(true);
  });

  it('Should have info method', () => {
    expect(LoggerService.defaultLogger()).to.have.property('info');
    expect(LoggerService.named('X')).to.have.property('info');
  });

  it('Should set the level to warn', () => {
    expect(() => LoggerService.setLevel('warn')).to.not.throw(Error);
    expect(LoggerService.defaultLogger().warn()).to.equal(true);
  });

  it('Should have warn method', () => {
    expect(LoggerService.defaultLogger()).to.have.property('warn');
    expect(LoggerService.named('X')).to.have.property('warn');
  });

  it('Should set the level to error', () => {
    expect(() => LoggerService.setLevel('error')).to.not.throw(Error);
    expect(LoggerService.defaultLogger().error()).to.equal(true);
  });

  it('Should have error method', () => {
    expect(LoggerService.defaultLogger()).to.have.property('error');
    expect(LoggerService.named('X')).to.have.property('error');
  });

  it('Should set the level to fatal', () => {
    expect(() => LoggerService.setLevel('fatal')).to.not.throw(Error);
    expect(LoggerService.defaultLogger().fatal()).to.equal(true);
  });

  it('Should have fatal method', () => {
    expect(LoggerService.defaultLogger()).to.have.property('fatal');
    expect(LoggerService.named('X')).to.have.property('fatal');
  });

  it('Should have level method', () => {
    expect(LoggerService.defaultLogger()).to.have.property('level');
    expect(LoggerService.named('X')).to.have.property('level');
  });
});
