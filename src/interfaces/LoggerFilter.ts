import { LoggerStatement } from './LoggerStatement';

/**
 * When implemented and provided to the LoggerService, will wrap around
 * log statements that successfully render and redact/remove sensitive
 * information.
 */
export interface LoggerFilter {
  filter(statement: LoggerStatement): void;
}
