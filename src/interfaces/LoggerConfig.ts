import { LogLevelString } from '../index';

export interface LoggerConfig {
  name?: string;
  level?: LogLevelString;
  adornments?: { [key: string]: string };
}
