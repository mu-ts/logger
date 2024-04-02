export interface ToRedact { fieldName?: string, value?: unknown }

/**
 * When implemented and provided to the LoggerService, will wrap around
 * log statements that successfully render and redact/remove sensitive
 * information.
 */
export interface LoggerFilter {
  redact(toRedact: ToRedact): unknown;
}
