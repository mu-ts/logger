import { Logger } from './index';
import { LoggerService } from './LoggerService';

/**
 * Adds input and output 'debug' statements for a function when it is executed. Uses
 * either the logger provided, or uses a logger under the name provided.
 *
 * @param name of the logger to use.
 */
export function inOut(isTrace: boolean = false) {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const decoratorLogger: Logger = target.logger || LoggerService.named(target.constructor.name);
    const method = descriptor.value;

    descriptor.value = function(...args: any[]) {
      if (isTrace) decoratorLogger.trace({ data: args }, `${String(propertyKey)}() -->`);
      else decoratorLogger.debug({ data: args }, `${String(propertyKey)}() -->`);

      const result = method.apply(this, args);

      if (isTrace) decoratorLogger.trace({ data: result }, `${String(propertyKey)}() <--`);
      else decoratorLogger.debug({ data: result }, `${String(propertyKey)}() <--`);

      return result;
    };

    return descriptor;
  };
}
