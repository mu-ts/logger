import { LoggerFilter, ToRedact } from '../index';

/**
 * Credit card information leaking into logs is a big PCI risk. So
 * we aggressively seek out data that looks like a CC number and redact it.
 */
export class CreditCardLoggerFilter implements LoggerFilter {
  private readonly replaceValue: string = '>>> REDACTED <<<';

  private readonly BANK_DIGITS: RegExp = new RegExp(/\b\d{12,17}\b/g); // anything that doesn't look like a phone number

  private readonly CC_DIGITS_SPACES: RegExp = new RegExp(/\b(?:\d[ -]*?){13,16}\b/g);

  private readonly CC_DIGITS: RegExp = new RegExp(
    /(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})/g,
  );

  public redact({ value }: ToRedact): unknown {
    const strValue: string = String(value);
    if (strValue === this.replaceValue || strValue.length < 12) return value; // try to avoid unnecessary regex checks
    return strValue
      .replace(this.BANK_DIGITS, this.replaceValue)
      .replace(this.CC_DIGITS, this.replaceValue)
      .replace(this.CC_DIGITS_SPACES, this.replaceValue);
  }
}
