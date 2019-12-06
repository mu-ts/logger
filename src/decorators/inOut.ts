import { LoggerConfig, Logger, LoggerService } from '..';
import { duration } from './duration';

/**
 * Adds input and output 'debug' statements for a function when it is executed. Uses
 * either the logger provided, or uses a logger under the name provided.
 *
 * For logging statements, this decorator will look for a 'logger' object
 * on the containing class of the function this decorator is associated to. If
 * one is found, it is used, otherwise a logger is created under the name
 * of the parent.
 *
 * @param configuration of this inOut logging statement.
 */
export function inOut(config?: LoggerConfig) {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const decoratorLogger: Logger = target.logger || LoggerService.named(target.constructor.name);
    const method = descriptor.value;

    descriptor.value = function(...args: any[]) {
      decoratorLogger.log(config && config.level ? config.level : 'debug', `${new String(propertyKey)}()`, '-->', {
        args,
      });

      let result: any | Promise<any> = method.apply(target, args);

      if ((typeof result === 'function' || typeof result === 'object') && typeof result.then === 'function') {
        decoratorLogger.log(
          config && config.level ? config.level : 'debug',
          `${new String(propertyKey)}()`,
          'promisified function',
          {
            result,
          }
        );

        const newPromise: Promise<any> = new Promise((resolve, reject) => {
          result
            .then((resolvedValue: any) => {
              decoratorLogger.log(
                config && config.level ? config.level : 'debug',
                `${new String(propertyKey)}()`,
                '<--',
                {
                  resolvedValue,
                }
              );
              resolve(resolvedValue);
            })
            .catch(reject);
        });

        return newPromise;
      } else {
        decoratorLogger.log(config && config.level ? config.level : 'debug', `${new String(propertyKey)}()`, '<--', {
          result,
        });
        return result;
      }
    };

    return descriptor;
  };
}

class Test {
  @inOut()
  doThis(x: string): string {
    return `Result ${x}`;
  }

  @duration()
  @inOut()
  async doThisLonger(x: string): Promise<string> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        resolve(`Result ${x}`);
      }, 435)
    );
  }
}

async function doThing() {
  const test: Test = new Test();

  test.doThis('test');
  const value: string = await test.doThisLonger('test');
}

doThing();
