import { LogLevelString } from '..';

/**
 * Internal tracking of logging levels by name.
 */
export interface DefaultLevels {
  default_level: LogLevelString;
  [key: string]: LogLevelString;
}
