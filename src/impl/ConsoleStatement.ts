import { LogLevelString } from '..';

export interface ConsoleStatement {
  obj: string;
  func: string;
  at: Date;
  msg: string;
  level: LogLevelString;
  err: Error;
  data: { [key: string]: any };
}
