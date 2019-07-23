import { LogLevelString } from './index';

export interface DefaultLevels {
  default_level: LogLevelString;
  [key: string]: LogLevelString;
}
