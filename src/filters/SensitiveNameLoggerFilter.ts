import { LoggerFilter, ToRedact } from '../index';

/**
 * This logger filter is pesimistic because it does not attempt to check values
 * it just looks for 'hints' of wrong doing and redacts information aggressively
 * try to ensure no leak takes place.
 */
export class SensitiveNameLoggerFilter implements LoggerFilter {
  private readonly replaceValue: string = '>>> REDACTED <<<';
  private readonly dangerousFieldNames: Set<string> = new Set([
    'credit card',
    'credit-card',
    'creditcard',
    'creditCard',
    'card number',
    'card-number',
    'cardnumber',
    'cardNumber',
    'credit card number',
    'credit-card-number',
    'creditcard-number',
    'credit-cardnumber',
    'creditcardnumber',
    'creditcardNumber',
    'account number',
    'account-number',
    'accountnumber',
    'accountNumber',
    'bank account',
    'bank-account',
    'bankaccount',
    'bankAccount',
    'bank account number',
    'bank-account-number',
    'bank-accountnumber',
    'bankaccount-number',
    'bankaccountnumber',
    'routing number',
    'routing-number',
    'routingnumber',
    'routingNumber',
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
