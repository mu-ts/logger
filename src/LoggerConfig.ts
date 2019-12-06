import { LogLevelString } from '.';

export interface LoggerConfig {
  name: string;
  level?: LogLevelString;
}
