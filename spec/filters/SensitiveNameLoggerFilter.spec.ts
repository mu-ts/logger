import 'mocha';
import { expect } from 'chai';
import { SensitiveNameLoggerFilter } from '../../src/index';
import { LoggerStatement } from '../../src/interfaces/LoggerStatement';

describe('SensitiveNameLoggerFilter', () => {
  describe('construct', () => {
    it('without error', () => {
      expect(new SensitiveNameLoggerFilter()).to.not.throw;
    });
  });

  describe('filter sensitive fields', () => {
    const creditCardFilter: SensitiveNameLoggerFilter = new SensitiveNameLoggerFilter();

    it('but not message', () => {
      const statement: LoggerStatement = {
        at: new Date(),
        level: 'debug',
        name: 'test',
        msg: 'I have a credit card of 1234 5678 1234 1234',
      } as LoggerStatement;

      creditCardFilter.filter(statement);
      expect(statement.msg).to.equal('I have a credit card of 1234 5678 1234 1234');
    });

    it('if looks like credot card', () => {
      const statement: LoggerStatement = {
        at: new Date(),
        level: 'debug',
        name: 'test',
        msg: 'Some message',
        data: {
          user: {
            creditCard: 'test',
            creditCardNumber: 'test',
            'credit-card': 'test',
          },
          paymentMethod: {
            'credit-card-number': 'test',
            'credit card': 'test',
          },
        },
      } as LoggerStatement;

      creditCardFilter.filter(statement);
      expect(statement.msg).to.equal('Some message');

      const data: any = statement.data as any;

      expect(data)
        .to.have.property('user')
        .to.have.property('creditCard')
        .that.equals('>>> REDACTED <<<');

      expect(data)
        .to.have.property('user')
        .to.have.property('creditCardNumber')
        .that.equals('>>> REDACTED <<<');

      expect(data)
        .to.have.property('user')
        .to.have.property('credit-card')
        .that.equals('>>> REDACTED <<<');

      expect(data)
        .to.have.property('paymentMethod')
        .to.have.property('credit-card-number')
        .that.equals('>>> REDACTED <<<');

      expect(data)
        .to.have.property('paymentMethod')
        .to.have.property('credit card')
        .that.equals('>>> REDACTED <<<');
    });
  });
});
