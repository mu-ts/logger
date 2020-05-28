import { LoggerFilter } from '../index';
import { LoggerStatement } from '../interfaces/LoggerStatement';

/**
 * Credit card information leaking into logs is a big PCI risk. So
 * we agressively seek out data that looks like a CC number and redact it.
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
      if (!value) return;
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          data[fieldName] = [...value].map((arrayItem: any) => this.startRedacting(arrayItem));
        } else {
          data[fieldName] = this.startRedacting(value);
        }
      } else {
        const lookoutKeys: string[] = ['body', 'rawBody'];
        if (lookoutKeys.some(key => key === fieldName)) {
          const obj: object = this.parseJSON(value);
          data[fieldName] = obj ? JSON.stringify(this.startRedacting(obj)) : this.redact(String(value));
        } else {
          /**
           * Look for a match, with a lower cased name, and with
           * the name having all special characters removed.
           */
          data[fieldName] = this.redact(String(value));
        }
      }
    });
    return data;
  }

  /**
   * Replace value with ">>> REDACTED <<<" if it matches one of the defined RegEx
   * @param value
   */
  private redact(value: string): string {
    return value
      .replace(this.BANK_DIGITS, this.replaceValue)
      .replace(this.CC_DIGITS, this.replaceValue)
      .replace(this.CC_DIGITS_SPACES, this.replaceValue);
  }

  /**
   * Try to convert a JSON string into an object.
   * @param str
   */
  private parseJSON(json: string): any {
    try {
      const obj: object = JSON.parse(json);
      return !!obj && typeof obj === 'object' && obj;
    } catch (e) {
      /* ignore */
    }
    return false;
  }
}
