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

    it('from data when deeply nested, no spaces (i.e. xxxxxxxxxxxxxxxx)', () => {
      const statement: LoggerStatement = {
        at: new Date(),
        level: 'debug',
        name: 'test',
        msg: 'I have a credit card of 4111111111111111',
        data: {
          a: {
            b: {
              c: {
                d: {
                  e: {
                    user: {
                      credit: 1234567890123456,
                      visaCard: 4111111111111111,
                      amexCard: 378282246310005,
                      dinersCard: 30569309025904,
                      innocentValue: '3214532112343213',
                      bankNumber: 'This is 3214532112343213',
                      mastercard: 'This is 5555555555554444',
                      visa: 'This is 4012888888881881',
                      amex: 'This is 378282246310005',
                      diners: 'This is 30569309025904',
                      discover: 'This is 6011111111111117',
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
      console.log(`nestedData: ${JSON.stringify(nestedData)}`);

      expect(nestedData.credit).equals('>>> REDACTED <<<');
      expect(nestedData.visaCard).equals('>>> REDACTED <<<');
      expect(nestedData.amexCard).equals('>>> REDACTED <<<');
      expect(nestedData.dinersCard).equals('>>> REDACTED <<<');
      expect(nestedData.innocentValue).equals('>>> REDACTED <<<');
      expect(nestedData.bankNumber.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.mastercard.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.visa.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.amex.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.diners.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.discover.endsWith('>>> REDACTED <<<')).to.be.true;
    });

    it('from data when deeply nested, with spaces in between (i.e. xxxx xxxx xxxx xxxx)', () => {
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
                      innocentValue: '3214 5321 1234 3213',
                      bankNumber: 'This is 3214 5321 1234 3213',
                      amex: '3714 496353 98431',
                      diners: '3056 9309 0259 04',
                      mastercard: '5555 5555 5555 4444',
                      visa: '4111 1111 1111 1111',
                      discover: '6011 1111 1111 1117',
                      amex2: 'This is 3714 496353 98431',
                      diners2: 'This is 3056 9309 0259 04',
                      mastercard2: 'This is 5555 5555 5555 4444',
                      visa2: 'This is 4111 1111 1111 1111',
                      discover2: 'This is 6011 1111 1111 1117',
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
      console.log(`nestedData: ${JSON.stringify(nestedData)}`);

      expect(nestedData.innocentValue).equals('>>> REDACTED <<<');
      expect(nestedData.bankNumber.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.mastercard.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.visa.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.amex.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.diners.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.discover.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.mastercard2.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.visa2.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.amex2.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.diners2.endsWith('>>> REDACTED <<<')).to.be.true;
      expect(nestedData.discover2.endsWith('>>> REDACTED <<<')).to.be.true;
    });
  });
});
