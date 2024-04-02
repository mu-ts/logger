import 'mocha';
import { expect } from 'chai';
import { CreditCardLoggerFilter } from '../../src';

describe('CreditCardLoggerFilter', () => {
  let filter: CreditCardLoggerFilter;

  beforeEach(() => {
    filter = new CreditCardLoggerFilter();
  });

  it('should not redact short numbers', () => {
    const result = filter.redact({ value: '1234567890' });
    expect(result).to.equal('1234567890');
  });

  it('should not redact the replacement value itself', () => {
    const result = filter.redact({ value: '>>> REDACTED <<<' });
    expect(result).to.equal('>>> REDACTED <<<');
  });

  it('should redact 12-17 digit numbers that look like bank account numbers', () => {
    const result = filter.redact({ value: '123456789012' });
    expect(result).to.equal('>>> REDACTED <<<');
  });

  it('should redact numbers that look like credit card numbers with spaces', () => {
    const result = filter.redact({ value: '1234 5678 9012 3456' });
    expect(result).to.equal('>>> REDACTED <<<');
  });

  it('should redact numbers that look like actual credit card numbers', () => {
    const result = filter.redact({ value: '4111111111111111' }); // VISA test number
    expect(result).to.equal('>>> REDACTED <<<');
  });
});
