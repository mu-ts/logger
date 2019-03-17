import { ConsoleLogger } from "./ConsoleLogger";
import { LogLevel, Logger } from "./Logger";

/**
 * Convenience method for getting a console logger instance.
 *
 * @param name space of the logger.
 * @param level to set the logging to.
 */
export function defaultLogger(name: string, level?: LogLevel): Logger {
  return new ConsoleLogger(name, level);
}

export { ConsoleLogger, Logger, LogLevel };