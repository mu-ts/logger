import 'mocha';
import { expect } from 'chai';
import { CreditCardLoggerFilter } from '../../src/index';
import { LoggerStatement } from '../../src/interfaces/LoggerStatement';

describe('CreditCardLoggerFilter', () => {
  describe('construct', () => {
    it('without error', () => {
      expect(new CreditCardLoggerFilter()).to.not.throw;
    });
  });

  describe('filter suspected credit card', () => {
    const creditCardFilter: CreditCardLoggerFilter = new CreditCardLoggerFilter();

    it('from message', () => {
      const statement: LoggerStatement = {
        at: new Date(),
        level: 'debug',
        name: 'test',
        msg: 'I have a credit card of 1234 5678 1234 1234',
        data: {},
      } as LoggerStatement;

      creditCardFilter.filter(statement);
      expect(statement.msg).to.not.be.undefined;

      const message: string = statement.msg as string;

      expect(message.endsWith('>>> REDACTED <<<')).to.be.true;
    });

    it('from data', () => {
      const statement: LoggerStatement = {
        at: new Date(),
        level: 'debug',
        name: 'test',
        msg: 'I have a credit card of 1234 5678 1234 1234',
        data: {
          user: {
            credit: 1234567890123456,
            card: '3214 5321 1234 3213',
            bankNumber: 'This is 3214 5321 1234 3213',
          },
        },
      } as LoggerStatement;

      creditCardFilter.filter(statement);

      expect(statement.msg).to.not.be.undefined;
      expect(statement.data).to.not.be.undefined;

      const message: string = statement.msg as string;
      const data: any = statement.data as any;

      expect(message.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(data.user.credit).equals('>>> REDACTED <<<');
      expect(data.user.card).equals('>>> REDACTED <<<');
      expect(data.user.bankNumber.endsWith('>>> REDACTED <<<')).to.be.true;
    });

    it('from data when deeploy nested', () => {
      const statement: LoggerStatement = {
        at: new Date(),
        level: 'debug',
        name: 'test',
        msg: 'I have a credit card of 1234 5678 1234 1234',
        data: {
          a: {
            b: {
              c: {
                d: {
                  e: {
                    user: {
                      credit: 1234567890123456,
                      innocentValue: '3214 5321 1234 3213',
                      bankNumber: 'This is 3214 5321 1234 3213',
                    },
                  },
                },
              },
            },
          },
        },
      } as LoggerStatement;

      creditCardFilter.filter(statement);

      expect(statement.data).to.not.be.undefined;

      const data: any = statement.data as any;
      const nestedData: any = data.a.b.c.d.e.user;

      expect(nestedData.credit).equals('>>> REDACTED <<<');
      expect(nestedData.innocentValue).equals('>>> REDACTED <<<');
      expect(nestedData.bankNumber.endsWith('>>> REDACTED <<<')).to.be.true;
    });
  });
});
