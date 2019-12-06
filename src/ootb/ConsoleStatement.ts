import { LogLevelString } from '..';

export interface ConsoleStatement {
  name: string;
  clazz?: string;
  func?: string;
  at: Date;
  msg: string;
  level: LogLevelString;
  err?: Error;
  errs?: Error[];
  data?: { [key: string]: any };
}
