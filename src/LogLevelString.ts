/**
 * The available logging levels for all loggers. There is a natural hierarchy to the
 * logging levels that ensure that when a level is set, you only see statements of
 * that level or higher.
 *
 * 1. trace (lowest)
 * 2. debug
 * 3. info (default)
 * 4. warn
 * 5. error
 * 6. fatal (highest, most strict)
 **/
export type LogLevelString = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
