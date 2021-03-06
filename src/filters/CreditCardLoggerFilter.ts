import { LoggerFilter } from '../index';
import { LoggerStatement } from '../interfaces/LoggerStatement';

/**
 * Credit card information leaking into logs is a big PCI risk. So
 * we aggressively seek out data that looks like a CC number and redact it.
 */
export class CreditCardLoggerFilter implements LoggerFilter {
  private readonly replaceValue: string = '>>> REDACTED <<<';
  private readonly BANK_DIGITS: RegExp = new RegExp(/\b\d{12,17}\b/g); // anything that doesn't look like a phone number
  private readonly CC_DIGITS_SPACES: RegExp = new RegExp(/\b(?:\d[ -]*?){13,16}\b/g);
  private readonly CC_DIGITS: RegExp = new RegExp(
    /(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})/g
  );

  public filter(statement: LoggerStatement): void {
    if (statement.msg) statement.msg = this.redact(statement.msg);
    if (statement.data) statement.data = this.startRedacting(statement.data);
  }

  private startRedacting(data: any): any {
    if (!data) return;
    if (typeof data !== 'object') return this.redact(data);

    // iterate through the object properties
    const keys: string[] = Object.keys(data);
    keys.forEach((fieldName: string) => {
      const value: any = data[fieldName];

      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          data[fieldName] = [...value].map((arrayItem: any) => this.startRedacting(arrayItem));
        } else {
          data[fieldName] = this.startRedacting(value);
        }
      } else {
        /**
         * Look for a match, with a lower cased name, and with
         * the name having all special characters removed.
         */
        data[fieldName] = this.redact(value);
      }
    });
    return data;
  }

  /**
   * Replace value with ">>> REDACTED <<<" if it matches one of the defined RegEx
   * @param value
   */
  private redact(value: string): string {
    return String(value)
      .replace(this.BANK_DIGITS, this.replaceValue)
      .replace(this.CC_DIGITS, this.replaceValue)
      .replace(this.CC_DIGITS_SPACES, this.replaceValue);
  }
}
