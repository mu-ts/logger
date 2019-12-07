import 'mocha';
import { expect } from 'chai';
import { LogLevelString, Logger } from '../../src';
import { CreditCardLoggerFilter } from '../../src/filters/CreditCardLoggerFilter';
import { LoggerStatement } from '../../src/interfaces/LoggerStatement';

describe('CreditCardLoggerFilter', () => {
  describe('construct', () => {
    it('without error', () => {
      expect(new CreditCardLoggerFilter()).to.not.throw;
    });
  });

  describe('filter', () => {
    const creditCardFilter: CreditCardLoggerFilter = new CreditCardLoggerFilter();

    it('from message', () => {
      const statement: LoggerStatement = {
        at: new Date(),
        level: 'debug',
        name: 'test',
        msg: 'I have a credit card of 1234 5678 1234 1234',
      } as LoggerStatement;

      creditCardFilter.filter(statement);
      expect(statement.msg).to.not.be.undefined;

      const message: string = statement.msg as string;

      expect(message.endsWith('>>> REDACTED <<<')).to.be.true;
    });
  });
});
