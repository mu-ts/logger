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
    const sensitiveNameFilter: SensitiveNameLoggerFilter = new SensitiveNameLoggerFilter();

    it('but not data redaction', () => {
      const statement: LoggerStatement = {
        at: new Date(),
        level: 'debug',
        name: 'test',
        data: {
          test: ['test'],
          test2: 0,
          test3: true,
          test4: "true",
          test5: [0]
        }
      } as LoggerStatement;

      sensitiveNameFilter.filter(statement);
      expect(JSON.stringify(statement.data).includes('>>> REDACTED <<<')).to.be.false;
    });

    it('but not message redaction', () => {
      const statement: LoggerStatement = {
        at: new Date(),
        level: 'debug',
        name: 'test',
        msg: 'I have a credit card of 1234 5678 1234 1234',
      } as LoggerStatement;

      sensitiveNameFilter.filter(statement);
      expect(statement.msg).to.equal('I have a credit card of 1234 5678 1234 1234');
    });

    it(`check for possible 'credit card' looking field names`, () => {
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
            cardArray: [{
              'credit card': '3214 5321 1234 3213',
            }],
          }
        },
      } as LoggerStatement;

      sensitiveNameFilter.filter(statement);
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
