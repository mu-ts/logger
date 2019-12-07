import { LoggerFilter } from '..';
import { LoggerStatement } from '../interfaces/LoggerStatement';

/**
 * Credit card information leaking into logs is a big PCI risk. So
 * we agressively seek out data that looks like a CC number and redact it.
 */
export class CreditCardLoggerFilter implements LoggerFilter {
  private readonly replaceValue: string = '>>> REDACTED <<<';
  private readonly SIXTEEN_DIGITS: RegExp = new RegExp(/([0-9]){16}/g);
  private readonly CC_DIGITS: RegExp = new RegExp(/([0-9]){4}\s([0-9]){4}\s([0-9]){4}\s([0-9]){4}/g);

  public filter(statement: LoggerStatement): void {
    if (statement.msg) {
      statement.msg = statement.msg.replace(this.SIXTEEN_DIGITS, this.replaceValue);
      statement.msg = statement.msg.replace(this.CC_DIGITS, this.replaceValue);
    }
    if (statement.data) statement.data = this.redact(statement.data);

    console.log('statement', statement);
  }

  private redact(data: any): any {
    const keys: string[] = Object.keys(data);

    keys.forEach((fieldName: string) => {
      const value: any = data[fieldName];
      if (!value) return;
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          data[fieldName] = value.map((arrayItem: any) => this.redact(arrayItem));
        } else {
          data[fieldName] = this.redact(value);
        }
      } else if (typeof value === 'number' && `${value}`.length === 16) {
        data[fieldName] = this.replaceValue;
      } else if (typeof value === 'string') {
        /**
         * Look for a match, with a lower cased name, and with
         * the name having all special characters removed.
         */
        data[fieldName] = value.replace(this.SIXTEEN_DIGITS, this.replaceValue);
        data[fieldName] = value.replace(this.CC_DIGITS, this.replaceValue);
      }
    });

    return data;
  }
}

new CreditCardLoggerFilter().filter({
  msg: 'Here is my credit card 1234 1231 1231 3212',
  at: new Date(),
  level: 'info',
  name: 'Test',
  data: {
    user: {
      credit: 1234567890123456,
      card: '3214 5321 1234 3213',
      bankNumber: 'This is 3214 5321 1234 3213',
    },
  },
});
