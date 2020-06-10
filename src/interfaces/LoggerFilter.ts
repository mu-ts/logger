export interface ToRedact { fieldName?: string, value?: string | number }

/**
 * When implemented and provided to the LoggerService, will wrap around
 * log statements that successfully render and redact/remove sensitive
 * information.
 */
export interface LoggerFilter {
  redact(toRedact: ToRedact): any;
}
