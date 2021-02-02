import { LoggerFilter, ToRedact } from '../index';

/**
 * This logger filter is pessimistic because it does not attempt to check values
 * it just looks for 'hints' of wrong doing and redacts information aggressively
 * try to ensure no leak takes place.
 */
export class SensitiveNameLoggerFilter implements LoggerFilter {
  private readonly replaceValue: string = '>>> REDACTED <<<';
  private readonly dangerousFieldNames: Set<string> = new Set([
    'account number',
    'account-number',
    'accountnumber',
    'bank',
    'bank account',
    'bank-account',
    'bankaccount',
    'bank account number',
    'bank-account-number',
    'bank-accountnumber',
    'bankaccount-number',
    'bankaccountnumber',
    'bank number',
    'bank-number',
    'banknumber',
    'card',
    'card number',
    'card-number',
    'cardnumber',
    'credit card',
    'credit-card',
    'creditcard',
    'credit card number',
    'credit-card-number',
    'creditcard-number',
    'credit-cardnumber',
    'creditcardnumber',
    'routing number',
    'routing-number',
    'routingnumber',
    'pass',
    'password',
    'pw',
    'pwd',
    'secret',
    'shared secret',
    'shared-secret',
    'sharedsecret',
  ]);

  public redact(toRedact: ToRedact): any {
    const { fieldName, value } = toRedact as ToRedact;
    return (this.dangerousFieldNames.has(fieldName.toLocaleLowerCase())) ? this.replaceValue : value;
  }
}
