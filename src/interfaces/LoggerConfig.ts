import { LogLevelString } from '../index';

export interface LoggerConfig {
  name?: string;
  level?: LogLevelString;
  adornments?: Record<string, string>;
}
