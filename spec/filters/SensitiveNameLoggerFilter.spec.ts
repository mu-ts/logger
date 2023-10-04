import 'mocha';
import { expect } from 'chai';
import { SensitiveNameLoggerFilter } from '../../src/index';

describe('SensitiveNameLoggerFilter', () => {
  let filter: SensitiveNameLoggerFilter;

  beforeEach(() => {
    filter = new SensitiveNameLoggerFilter();
  });

  it('should redact dangerous field names regardless of the value', () => {
    const dangerousFieldNames = [
      'account number',
      'account-number',
      'bank',
      'bank-account',
      'card',
      'password',
      'secret'
    ];

    dangerousFieldNames.forEach(fieldName => {
      const result = filter.redact({ fieldName, value: 'anything' });
      expect(result).to.equal('>>> REDACTED <<<');
    });
  });

  it('should not redact safe field names', () => {
    const safeFieldNames = [
      'username',
      'email',
      'phone'
    ];

    safeFieldNames.forEach(fieldName => {
      const result = filter.redact({ fieldName, value: 'anything' });
      expect(result).to.equal('anything');
    });
  });

  it('should be case-insensitive when redacting dangerous field names', () => {
    const fieldName = 'Account Number';
    const result = filter.redact({ fieldName, value: 'anything' });
    expect(result).to.equal('>>> REDACTED <<<');
  });
});
